from django.db import models, transaction
from django.db.models import F
from django.core.exceptions import ValidationError

from apps.usine.models import Machine, Operateur
from apps.stock_achats.models import Piece

class Maintenance(models.Model):
    """
    Intervention de maintenance préventive ou curative sur une machine donnée.
    """
    dateDebut = models.DateField(verbose_name="Date de début d'intervention")
    heureDebut = models.TimeField(verbose_name="Heure de début d'intervention")
    duree = models.DurationField(
        verbose_name="Durée de l'intervention (HH:MM:SS)",
        help_text="Durée totale constatée par l'opérateur"
    )
    machine = models.ForeignKey(
        Machine,
        on_delete=models.PROTECT,
        related_name='maintenances',
        verbose_name="Machine concernée"
    )
    operateurs = models.ManyToManyField(
        Operateur,
        related_name='maintenances',
        verbose_name="Opérateurs intervenants"
    )

    class Meta:
        verbose_name = "Intervention de Maintenance"
        verbose_name_plural = "Interventions de Maintenance"
        ordering = ['-dateDebut', '-heureDebut']

    @property
    def idMaintenance(self):
        return self.id

    def declarer(self):
        self.save()

    def noterTemps(self, duree):
        self.duree = duree
        self.save(update_fields=['duree'])

    def consommerPieces(self, piece: Piece, quantite: int):
        return ConsommationPiece.objects.create(
            maintenance=self,
            piece=piece,
            quantiteConsommee=quantite
        )

    def __str__(self):
        return f"Maintenance #{self.id} sur {self.machine.referenceMachine} ({self.dateDebut} - {self.duree})"


class ConsommationPiece(models.Model):
    """
    Consommation d'une pièce détachée lors d'une intervention de maintenance.
    Règle critique : Décrémentation transactionnelle atomique du stock avec contrôle préalable.
    """
    maintenance = models.ForeignKey(
        Maintenance,
        on_delete=models.CASCADE,
        related_name='consommations',
        verbose_name="Intervention de maintenance"
    )
    piece = models.ForeignKey(
        Piece,
        on_delete=models.PROTECT,
        related_name='consommations',
        verbose_name="Pièce détachée consommée"
    )
    quantiteConsommee = models.PositiveIntegerField(
        verbose_name="Quantité consommée"
    )

    class Meta:
        verbose_name = "Consommation de Pièce"
        verbose_name_plural = "Consommations de Pièces"

    def clean(self):
        if self.quantiteConsommee is not None and self.quantiteConsommee <= 0:
            raise ValidationError("La quantité consommée doit être strictement positive.")

    @transaction.atomic
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        self.full_clean()

        # Verrouillage pessimiste de la pièce pour éviter les race conditions (concurrence)
        piece = Piece.objects.select_for_update().get(pk=self.piece_id)

        if is_new:
            if piece.quantiteStock < self.quantiteConsommee:
                raise ValidationError(
                    f"Stock insuffisant pour la pièce '{piece.referencePiece}'. "
                    f"Disponible : {piece.quantiteStock}, Demandé : {self.quantiteConsommee}."
                )
            piece.quantiteStock = F('quantiteStock') - self.quantiteConsommee
            piece.save(update_fields=['quantiteStock'])
        else:
            # En cas de modification d'une consommation existante, ajustement du différentiel
            ancien = ConsommationPiece.objects.get(pk=self.pk)
            diff = self.quantiteConsommee - ancien.quantiteConsommee
            if diff > 0 and piece.quantiteStock < diff:
                raise ValidationError(
                    f"Stock insuffisant pour ajouter {diff} unités de '{piece.referencePiece}'."
                )
            piece.quantiteStock = F('quantiteStock') - diff
            piece.save(update_fields=['quantiteStock'])

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantiteConsommee}x {self.piece.referencePiece} (Maint #{self.maintenance_id})"

