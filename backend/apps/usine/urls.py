from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CollaborateurResponsableViewSet,
    AtelierViewSet,
    LigneProductionViewSet,
    MachineViewSet,
    EquipeViewSet,
    OperateurViewSet
)

router = DefaultRouter()
router.register(r'collaborateurs', CollaborateurResponsableViewSet, basename='collaborateur')
router.register(r'ateliers', AtelierViewSet, basename='atelier')
router.register(r'lignes', LigneProductionViewSet, basename='ligne')
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'equipes', EquipeViewSet, basename='equipe')
router.register(r'operateurs', OperateurViewSet, basename='operateur')

urlpatterns = [
    path('', include(router.urls)),
]

