from rest_framework import serializers
from .models import Maintenance, ConsommationPiece
from apps.usine.serializers import MachineSerializer, OperateurSerializer
from apps.stock_achats.serializers import PieceSerializer

class ConsommationPieceSerializer(serializers.ModelSerializer):
    reference_piece = serializers.CharField(source='piece.referencePiece', read_only=True)
    libelle_piece = serializers.CharField(source='piece.libelle', read_only=True)

    class Meta:
        model = ConsommationPiece
        fields = [
            'id', 'maintenance', 'piece', 'reference_piece',
            'libelle_piece', 'quantiteConsommee'
        ]

    def validate_quantiteConsommee(self, value):
        if value <= 0:
            raise serializers.ValidationError("La quantité consommée doit être supérieure à 0.")
        return value


class MaintenanceSerializer(serializers.ModelSerializer):
    idMaintenance = serializers.IntegerField(source='id', read_only=True)
    reference_machine = serializers.CharField(source='machine.referenceMachine', read_only=True)
    etat_machine = serializers.CharField(source='machine.get_etat_display', read_only=True)
    numero_ligne = serializers.IntegerField(source='machine.ligne.numeroLigne', read_only=True)
    operateurs_detail = OperateurSerializer(source='operateurs', many=True, read_only=True)
    consommations = ConsommationPieceSerializer(many=True, read_only=True)
    duree_secondes = serializers.SerializerMethodField()

    class Meta:
        model = Maintenance
        fields = [
            'id', 'idMaintenance', 'dateDebut', 'heureDebut', 'duree',
            'duree_secondes', 'machine', 'reference_machine', 'etat_machine',
            'numero_ligne', 'operateurs', 'operateurs_detail', 'consommations'
        ]

    def get_duree_secondes(self, obj):
        if obj.duree:
            return int(obj.duree.total_seconds())
        return 0

