from django.db import models
from django.core.exceptions import ValidationError

class Fournisseur(models.Model):
    """
    Fournisseur industriel référencé pour l'approvisionnement en pièces de rechange.
    """
    codeFournisseur = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Code fournisseur"
    )
    raisonSociale = models.CharField(max_length=200, verbose_name="Raison sociale")
    adresse = models.TextField(verbose_name="Adresse postale")
    telephone = models.CharField(max_length=30, verbose_name="Numéro de téléphone")

    class Meta:
        verbose_name = "Fournisseur"
        verbose_name_plural = "Fournisseurs"
        ordering = ['raisonSociale']

    def ajouter(self):
        self.save()

    def modifier(self, **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)
        self.save()

    def supprimer(self):
        self.delete()

    def __str__(self):
        return f"{self.codeFournisseur} - {self.raisonSociale}"


class Piece(models.Model):
    """
    Pièce détachée ou composant mécanique/électrique utilisé en maintenance ou assemblage.
    """
    referencePiece = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Référence pièce"
    )
    libelle = models.CharField(max_length=150, verbose_name="Libellé de la pièce")
    prixUnitaireHT = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix unitaire HT (€)"
    )
    quantiteStock = models.IntegerField(
        default=0,
        verbose_name="Quantité disponible en stock"
    )

    class Meta:
        verbose_name = "Pièce détachée"
        verbose_name_plural = "Pièces détachées"
        ordering = ['referencePiece']

    def consulterStock(self):
        return self.quantiteStock

    def majQuantiteStock(self, delta: int):
        self.quantiteStock += delta
        self.save(update_fields=['quantiteStock'])

    def __str__(self):
        return f"{self.referencePiece} - {self.libelle} (Stock: {self.quantiteStock})"


class CompositionPiece(models.Model):
    """
    Lien de nomenclature (BOM - Bill of Materials).
    Représente la composition récursive : une pièce parente est composée de n exemplaires d'une pièce composante.
    """
    pieceParent = models.ForeignKey(
        Piece,
        on_delete=models.CASCADE,
        related_name='composants_directs',
        verbose_name="Pièce parente (composée)"
    )
    pieceComposant = models.ForeignKey(
        Piece,
        on_delete=models.CASCADE,
        related_name='utilisations_parents',
        verbose_name="Pièce composante"
    )
    quantiteComposant = models.PositiveIntegerField(
        default=1,
        verbose_name="Quantité d'exemplaires nécessaires"
    )

    class Meta:
        verbose_name = "Lien de Nomenclature"
        verbose_name_plural = "Liens de Nomenclature"
        unique_together = ('pieceParent', 'pieceComposant')

    def clean(self):
        # Contrôle anti-boucle réflexive immédiate
        if self.pieceParent_id and self.pieceComposant_id:
            if self.pieceParent_id == self.pieceComposant_id:
                raise ValidationError("Une pièce ne peut pas être un composant d'elle-même.")

    def gererNomenclature(self):
        self.full_clean()
        self.save()

    def __str__(self):
        return f"{self.pieceParent.referencePiece} -> {self.quantiteComposant}x {self.pieceComposant.referencePiece}"


class AchatPiece(models.Model):
    """
    Historisation des achats de pièces auprès des fournisseurs (date, tarif unitaire).
    """
    dateAchat = models.DateField(verbose_name="Date d'achat")
    prixAchat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix d'achat unitaire (€)"
    )
    piece = models.ForeignKey(
        Piece,
        on_delete=models.PROTECT,
        related_name='achats',
        verbose_name="Pièce achetée"
    )
    fournisseur = models.ForeignKey(
        Fournisseur,
        on_delete=models.PROTECT,
        related_name='ventes',
        verbose_name="Fournisseur vendeur"
    )

    class Meta:
        verbose_name = "Historique d'Achat"
        verbose_name_plural = "Historiques d'Achats"
        ordering = ['-dateAchat', '-id']

    def enregistrerAchat(self):
        self.save()

    def __str__(self):
        return f"Achat {self.piece.referencePiece} chez {self.fournisseur.codeFournisseur} ({self.dateAchat} : {self.prixAchat} €)"

