from rest_framework import serializers
from .models import Maintenance, ConsommationPiece
from apps.usine.models import Machine, Operateur
from apps.stock_achats.models import Piece
from apps.usine.serializers import OperateurSerializer
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

    machine_ref = serializers.CharField(write_only=True, required=False)
    duree_minutes = serializers.IntegerField(write_only=True, required=False)
    consommations_input = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Maintenance
        fields = [
            'id', 'idMaintenance', 'dateDebut', 'heureDebut', 'duree',
            'duree_secondes', 'machine', 'reference_machine', 'etat_machine',
            'numero_ligne', 'operateurs', 'operateurs_detail', 'consommations',
            'machine_ref', 'duree_minutes', 'consommations_input'
        ]
        extra_kwargs = {
            'machine': {'required': False},
            'operateurs': {'required': False},
            'duree': {'required': False},
            'dateDebut': {'required': False},
            'heureDebut': {'required': False}
        }

    def get_duree_secondes(self, obj):
        if obj.duree:
            return int(obj.duree.total_seconds())
        return 0

    def create(self, validated_data):
        machine_ref = validated_data.pop('machine_ref', None)
        duree_minutes = validated_data.pop('duree_minutes', None)
        consommations_input = validated_data.pop('consommations_input', [])

        if 'machine' not in validated_data and machine_ref:
            mach = Machine.objects.filter(referenceMachine=machine_ref).first()
            if mach:
                validated_data['machine'] = mach
            else:
                validated_data['machine'] = Machine.objects.first()

        if 'duree' not in validated_data and duree_minutes:
            from datetime import timedelta
            validated_data['duree'] = timedelta(minutes=duree_minutes)
        elif 'duree' not in validated_data:
            from datetime import timedelta
            validated_data['duree'] = timedelta(hours=1)

        from django.utils import timezone
        if 'dateDebut' not in validated_data or not validated_data.get('dateDebut'):
            validated_data['dateDebut'] = timezone.now().date()
        if 'heureDebut' not in validated_data or not validated_data.get('heureDebut'):
            validated_data['heureDebut'] = timezone.now().time()

        maint = super().create(validated_data)

        # Décrémentation atomique des pièces de rechange
        for item in consommations_input:
            ref = item.get('piece_ref')
            qte = int(item.get('quantite', 1))
            piece = Piece.objects.filter(referencePiece=ref).first()
            if piece:
                if piece.quantiteStock >= qte:
                    piece.quantiteStock -= qte
                    piece.save()
                ConsommationPiece.objects.create(
                    maintenance=maint,
                    piece=piece,
                    quantiteConsommee=qte
                )

        return maint
