from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.stock_achats.models import Piece, CompositionPiece
from apps.stock_achats.services import verifier_absence_de_cycle, obtenir_arbre_nomenclature

class NomenclatureAntiCycleTests(TestCase):
    def setUp(self):
        self.moteur = Piece.objects.create(referencePiece="MOT-TEST", libelle="Moteur Test", prixUnitaireHT=250.00, quantiteStock=10)
        self.rotor = Piece.objects.create(referencePiece="ROT-TEST", libelle="Rotor Test", prixUnitaireHT=80.00, quantiteStock=20)
        self.bobine = Piece.objects.create(referencePiece="BOB-TEST", libelle="Bobine Test", prixUnitaireHT=15.00, quantiteStock=50)

    def test_self_reference_forbidden(self):
        """Une pièce ne peut pas être un composant d'elle-même"""
        with self.assertRaises(ValidationError):
            verifier_absence_de_cycle(self.moteur.id, self.moteur.id)

    def test_direct_and_indirect_cycle_detection(self):
        """Moteur -> Rotor -> Bobine. Essayer d'ajouter Bobine -> Moteur doit lever une ValidationError"""
        CompositionPiece.objects.create(pieceParent=self.moteur, pieceComposant=self.rotor, quantiteComposant=1)
        CompositionPiece.objects.create(pieceParent=self.rotor, pieceComposant=self.bobine, quantiteComposant=2)

        # Cycle direct: Rotor -> Moteur
        with self.assertRaises(ValidationError):
            verifier_absence_de_cycle(self.rotor.id, self.moteur.id)

        # Cycle indirect: Bobine -> Moteur
        with self.assertRaises(ValidationError):
            verifier_absence_de_cycle(self.bobine.id, self.moteur.id)

    def test_nomenclature_tree_generation(self):
        """Vérifie la génération de l'arbre récursif et le calcul des quantités totales"""
        CompositionPiece.objects.create(pieceParent=self.moteur, pieceComposant=self.rotor, quantiteComposant=2)
        CompositionPiece.objects.create(pieceParent=self.rotor, pieceComposant=self.bobine, quantiteComposant=3)

        arbre = obtenir_arbre_nomenclature(self.moteur.id, quantite_multiplicateur=2)
        self.assertEqual(arbre['reference'], "MOT-TEST")
        self.assertEqual(len(arbre['composants']), 1)
        
        # 2 rotors x multiplicateur 2 = 4 rotors
        rotor_data = arbre['composants'][0]
        self.assertEqual(rotor_data['quantite_totale'], 4)
        
        # 3 bobines par rotor x 4 = 12 bobines au total
        bobine_data = rotor_data['sous_composants'][0]
        self.assertEqual(bobine_data['quantite_totale'], 12)
