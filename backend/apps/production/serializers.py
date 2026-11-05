from rest_framework import serializers
from .models import Produit, LotProduction, TypeIncident, IncidentProduction
from apps.usine.serializers import OperateurSerializer

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = [
            'id', 'referenceProduit', 'designation',
            'prixVenteUnitaire', 'quantiteStock'
        ]

    def validate_prixVenteUnitaire(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix unitaire ne peut pas être négatif.")
        return value

    def validate_quantiteStock(self, value):
        if value < 0:
            raise serializers.ValidationError("La quantité en stock ne peut pas être négative.")
        return value


class LotProductionSerializer(serializers.ModelSerializer):
    operateurs_detail = OperateurSerializer(source='operateurs', many=True, read_only=True)
    reference_produit = serializers.CharField(source='produit.referenceProduit', read_only=True)
    designation_produit = serializers.CharField(source='produit.designation', read_only=True)
    numero_ligne = serializers.IntegerField(source='ligne.numeroLigne', read_only=True)
    nombre_incidents = serializers.IntegerField(source='incidents.count', read_only=True)

    class Meta:
        model = LotProduction
        fields = [
            'id', 'idLot', 'dateProduction', 'ligne', 'numero_ligne',
            'produit', 'reference_produit', 'designation_produit',
            'operateurs', 'operateurs_detail', 'nombre_incidents'
        ]


class TypeIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeIncident
        fields = ['id', 'codeType', 'libelle']


class IncidentProductionSerializer(serializers.ModelSerializer):
    type_incident_detail = TypeIncidentSerializer(source='typeIncident', read_only=True)
    id_lot = serializers.IntegerField(source='lot.idLot', read_only=True)
    reference_produit_lot = serializers.CharField(source='lot.produit.referenceProduit', read_only=True)
    temps_arret_secondes = serializers.SerializerMethodField()

    class Meta:
        model = IncidentProduction
        fields = [
            'id', 'numeroIncident', 'tempsArret', 'temps_arret_secondes',
            'lot', 'id_lot', 'reference_produit_lot',
            'typeIncident', 'type_incident_detail'
        ]

    def get_temps_arret_secondes(self, obj):
        if obj.tempsArret:
            return int(obj.tempsArret.total_seconds())
        return 0

