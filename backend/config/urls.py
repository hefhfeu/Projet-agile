"""
Root URL Configuration for Industrial Production Management System.
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_view(request):
    """
    Overview of exposed REST API endpoints.
    """
    return Response({
        'message': 'API Système de Gestion d Usine de Production (TWIN_3 - 2026)',
        'version': '1.0.0',
        'endpoints': {
            'authentification': '/api/auth/',
            'usine': '/api/usine/',
            'production': '/api/production/',
            'maintenance': '/api/maintenance/',
            'stock_achats': '/api/stock/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False), name='root-redirect'),
    path('admin/', admin.site.urls),
    path('api/', api_root_view, name='api-root'),
    path('api/auth/', include('apps.authentification.urls')),
    path('api/usine/', include('apps.usine.urls')),
    path('api/production/', include('apps.production.urls')),
    path('api/maintenance/', include('apps.maintenance.urls')),
    path('api/stock/', include('apps.stock_achats.urls')),
]

