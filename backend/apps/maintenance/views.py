from rest_framework import viewsets, permissions, filters
from .models import Maintenance, ConsommationPiece
from .serializers import MaintenanceSerializer, ConsommationPieceSerializer

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.select_related('machine__ligne').prefetch_related('operateurs', 'consommations__piece').all()
    serializer_class = MaintenanceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['machine__referenceMachine', 'operateurs__nom', 'operateurs__matricule']
    ordering_fields = ['dateDebut', 'heureDebut', 'duree']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class ConsommationPieceViewSet(viewsets.ModelViewSet):
    queryset = ConsommationPiece.objects.select_related('maintenance', 'piece').all()
    serializer_class = ConsommationPieceSerializer
    permission_classes = [permissions.AllowAny]
