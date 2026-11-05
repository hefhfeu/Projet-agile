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

    class Meta:
        model = CompositionPiece
        fields = [
            'id', 'pieceParent', 'reference_parent', 'libelle_parent',
            'pieceComposant', 'reference_composant', 'libelle_composant',
            'quantiteComposant'
        ]

    def validate_quantiteComposant(self, value):
        if value <= 0:
            raise serializers.ValidationError("La quantité de composant doit être strictement supérieure à 0.")
        return value

    def validate(self, attrs):
        parent = attrs.get('pieceParent')
        composant = attrs.get('pieceComposant')

        if parent and composant:
            verifier_absence_de_cycle(parent.id, composant.id)

        return attrs


class AchatPieceSerializer(serializers.ModelSerializer):
    reference_piece = serializers.CharField(source='piece.referencePiece', read_only=True)
    libelle_piece = serializers.CharField(source='piece.libelle', read_only=True)
    code_fournisseur = serializers.CharField(source='fournisseur.codeFournisseur', read_only=True)
    nom_fournisseur = serializers.CharField(source='fournisseur.raisonSociale', read_only=True)

    class Meta:
        model = AchatPiece
        fields = [
            'id', 'dateAchat', 'prixAchat',
            'piece', 'reference_piece', 'libelle_piece',
            'fournisseur', 'code_fournisseur', 'nom_fournisseur'
        ]

    def validate_prixAchat(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix d'achat ne peut pas être négatif.")
        return value

