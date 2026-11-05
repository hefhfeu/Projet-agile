from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaintenanceViewSet, ConsommationPieceViewSet

router = DefaultRouter()
router.register(r'interventions', MaintenanceViewSet, basename='intervention')
router.register(r'consommations', ConsommationPieceViewSet, basename='consommation')

urlpatterns = [
    path('', include(router.urls)),
]

