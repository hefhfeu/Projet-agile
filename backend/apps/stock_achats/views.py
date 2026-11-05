from rest_framework import viewsets, permissions, filters
from .models import Fournisseur, Piece, CompositionPiece, AchatPiece
from .serializers import (
    FournisseurSerializer,
    PieceSerializer,
    CompositionPieceSerializer,
    AchatPieceSerializer
)

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['codeFournisseur', 'raisonSociale']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class PieceViewSet(viewsets.ModelViewSet):
    queryset = Piece.objects.all()
    serializer_class = PieceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['referencePiece', 'libelle']
    ordering_fields = ['referencePiece', 'prixUnitaireHT', 'quantiteStock']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class CompositionPieceViewSet(viewsets.ModelViewSet):
    queryset = CompositionPiece.objects.select_related('pieceParent', 'pieceComposant').all()
    serializer_class = CompositionPieceSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class AchatPieceViewSet(viewsets.ModelViewSet):
    queryset = AchatPiece.objects.select_related('fournisseur', 'piece').all()
    serializer_class = AchatPieceSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['dateAchat', 'prixAchat']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
