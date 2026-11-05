from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CompteUtilisateur, RoleUtilisateur

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Personnalisation du token JWT pour y inclure les claims de rôle et informations utilisateur.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['nom_complet'] = f"{user.first_name} {user.last_name}".strip() or user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Ajout des données de profil dans le corps de réponse JSON
        data['user'] = {
            'id': self.user.id,
            'idCompte': self.user.id,
            'username': self.user.username,
            'identifiant': self.user.username,
            'email': self.user.email,
            'nom': self.user.last_name,
            'prenom': self.user.first_name,
            'role': self.user.role,
            'role_libelle': self.user.get_role_display(),
            'actif': self.user.actif,
            'is_superuser': self.user.is_superuser,
        }
        return data

class CompteUtilisateurSerializer(serializers.ModelSerializer):
    idCompte = serializers.IntegerField(source='id', read_only=True)
    identifiant = serializers.CharField(source='username')
    role_libelle = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = CompteUtilisateur
        fields = [
            'id', 'idCompte', 'identifiant', 'first_name', 'last_name',
            'email', 'role', 'role_libelle', 'actif', 'date_joined'
        ]
        read_only_fields = ['id', 'idCompte', 'date_joined']

class CreationCompteSerializer(serializers.ModelSerializer):
    motDePasse = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = CompteUtilisateur
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'motDePasse']

    def create(self, validated_data):
        password = validated_data.pop('motDePasse')
        user = CompteUtilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user

