from rest_framework import serializers
from .models import (
    CollaborateurResponsable,
    Atelier,
    LigneProduction,
    Machine,
    Equipe,
    Operateur
)

class CollaborateurResponsableSerializer(serializers.ModelSerializer):
    idCollaborateur = serializers.IntegerField(source='id', read_only=True)
    nom_complet = serializers.SerializerMethodField()

    class Meta:
        model = CollaborateurResponsable
        fields = ['id', 'idCollaborateur', 'nom', 'prenom', 'nom_complet', 'compte']

    def get_nom_complet(self, obj):
        return f"{obj.prenom} {obj.nom}"


class LigneProductionSerializer(serializers.ModelSerializer):
    nom_atelier = serializers.CharField(source='atelier.libelle', read_only=True)
    nombre_machines = serializers.IntegerField(source='machines.count', read_only=True)

    class Meta:
        model = LigneProduction
        fields = [
            'id', 'numeroLigne', 'nbOperateursNecessaires',
            'atelier', 'nom_atelier', 'nombre_machines'
        ]


class AtelierSerializer(serializers.ModelSerializer):
    responsable_detail = CollaborateurResponsableSerializer(source='responsable', read_only=True)
    lignes = LigneProductionSerializer(many=True, read_only=True)
    nombre_lignes = serializers.IntegerField(source='lignes.count', read_only=True)

    class Meta:
        model = Atelier
        fields = [
            'id', 'numeroAtelier', 'libelle', 'responsable',
            'responsable_detail', 'lignes', 'nombre_lignes'
        ]
        extra_kwargs = {
            'responsable': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        if 'responsable' not in validated_data or validated_data['responsable'] is None:
            num = validated_data.get('numeroAtelier', 1)
            collab = CollaborateurResponsable.objects.create(
                nom="Superviseur",
                prenom=f"Atelier #{num}"
            )
            validated_data['responsable'] = collab
        return super().create(validated_data)


class MachineSerializer(serializers.ModelSerializer):
    idMachine = serializers.IntegerField(source='id', read_only=True)
    numero_ligne = serializers.IntegerField(source='ligne.numeroLigne', read_only=True)
    etat_libelle = serializers.CharField(source='get_etat_display', read_only=True)

    class Meta:
        model = Machine
        fields = [
            'id', 'idMachine', 'referenceMachine', 'etat',
            'etat_libelle', 'ligne', 'numero_ligne'
        ]


class OperateurSerializer(serializers.ModelSerializer):
    libelle_equipe = serializers.CharField(source='equipe.libelle', read_only=True)
    numero_equipe = serializers.IntegerField(source='equipe.numeroEquipe', read_only=True)

    class Meta:
        model = Operateur
        fields = [
            'id', 'matricule', 'nom', 'prenom', 'dateEntree',
            'equipe', 'numero_equipe', 'libelle_equipe'
        ]
        extra_kwargs = {
            'dateEntree': {'required': False}
        }

    def create(self, validated_data):
        if 'dateEntree' not in validated_data or not validated_data['dateEntree']:
            from django.utils import timezone
            validated_data['dateEntree'] = timezone.now().date()
        return super().create(validated_data)


class EquipeSerializer(serializers.ModelSerializer):
    responsable_detail = CollaborateurResponsableSerializer(source='responsable', read_only=True)
    operateurs = OperateurSerializer(many=True, read_only=True)
    effectif = serializers.IntegerField(source='operateurs.count', read_only=True)

    class Meta:
        model = Equipe
        fields = [
            'id', 'numeroEquipe', 'libelle', 'responsable',
            'responsable_detail', 'operateurs', 'effectif'
        ]
        extra_kwargs = {
            'responsable': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        if 'responsable' not in validated_data or validated_data['responsable'] is None:
            collab = CollaborateurResponsable.objects.first()
            if not collab:
                collab = CollaborateurResponsable.objects.create(nom="Dupont", prenom="Jean")
            validated_data['responsable'] = collab
        return super().create(validated_data)
