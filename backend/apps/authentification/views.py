from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import CompteUtilisateur
from .serializers import (
    CustomTokenObtainPairSerializer,
    CompteUtilisateurSerializer,
    CreationCompteSerializer
)
from .permissions import IsAdminRole

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Endpoint d'authentification fournissant les tokens JWT et le profil utilisateur.
    """
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserView(APIView):
    """
    Retourne les informations du profil connecté actuel.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = CompteUtilisateurSerializer(request.user)
        return Response(serializer.data)

class CompteUtilisateurViewSet(viewsets.ModelViewSet):
    """
    Gestion complète des comptes utilisateurs réservée aux administrateurs.
    """
    queryset = CompteUtilisateur.objects.all()
    serializer_class = CompteUtilisateurSerializer
    permission_classes = [IsAdminRole]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreationCompteSerializer
        return CompteUtilisateurSerializer

