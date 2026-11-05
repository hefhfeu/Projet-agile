from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CompteUtilisateur

@admin.register(CompteUtilisateur)
class CompteUtilisateurAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'actif', 'is_staff')
    list_filter = ('role', 'actif', 'is_staff', 'is_superuser')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)

    fieldsets = UserAdmin.fieldsets + (
        ('Contrôle d Accès Métier (RBAC)', {'fields': ('role', 'actif')}),
    )

