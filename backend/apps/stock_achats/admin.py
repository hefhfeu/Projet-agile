from django.contrib import admin
from .models import Fournisseur, Piece, CompositionPiece, AchatPiece

class CompositionPieceInline(admin.TabularInline):
    model = CompositionPiece
    fk_name = 'pieceParent'
    extra = 1

@admin.register(Piece)
class PieceAdmin(admin.ModelAdmin):
    list_display = ('referencePiece', 'libelle', 'prixUnitaireHT', 'quantiteStock')
    search_fields = ('referencePiece', 'libelle')
    inlines = [CompositionPieceInline]

@admin.register(Fournisseur)
class FournisseurAdmin(admin.ModelAdmin):
    list_display = ('codeFournisseur', 'raisonSociale', 'telephone')
    search_fields = ('codeFournisseur', 'raisonSociale')

@admin.register(CompositionPiece)
class CompositionPieceAdmin(admin.ModelAdmin):
    list_display = ('pieceParent', 'quantiteComposant', 'pieceComposant')
    search_fields = ('pieceParent__referencePiece', 'pieceComposant__referencePiece')

@admin.register(AchatPiece)
class AchatPieceAdmin(admin.ModelAdmin):
    list_display = ('dateAchat', 'piece', 'fournisseur', 'prixAchat')
    list_filter = ('fournisseur', 'dateAchat')
    search_fields = ('piece__referencePiece', 'fournisseur__raisonSociale')

