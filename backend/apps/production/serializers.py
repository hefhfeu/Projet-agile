from rest_framework import serializers
from .models import Produit, LotProduction, TypeIncident, IncidentProduction
from apps.usine.models import LigneProduction, Operateur
from apps.usine.serializers import OperateurSerializer

class ProduitSerializer(serializers.ModelSerializer):
    prixVenteHT = serializers.DecimalField(source='prixVenteUnitaire', max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = Produit
        fields = [
            'id', 'referenceProduit', 'designation',
            'prixVenteUnitaire', 'prixVenteHT', 'quantiteStock'
        ]
        extra_kwargs = {
            'prixVenteUnitaire': {'required': False}
        }

    def validate(self, attrs):
        if 'prixVenteUnitaire' not in attrs and 'prixVenteHT' in attrs:
            attrs['prixVenteUnitaire'] = attrs['prixVenteHT']
        elif 'prixVenteUnitaire' not in attrs:
            attrs['prixVenteUnitaire'] = 0.0
        return super().validate(attrs)


class LotProductionSerializer(serializers.ModelSerializer):
    operateurs_detail = OperateurSerializer(source='operateurs', many=True, read_only=True)
    reference_produit = serializers.CharField(source='produit.referenceProduit', read_only=True)
    designation_produit = serializers.CharField(source='produit.designation', read_only=True)
    numero_ligne = serializers.IntegerField(source='ligne.numeroLigne', read_only=True)
    nombre_incidents = serializers.IntegerField(source='incidents.count', read_only=True)

    produit_ref = serializers.CharField(write_only=True, required=False)
    ligne_numero = serializers.IntegerField(write_only=True, required=False)
    operateurs_matricules = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = LotProduction
        fields = [
            'id', 'idLot', 'dateProduction', 'ligne', 'numero_ligne',
            'produit', 'reference_produit', 'designation_produit',
            'operateurs', 'operateurs_detail', 'nombre_incidents',
            'produit_ref', 'ligne_numero', 'operateurs_matricules'
        ]
        extra_kwargs = {
            'ligne': {'required': False},
            'produit': {'required': False},
            'operateurs': {'required': False},
            'dateProduction': {'required': False}
        }

    def create(self, validated_data):
        produit_ref = validated_data.pop('produit_ref', None)
        ligne_numero = validated_data.pop('ligne_numero', None)
        operateurs_matricules = validated_data.pop('operateurs_matricules', None)

        if 'produit' not in validated_data and produit_ref:
            produit = Produit.objects.filter(referenceProduit=produit_ref).first()
            if produit:
                validated_data['produit'] = produit
            else:
                validated_data['produit'] = Produit.objects.first()

        if 'ligne' not in validated_data and ligne_numero:
            ligne = LigneProduction.objects.filter(numeroLigne=ligne_numero).first()
            if ligne:
                validated_data['ligne'] = ligne
            else:
                validated_data['ligne'] = LigneProduction.objects.first()

        ops = []
        if operateurs_matricules:
            ops = list(Operateur.objects.filter(matricule__in=operateurs_matricules))

        if 'dateProduction' not in validated_data or not validated_data.get('dateProduction'):
            from django.utils import timezone
            validated_data['dateProduction'] = timezone.now().date()

        lot = super().create(validated_data)
        if ops:
            lot.operateurs.set(ops)
        return lot


class TypeIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeIncident
        fields = ['id', 'codeType', 'libelle']


class IncidentProductionSerializer(serializers.ModelSerializer):
    type_incident_detail = TypeIncidentSerializer(source='typeIncident', read_only=True)
    id_lot = serializers.IntegerField(source='lot.idLot', read_only=True)
    reference_produit_lot = serializers.CharField(source='lot.produit.referenceProduit', read_only=True)
    temps_arret_secondes = serializers.SerializerMethodField()
    temps_minutes = serializers.SerializerMethodField()

    idLot = serializers.IntegerField(write_only=True, required=False)
    type_code = serializers.CharField(write_only=True, required=False)
    duree_minutes = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = IncidentProduction
        fields = [
            'id', 'numeroIncident', 'tempsArret', 'temps_arret_secondes', 'temps_minutes',
            'lot', 'id_lot', 'reference_produit_lot',
            'typeIncident', 'type_incident_detail',
            'idLot', 'type_code', 'duree_minutes'
        ]
        extra_kwargs = {
            'lot': {'required': False},
            'typeIncident': {'required': False},
            'tempsArret': {'required': False}
        }

    def get_temps_arret_secondes(self, obj):
        if obj.tempsArret:
            return int(obj.tempsArret.total_seconds())
        return 0

    def get_temps_minutes(self, obj):
        if obj.tempsArret:
            return int(obj.tempsArret.total_seconds() // 60)
        return 0

    def create(self, validated_data):
        id_lot = validated_data.pop('idLot', None)
        type_code = validated_data.pop('type_code', None)
        duree_minutes = validated_data.pop('duree_minutes', None)

        if 'lot' not in validated_data and id_lot:
            lot = LotProduction.objects.filter(idLot=id_lot).first()
            if lot:
                validated_data['lot'] = lot

        if 'typeIncident' not in validated_data and type_code:
            ti = TypeIncident.objects.filter(codeType=type_code).first()
            if ti:
                validated_data['typeIncident'] = ti

        if 'tempsArret' not in validated_data and duree_minutes:
            from datetime import timedelta
            validated_data['tempsArret'] = timedelta(minutes=duree_minutes)

        return super().create(validated_data)
