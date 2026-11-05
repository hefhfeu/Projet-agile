from rest_framework import permissions
from .models import RoleUtilisateur

class IsAdminRole(permissions.BasePermission):
    """Accès réservé exclusivement aux Administrateurs."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role == RoleUtilisateur.ADMINISTRATEUR or request.user.is_superuser)
        )

class IsResponsableAtelier(permissions.BasePermission):
    """Accès réservé aux Responsables des Ateliers et aux Administrateurs."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role in [RoleUtilisateur.RESPONSABLE_ATELIER, RoleUtilisateur.ADMINISTRATEUR]
             or request.user.is_superuser)
        )

class IsCollaborateurResponsable(permissions.BasePermission):
    """Accès réservé aux Collaborateurs Responsables et aux Administrateurs."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role in [RoleUtilisateur.COLLABORATEUR_RESPONSABLE, RoleUtilisateur.ADMINISTRATEUR]
             or request.user.is_superuser)
        )

class IsOperateur(permissions.BasePermission):
    """Accès accordé aux Opérateurs / Gestionnaires de stock et supérieurs."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role in [
                RoleUtilisateur.OPERATEUR,
                RoleUtilisateur.RESPONSABLE_ATELIER,
                RoleUtilisateur.COLLABORATEUR_RESPONSABLE,
                RoleUtilisateur.ADMINISTRATEUR
            ] or request.user.is_superuser)
        )

