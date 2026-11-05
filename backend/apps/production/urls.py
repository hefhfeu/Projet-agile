from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProduitViewSet,
    LotProductionViewSet,
    TypeIncidentViewSet,
    IncidentProductionViewSet
)

router = DefaultRouter()
router.register(r'produits', ProduitViewSet, basename='produit')
router.register(r'lots', LotProductionViewSet, basename='lot')
router.register(r'types-incidents', TypeIncidentViewSet, basename='type-incident')
router.register(r'incidents', IncidentProductionViewSet, basename='incident')

urlpatterns = [
    path('', include(router.urls)),
]

