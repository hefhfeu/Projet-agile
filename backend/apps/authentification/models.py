from django.db import models
from django.contrib.auth.models import AbstractUser

class RoleUtilisateur(models.TextChoices):
    ADMINISTRATEUR = 'ADMINISTRATEUR', 'Administrateur'
    RESPONSABLE_ATELIER = 'RESPONSABLE_ATELIER', 'Responsable des Ateliers'
    COLLABORATEUR_RESPONSABLE = 'COLLABORATEUR_RESPONSABLE', 'Collaborateur Responsable'
    OPERATEUR = 'OPERATEUR', 'Opérateur / Gestionnaire Stocks'

class CompteUtilisateur(AbstractUser):
    """
    Compte utilisateur pour le système de gestion d'usine avec contrôle d'accès RBAC.
    Correspond à l'entité CompteUtilisateur du diagramme de classes UML.
    """
    role = models.CharField(
        max_length=40,
        choices=RoleUtilisateur.choices,
        default=RoleUtilisateur.OPERATEUR,
        verbose_name="Rôle utilisateur",
        help_text="Définit les droits d'accès et le périmètre d'intervention."
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Compte actif",
        help_text="Permet de désactiver un compte sans le supprimer."
    )

    class Meta:
        verbose_name = "Compte Utilisateur"
        verbose_name_plural = "Comptes Utilisateurs"
        ordering = ['username']

    @property
    def idCompte(self):
        return self.id

    @property
    def identifiant(self):
        return self.username

    @property
    def motDePasseHache(self):
        return self.password

    def authentifier(self, raw_password: str) -> bool:
        """Méthode métier spécifiée dans le diagramme UML."""
        return self.check_password(raw_password) and self.actif and self.is_active

    def seDeconnecter(self) -> None:
        """Méthode métier spécifiée dans le diagramme UML."""
        # Dans une architecture JWT stateless, l'invalidation est gérée côté client ou blacklist
        pass

    def __str__(self):
        return f"{self.username} [{self.get_role_display()}]"

