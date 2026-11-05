from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Fournisseur, Piece, CompositionPiece, AchatPiece
from .serializers import (
    FournisseurSerializer,
    PieceSerializer,
    CompositionPieceSerializer,
    AchatPieceSerializer
)
from .services import obtenir_arbre_nomenclature
from apps.authentification.permissions import IsOperateur

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['codeFournisseur', 'raisonSociale', 'telephone']
    ordering_fields = ['codeFournisseur', 'raisonSociale']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOperateur()]
        return [permissions.IsAuthenticated()]


class PieceViewSet(viewsets.ModelViewSet):
    queryset = Piece.objects.all()
    serializer_class = PieceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['referencePiece', 'libelle']
    ordering_fields = ['referencePiece', 'quantiteStock', 'prixUnitaireHT']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOperateur()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def nomenclature(self, request, pk=None):
        """
        Retourne l'arborescence multi-niveaux complète de la nomenclature pour cette pièce.
        """
        multiplicateur = int(request.query_params.get('quantite', 1))
        arbre = obtenir_arbre_nomenclature(pk, multiplicateur)
        return Response(arbre)

    @action(detail=True, methods=['post'])
    def ajuster_stock(self, request, pk=None):
        """
        Ajustement manuel du stock (inventaire).
        """
        piece = self.get_object()
        delta = request.data.get('delta', 0)
        try:
            delta = int(delta)
        except ValueError:
            return Response(
                {'error': 'La variation de stock doit être un entier.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if piece.quantiteStock + delta < 0:
            return Response(
                {'error': 'Le stock résultant ne peut pas être inférieur à zéro.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        piece.majQuantiteStock(delta)
        return Response(PieceSerializer(piece).data)


class CompositionPieceViewSet(viewsets.ModelViewSet):
    queryset = CompositionPiece.objects.select_related('pieceParent', 'pieceComposant').all()
    serializer_class = CompositionPieceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['pieceParent__referencePiece', 'pieceComposant__referencePiece']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOperateur()]
        return [permissions.IsAuthenticated()]


class AchatPieceViewSet(viewsets.ModelViewSet):
    queryset = AchatPiece.objects.select_related('piece', 'fournisseur').all()
    serializer_class = AchatPieceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['piece__referencePiece', 'fournisseur__raisonSociale']
    ordering_fields = ['dateAchat', 'prixAchat']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOperateur()]
        return [permissions.IsAuthenticated()]

