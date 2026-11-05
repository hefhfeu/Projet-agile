from django.contrib import admin
from .models import Maintenance, ConsommationPiece

class ConsommationPieceInline(admin.TabularInline):
    model = ConsommationPiece
    extra = 1

@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'machine', 'dateDebut', 'heureDebut', 'duree')
    list_filter = ('machine', 'dateDebut')
    filter_horizontal = ('operateurs',)
    inlines = [ConsommationPieceInline]

@admin.register(ConsommationPiece)
class ConsommationPieceAdmin(admin.ModelAdmin):
    list_display = ('maintenance', 'piece', 'quantiteConsommee')
    list_filter = ('piece',)

