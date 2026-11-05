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

