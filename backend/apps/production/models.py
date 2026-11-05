from django.db import models
from apps.usine.models import LigneProduction, Operateur

class Produit(models.Model):
    """
    Catalogue des produits finis fabriqués par l'usine.
    """
    referenceProduit = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Référence produit"
    )
    designation = models.CharField(max_length=200, verbose_name="Désignation")
    prixVenteUnitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix de vente unitaire (€)"
    )
    quantiteStock = models.IntegerField(
        default=0,
        verbose_name="Quantité en stock"
    )

    class Meta:
        verbose_name = "Produit Fini"
        verbose_name_plural = "Produits Finis"
        ordering = ['referenceProduit']

    def enregistrer(self):
        self.save()

    def modifier(self, **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)
        self.save()

    def supprimer(self):
        self.delete()

    def __str__(self):
        return f"{self.referenceProduit} - {self.designation}"


class LotProduction(models.Model):
    """
    Lot de fabrication unique avec traçabilité complète de la ligne,
    du produit et des ouvriers affectés par leur matricule.
    """
    idLot = models.IntegerField(unique=True, verbose_name="Numéro de lot")
    dateProduction = models.DateField(verbose_name="Date de production")
    ligne = models.ForeignKey(
        LigneProduction,
        on_delete=models.PROTECT,
        related_name='lots',
        verbose_name="Ligne de production"
    )
    produit = models.ForeignKey(
        Produit,
        on_delete=models.PROTECT,
        related_name='lots',
        verbose_name="Produit fabriqué"
    )
    operateurs = models.ManyToManyField(
        Operateur,
        related_name='lots',
        verbose_name="Ouvriers ayant œuvré sur le lot"
    )

    class Meta:
        verbose_name = "Lot de Production"
        verbose_name_plural = "Lots de Production"
        ordering = ['-dateProduction', 'idLot']

    def enregistrer(self):
        self.save()

    def associerOperateur(self, operateur: Operateur):
        self.operateurs.add(operateur)

    def __str__(self):
        return f"Lot #{self.idLot} - {self.produit.referenceProduit} ({self.dateProduction})"


class TypeIncident(models.Model):
    """
    Référentiel des typologies d'incidents d'arrêt (panne mécanique, électrique, rupture matière...).
    """
    codeType = models.CharField(
        max_length=30,
        unique=True,
        verbose_name="Code type incident"
    )
    libelle = models.CharField(max_length=150, verbose_name="Libellé de l'incident")

    class Meta:
        verbose_name = "Type d'Incident"
        verbose_name_plural = "Types d'Incidents"
        ordering = ['codeType']

    def gererType(self):
        self.save()

    def __str__(self):
        return f"[{self.codeType}] {self.libelle}"


class IncidentProduction(models.Model):
    """
    Incident de production survenu sur un lot unique avec relevé du temps d'arrêt.
    """
    numeroIncident = models.IntegerField(unique=True, verbose_name="Numéro d'incident")
    tempsArret = models.DurationField(
        verbose_name="Temps d'arrêt (durée)",
        help_text="Durée de l'arrêt de fabrication (HH:MM:SS)"
    )
    lot = models.ForeignKey(
        LotProduction,
        on_delete=models.CASCADE,
        related_name='incidents',
        verbose_name="Lot de production impacté"
    )
    typeIncident = models.ForeignKey(
        TypeIncident,
        on_delete=models.PROTECT,
        related_name='incidents',
        verbose_name="Type d'incident"
    )

    class Meta:
        verbose_name = "Incident de Production"
        verbose_name_plural = "Incidents de Production"
        ordering = ['-numeroIncident']

    def declarer(self):
        self.save()

    def modifier(self, **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)
        self.save()

    def supprimer(self):
        self.delete()

    def __str__(self):
        return f"Incident #{self.numeroIncident} - {self.typeIncident.libelle} (Arrêt: {self.tempsArret})"

