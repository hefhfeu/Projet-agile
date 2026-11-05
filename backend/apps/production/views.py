from rest_framework import viewsets, permissions, filters
from .models import Produit, LotProduction, TypeIncident, IncidentProduction
from .serializers import (
    ProduitSerializer,
    LotProductionSerializer,
    TypeIncidentSerializer,
    IncidentProductionSerializer
)

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['referenceProduit', 'designation']
    ordering_fields = ['referenceProduit', 'prixVenteUnitaire', 'quantiteStock']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class LotProductionViewSet(viewsets.ModelViewSet):
    queryset = LotProduction.objects.select_related('ligne', 'produit').prefetch_related('operateurs', 'incidents').all()
    serializer_class = LotProductionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['idLot', 'produit__referenceProduit', 'produit__designation']
    ordering_fields = ['idLot', 'dateProduction']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class TypeIncidentViewSet(viewsets.ModelViewSet):
    queryset = TypeIncident.objects.all()
    serializer_class = TypeIncidentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['codeType', 'libelle']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class IncidentProductionViewSet(viewsets.ModelViewSet):
    queryset = IncidentProduction.objects.select_related('lot__produit', 'typeIncident').all()
    serializer_class = IncidentProductionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numeroIncident', 'lot__idLot', 'typeIncident__codeType', 'typeIncident__libelle']
    ordering_fields = ['numeroIncident', 'tempsArret']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
