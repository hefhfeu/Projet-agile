from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import Maintenance, ConsommationPiece
from .serializers import MaintenanceSerializer, ConsommationPieceSerializer
from apps.authentification.permissions import IsOperateur

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.select_related('machine__ligne').prefetch_related('operateurs', 'consommations__piece').all()
    serializer_class = MaintenanceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['machine__referenceMachine', 'operateurs__matricule', 'operateurs__nom']
    ordering_fields = ['dateDebut', 'heureDebut', 'duree']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOperateur()]
        return [permissions.IsAuthenticated()]


class ConsommationPieceViewSet(viewsets.ModelViewSet):
    queryset = ConsommationPiece.objects.select_related('maintenance', 'piece').all()
    serializer_class = ConsommationPieceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['piece__referencePiece', 'piece__libelle']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOperateur()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except DjangoValidationError as exc:
            raise DRFValidationError({'detail': exc.message if hasattr(exc, 'message') else str(exc)})

    def perform_update(self, serializer):
        try:
            serializer.save()
        except DjangoValidationError as exc:
            raise DRFValidationError({'detail': exc.message if hasattr(exc, 'message') else str(exc)})

