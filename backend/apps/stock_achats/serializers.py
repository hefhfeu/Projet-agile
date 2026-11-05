from rest_framework import serializers
from .models import Fournisseur, Piece, CompositionPiece, AchatPiece
from .services import verifier_absence_de_cycle

class FournisseurSerializer(serializers.ModelSerializer):
    nombre_achats = serializers.IntegerField(source='ventes.count', read_only=True)

    class Meta:
        model = Fournisseur
        fields = [
            'id', 'codeFournisseur', 'raisonSociale',
            'adresse', 'telephone', 'nombre_achats'
        ]


class PieceSerializer(serializers.ModelSerializer):
    nombre_composants = serializers.IntegerField(source='composants_directs.count', read_only=True)
    utilise_comme_composant = serializers.IntegerField(source='utilisations_parents.count', read_only=True)

    class Meta:
        model = Piece
        fields = [
            'id', 'referencePiece', 'libelle', 'prixUnitaireHT',
            'quantiteStock', 'nombre_composants', 'utilise_comme_composant'
        ]

    def validate_prixUnitaireHT(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix unitaire HT ne peut pas être négatif.")
        return value

    def validate_quantiteStock(self, value):
        if value < 0:
            raise serializers.ValidationError("La quantité en stock ne peut pas être négative.")
        return value


class CompositionPieceSerializer(serializers.ModelSerializer):
    reference_parent = serializers.CharField(source='pieceParent.referencePiece', read_only=True)
    libelle_parent = serializers.CharField(source='pieceParent.libelle', read_only=True)
    reference_composant = serializers.CharField(source='pieceComposant.referencePiece', read_only=True)
    libelle_composant = serializers.CharField(source='pieceComposant.libelle', read_only=True)

    parent_ref = serializers.CharField(write_only=True, required=False)
    composant_ref = serializers.CharField(write_only=True, required=False)
    quantite = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = CompositionPiece
        fields = [
            'id', 'pieceParent', 'reference_parent', 'libelle_parent',
            'pieceComposant', 'reference_composant', 'libelle_composant',
            'quantiteComposant', 'parent_ref', 'composant_ref', 'quantite'
        ]
        extra_kwargs = {
            'pieceParent': {'required': False},
            'pieceComposant': {'required': False},
            'quantiteComposant': {'required': False}
        }

    def validate_quantiteComposant(self, value):
        if value <= 0:
            raise serializers.ValidationError("La quantité de composant doit être strictement supérieure à 0.")
        return value

    def validate(self, attrs):
        parent_ref = attrs.get('parent_ref')
        comp_ref = attrs.get('composant_ref')
        if parent_ref and comp_ref and parent_ref == comp_ref:
            raise serializers.ValidationError("Cycle interdit : une pièce ne peut pas être un composant d'elle-même.")
        return attrs

    def create(self, validated_data):
        parent_ref = validated_data.pop('parent_ref', None)
        comp_ref = validated_data.pop('composant_ref', None)
        quantite = validated_data.pop('quantite', None)

        if 'pieceParent' not in validated_data and parent_ref:
            p = Piece.objects.filter(referencePiece=parent_ref).first()
            if p:
                validated_data['pieceParent'] = p

        if 'pieceComposant' not in validated_data and comp_ref:
            c = Piece.objects.filter(referencePiece=comp_ref).first()
            if c:
                validated_data['pieceComposant'] = c

        if 'quantiteComposant' not in validated_data and quantite:
            validated_data['quantiteComposant'] = quantite

        return super().create(validated_data)


class AchatPieceSerializer(serializers.ModelSerializer):
    fournisseur_nom = serializers.CharField(source='fournisseur.raisonSociale', read_only=True)
    reference_piece = serializers.CharField(source='piece.referencePiece', read_only=True)

    class Meta:
        model = AchatPiece
        fields = [
            'id', 'dateAchat', 'prixAchat',
            'fournisseur', 'fournisseur_nom',
            'piece', 'reference_piece'
        ]
