"""
Services métier pour la gestion des nomenclatures et détection de cycle.
"""

from typing import Set, Dict, List
from rest_framework.exceptions import ValidationError
from .models import CompositionPiece, Piece

def verifier_absence_de_cycle(parent_id: int, composant_id: int) -> None:
    """
    Vérifie qu'ajouter un lien (parent_id -> composant_id) ne crée pas de cycle récursif.
    Si parent_id est atteignable depuis composant_id dans l'arbre existant, il y a cycle.
    """
    if parent_id == composant_id:
        raise ValidationError("Règle nomenclature : Une pièce ne peut pas être composante d'elle-même.")

    visited: Set[int] = set()

    def dfs(current_piece_id: int) -> bool:
        if current_piece_id == parent_id:
            return True
        visited.add(current_piece_id)
        # Tous les composants enfants de la pièce courante
        enfants_ids = CompositionPiece.objects.filter(
            pieceParent_id=current_piece_id
        ).values_list('pieceComposant_id', flat=True)

        for enfant_id in enfants_ids:
            if enfant_id not in visited:
                if dfs(enfant_id):
                    return True
        return False

    if dfs(composant_id):
        raise ValidationError(
            "Règle nomenclature : Boucle cyclique interdite ! "
            "La pièce parente figure déjà dans la descendance de la pièce composante."
        )


def obtenir_arbre_nomenclature(piece_id: int, quantite_multiplicateur: int = 1) -> Dict:
    """
    Génère l'arborescence complète (BOM récursif) d'une pièce avec calcul des quantités cumulées.
    """
    try:
        piece = Piece.objects.get(id=piece_id)
    except Piece.DoesNotExist:
        return {}

    liens = CompositionPiece.objects.filter(pieceParent_id=piece_id).select_related('pieceComposant')
    composants: List[Dict] = []

    for lien in liens:
        qte_totale = lien.quantiteComposant * quantite_multiplicateur
        composants.append({
            'lien_id': lien.id,
            'piece_id': lien.pieceComposant.id,
            'reference': lien.pieceComposant.referencePiece,
            'libelle': lien.pieceComposant.libelle,
            'quantite_unitaire': lien.quantiteComposant,
            'quantite_totale': qte_totale,
            'prix_unitaire_ht': float(lien.pieceComposant.prixUnitaireHT),
            'cout_sous_total': float(lien.pieceComposant.prixUnitaireHT * qte_totale),
            'stock_actuel': lien.pieceComposant.quantiteStock,
            'sous_composants': obtenir_arbre_nomenclature(lien.pieceComposant.id, qte_totale).get('composants', [])
        })

    return {
        'piece_id': piece.id,
        'reference': piece.referencePiece,
        'libelle': piece.libelle,
        'prix_unitaire_ht': float(piece.prixUnitaireHT),
        'stock_actuel': piece.quantiteStock,
        'quantite_demandee': quantite_multiplicateur,
        'composants': composants
    }

