from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FournisseurViewSet,
    PieceViewSet,
    CompositionPieceViewSet,
    AchatPieceViewSet
)

router = DefaultRouter()
router.register(r'fournisseurs', FournisseurViewSet, basename='fournisseur')
router.register(r'pieces', PieceViewSet, basename='piece')
router.register(r'nomenclatures', CompositionPieceViewSet, basename='nomenclature')
router.register(r'achats', AchatPieceViewSet, basename='achat')

urlpatterns = [
    path('', include(router.urls)),
]

