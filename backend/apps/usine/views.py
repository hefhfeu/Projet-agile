from rest_framework import viewsets, permissions, filters
from .models import (
    CollaborateurResponsable,
    Atelier,
    LigneProduction,
    Machine,
    Equipe,
    Operateur
)
from .serializers import (
    CollaborateurResponsableSerializer,
    AtelierSerializer,
    LigneProductionSerializer,
    MachineSerializer,
    EquipeSerializer,
    OperateurSerializer
)

class CollaborateurResponsableViewSet(viewsets.ModelViewSet):
    queryset = CollaborateurResponsable.objects.all()
    serializer_class = CollaborateurResponsableSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'prenom']


class AtelierViewSet(viewsets.ModelViewSet):
    queryset = Atelier.objects.select_related('responsable').prefetch_related('lignes').all()
    serializer_class = AtelierSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['libelle', 'numeroAtelier']
    ordering_fields = ['numeroAtelier', 'libelle']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class LigneProductionViewSet(viewsets.ModelViewSet):
    queryset = LigneProduction.objects.select_related('atelier').prefetch_related('machines').all()
    serializer_class = LigneProductionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numeroLigne', 'atelier__libelle']
    ordering_fields = ['numeroLigne', 'nbOperateursNecessaires']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.select_related('ligne__atelier').all()
    serializer_class = MachineSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['referenceMachine', 'ligne__numeroLigne']
    ordering_fields = ['referenceMachine', 'etat']


class EquipeViewSet(viewsets.ModelViewSet):
    queryset = Equipe.objects.select_related('responsable').prefetch_related('operateurs').all()
    serializer_class = EquipeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['libelle', 'numeroEquipe']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class OperateurViewSet(viewsets.ModelViewSet):
    queryset = Operateur.objects.select_related('equipe').all()
    serializer_class = OperateurSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['matricule', 'nom', 'prenom', 'equipe__libelle']
    ordering_fields = ['matricule', 'nom', 'dateEntree']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
