from django.contrib import admin
from .models import Produit, LotProduction, TypeIncident, IncidentProduction

@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('referenceProduit', 'designation', 'prixVenteUnitaire', 'quantiteStock')
    search_fields = ('referenceProduit', 'designation')

@admin.register(LotProduction)
class LotProductionAdmin(admin.ModelAdmin):
    list_display = ('idLot', 'dateProduction', 'ligne', 'produit')
    list_filter = ('ligne', 'produit', 'dateProduction')
    search_fields = ('idLot', 'produit__referenceProduit')
    filter_horizontal = ('operateurs',)

@admin.register(TypeIncident)
class TypeIncidentAdmin(admin.ModelAdmin):
    list_display = ('codeType', 'libelle')
    search_fields = ('codeType', 'libelle')

@admin.register(IncidentProduction)
class IncidentProductionAdmin(admin.ModelAdmin):
    list_display = ('numeroIncident', 'lot', 'typeIncident', 'tempsArret')
    list_filter = ('typeIncident',)
    search_fields = ('numeroIncident', 'lot__idLot')

