from django.db import models
from django.conf import settings

class CollaborateurResponsable(models.Model):
    """
    Cadre ou encadrant responsable d'un atelier ou d'une équipe.
    Correspond à l'entité CollaborateurResponsable du diagramme UML.
    """
    compte = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='collaborateur',
        verbose_name="Compte utilisateur associé"
    )
    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")

    class Meta:
        verbose_name = "Collaborateur Responsable"
        verbose_name_plural = "Collaborateurs Responsables"
        ordering = ['nom', 'prenom']

    @property
    def idCollaborateur(self):
        return self.id

    def consulterEquipes(self):
        return self.equipes.all()

    def consulterAteliers(self):
        return getattr(self, 'atelier', None)

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Atelier(models.Model):
    """
    Atelier de production de l'usine.
    Possède un et un seul responsable (CollaborateurResponsable).
    """
    numeroAtelier = models.IntegerField(unique=True, verbose_name="Numéro d'atelier")
    libelle = models.CharField(max_length=150, verbose_name="Libellé de l'atelier")
    responsable = models.OneToOneField(
        CollaborateurResponsable,
        on_delete=models.PROTECT,
        related_name='atelier',
        verbose_name="Responsable de l'atelier"
    )

    class Meta:
        verbose_name = "Atelier"
        verbose_name_plural = "Ateliers"
        ordering = ['numeroAtelier']

    def creer(self):
        self.save()

    def modifier(self, **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)
        self.save()

    def supprimer(self):
        self.delete()

    def __str__(self):
        return f"Atelier {self.numeroAtelier} - {self.libelle}"


class LigneProduction(models.Model):
    """
    Ligne de fabrication au sein d'un atelier.
    Définie par son numéro et son effectif requis d'opérateurs.
    """
    numeroLigne = models.IntegerField(unique=True, verbose_name="Numéro de ligne")
    nbOperateursNecessaires = models.PositiveIntegerField(
        verbose_name="Nombre d'opérateurs nécessaires"
    )
    atelier = models.ForeignKey(
        Atelier,
        on_delete=models.CASCADE,
        related_name='lignes',
        verbose_name="Atelier de rattachement"
    )

    class Meta:
        verbose_name = "Ligne de Production"
        verbose_name_plural = "Lignes de Production"
        ordering = ['numeroLigne']

    def ajouter(self):
        self.save()

    def modifier(self, **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)
        self.save()

    def __str__(self):
        return f"Ligne {self.numeroLigne} ({self.atelier.libelle})"


class Machine(models.Model):
    """
    Machine industrielle installée sur une ligne de fabrication unique.
    """
    class EtatMachine(models.TextChoices):
        OPERATIONNELLE = 'OPERATIONNELLE', 'Opérationnelle'
        EN_MAINTENANCE = 'EN_MAINTENANCE', 'En maintenance'
        EN_PANNE = 'EN_PANNE', 'En panne'
        ARRETEE = 'ARRETEE', 'Arrêtée'

    referenceMachine = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Référence machine"
    )
    etat = models.CharField(
        max_length=30,
        choices=EtatMachine.choices,
        default=EtatMachine.OPERATIONNELLE,
        verbose_name="État actuel de la machine"
    )
    ligne = models.ForeignKey(
        LigneProduction,
        on_delete=models.PROTECT,
        related_name='machines',
        verbose_name="Ligne de production"
    )

    class Meta:
        verbose_name = "Machine"
        verbose_name_plural = "Machines"
        ordering = ['referenceMachine']

    @property
    def idMachine(self):
        return self.id

    def affecterLigne(self, nouvelle_ligne: LigneProduction):
        self.ligne = nouvelle_ligne
        self.save(update_fields=['ligne'])

    def __str__(self):
        return f"Machine {self.referenceMachine} [{self.get_etat_display()}]"


class Equipe(models.Model):
    """
    Équipe de travail d'opérateurs sous la responsabilité d'un encadrant unique.
    """
    numeroEquipe = models.IntegerField(unique=True, verbose_name="Numéro d'équipe")
    libelle = models.CharField(max_length=150, verbose_name="Libellé de l'équipe")
    responsable = models.ForeignKey(
        CollaborateurResponsable,
        on_delete=models.PROTECT,
        related_name='equipes',
        verbose_name="Collaborateur responsable"
    )

    class Meta:
        verbose_name = "Équipe"
        verbose_name_plural = "Équipes"
        ordering = ['numeroEquipe']

    def ajouter(self):
        self.save()

    def __str__(self):
        return f"Équipe {self.numeroEquipe} - {self.libelle}"


class Operateur(models.Model):
    """
    Opérateur ou ouvrier de fabrication rattaché à une seule équipe.
    """
    matricule = models.CharField(
        max_length=30,
        unique=True,
        verbose_name="Matricule de l'opérateur"
    )
    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    dateEntree = models.DateField(verbose_name="Date d'entrée dans la société")
    equipe = models.ForeignKey(
        Equipe,
        on_delete=models.PROTECT,
        related_name='operateurs',
        verbose_name="Équipe de rattachement"
    )

    class Meta:
        verbose_name = "Opérateur"
        verbose_name_plural = "Opérateurs"
        ordering = ['matricule']

    def affecterEquipe(self, nouvelle_equipe: Equipe):
        self.equipe = nouvelle_equipe
        self.save(update_fields=['equipe'])

    def __str__(self):
        return f"{self.matricule} - {self.nom} {self.prenom}"

