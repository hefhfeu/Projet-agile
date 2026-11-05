from django.contrib import admin
from .models import (
    CollaborateurResponsable,
    Atelier,
    LigneProduction,
    Machine,
    Equipe,
    Operateur
)

@admin.register(CollaborateurResponsable)
class CollaborateurResponsableAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom', 'prenom', 'compte')
    search_fields = ('nom', 'prenom')

@admin.register(Atelier)
class AtelierAdmin(admin.ModelAdmin):
    list_display = ('numeroAtelier', 'libelle', 'responsable')
    search_fields = ('numeroAtelier', 'libelle')

@admin.register(LigneProduction)
class LigneProductionAdmin(admin.ModelAdmin):
    list_display = ('numeroLigne', 'nbOperateursNecessaires', 'atelier')
    list_filter = ('atelier',)
    search_fields = ('numeroLigne',)

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ('referenceMachine', 'etat', 'ligne')
    list_filter = ('etat', 'ligne')
    search_fields = ('referenceMachine',)

@admin.register(Equipe)
class EquipeAdmin(admin.ModelAdmin):
    list_display = ('numeroEquipe', 'libelle', 'responsable')
    search_fields = ('numeroEquipe', 'libelle')

@admin.register(Operateur)
class OperateurAdmin(admin.ModelAdmin):
    list_display = ('matricule', 'nom', 'prenom', 'dateEntree', 'equipe')
    list_filter = ('equipe',)
    search_fields = ('matricule', 'nom', 'prenom')

