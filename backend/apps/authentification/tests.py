from django.test import TestCase
from rest_framework.test import APIClient
from apps.authentification.models import CompteUtilisateur, RoleUtilisateur

class AuthenticationRBACTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = CompteUtilisateur.objects.create_user(
            username="test_admin",
            password="password123",
            role=RoleUtilisateur.ADMINISTRATEUR
        )
        self.operateur_user = CompteUtilisateur.objects.create_user(
            username="test_operateur",
            password="password123",
            role=RoleUtilisateur.OPERATEUR
        )

    def test_jwt_token_obtain_pair(self):
        """Vérifie l'obtention du token JWT et la présence du rôle et des claims personnalisés"""
        response = self.client.post('/api/auth/login/', {
            'username': 'test_admin',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['role'], 'ADMINISTRATEUR')

    def test_profile_endpoint_requires_auth(self):
        """L'accès au profil sans token doit renvoyer 401 Unauthorized"""
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 401)

    def test_profile_endpoint_with_auth(self):
        """L'accès au profil avec token renvoie les informations de l'utilisateur"""
        login_res = self.client.post('/api/auth/login/', {
            'username': 'test_operateur',
            'password': 'password123'
        })
        token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['identifiant'], 'test_operateur')
        self.assertEqual(response.data['role'], 'OPERATEUR')
