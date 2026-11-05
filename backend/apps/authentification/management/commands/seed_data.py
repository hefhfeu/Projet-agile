"""
Script de peuplement automatique de la base de données industrielle (TWIN_3 - 2026).
"""

from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from apps.authentification.models import RoleUtilisateur
from apps.usine.models import (
    CollaborateurResponsable,
    Atelier,
    LigneProduction,
    Machine,
    Equipe,
    Operateur
)
from apps.production.models import Produit, LotProduction, TypeIncident, IncidentProduction
from apps.stock_achats.models import Fournisseur, Piece, CompositionPiece, AchatPiece
from apps.maintenance.models import Maintenance, ConsommationPiece

CompteUtilisateur = get_user_model()

class Command(BaseCommand):
    help = "Initialise les comptes de test et le référentiel de l usine de production."

    def handle(self, *args, **options):
        self.stdout.write("--> Création des comptes utilisateurs et rôles RBAC...")

        # 1. Comptes utilisateurs
        admin_user, _ = CompteUtilisateur.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@usine.fr',
                'first_name': 'Système',
                'last_name': 'Admin',
                'role': RoleUtilisateur.ADMINISTRATEUR,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()

        resp_user, _ = CompteUtilisateur.objects.get_or_create(
            username='resp_atelier',
            defaults={
                'email': 'michel.martin@usine.fr',
                'first_name': 'Michel',
                'last_name': 'Martin',
                'role': RoleUtilisateur.RESPONSABLE_ATELIER,
                'is_staff': True,
            }
        )
        resp_user.set_password('resp123')
        resp_user.save()

        collab_user, _ = CompteUtilisateur.objects.get_or_create(
            username='collab_resp',
            defaults={
                'email': 'jean.dupont@usine.fr',
                'first_name': 'Jean',
                'last_name': 'Dupont',
                'role': RoleUtilisateur.COLLABORATEUR_RESPONSABLE,
            }
        )
        collab_user.set_password('collab123')
        collab_user.save()

        oper_user, _ = CompteUtilisateur.objects.get_or_create(
            username='operateur1',
            defaults={
                'email': 'thomas.bernard@usine.fr',
                'first_name': 'Thomas',
                'last_name': 'Bernard',
                'role': RoleUtilisateur.OPERATEUR,
            }
        )
        oper_user.set_password('oper123')
        oper_user.save()

        # 2. Collaborateurs responsables
        collab_resp, _ = CollaborateurResponsable.objects.get_or_create(
            nom="Dupont", prenom="Jean",
            defaults={'compte': collab_user}
        )
        collab_atelier, _ = CollaborateurResponsable.objects.get_or_create(
            nom="Martin", prenom="Michel",
            defaults={'compte': resp_user}
        )

        # 3. Ateliers & Lignes
        atelier_meca, _ = Atelier.objects.get_or_create(
            numeroAtelier=10,
            defaults={
                'libelle': "Atelier Usinage & Assemblage Mécanique",
                'responsable': collab_atelier
            }
        )

        ligne101, _ = LigneProduction.objects.get_or_create(
            numeroLigne=101,
            defaults={
                'nbOperateursNecessaires': 4,
                'atelier': atelier_meca
            }
        )
        ligne102, _ = LigneProduction.objects.get_or_create(
            numeroLigne=102,
            defaults={
                'nbOperateursNecessaires': 3,
                'atelier': atelier_meca
            }
        )

        # 4. Machines
        mach1, _ = Machine.objects.get_or_create(
            referenceMachine="FRAIS-01",
            defaults={
                'etat': Machine.EtatMachine.OPERATIONNELLE,
                'ligne': ligne101
            }
        )
        mach2, _ = Machine.objects.get_or_create(
            referenceMachine="TOUR-02",
            defaults={
                'etat': Machine.EtatMachine.OPERATIONNELLE,
                'ligne': ligne101
            }
        )
        mach3, _ = Machine.objects.get_or_create(
            referenceMachine="ROBOT-ASS-03",
            defaults={
                'etat': Machine.EtatMachine.EN_MAINTENANCE,
                'ligne': ligne102
            }
        )

        # 5. Équipes & Opérateurs
        equipe_alpha, _ = Equipe.objects.get_or_create(
            numeroEquipe=1,
            defaults={
                'libelle': "Équipe Alpha (Matin)",
                'responsable': collab_resp
            }
        )
        op1, _ = Operateur.objects.get_or_create(
            matricule="OP-001",
            defaults={
                'nom': "Bernard", 'prenom': "Thomas",
                'dateEntree': date(2022, 3, 1),
                'equipe': equipe_alpha
            }
        )
        op2, _ = Operateur.objects.get_or_create(
            matricule="OP-002",
            defaults={
                'nom': "Leroy", 'prenom': "Sophie",
                'dateEntree': date(2023, 1, 15),
                'equipe': equipe_alpha
            }
        )
        op3, _ = Operateur.objects.get_or_create(
            matricule="OP-003",
            defaults={
                'nom': "Moreau", 'prenom': "Lucas",
                'dateEntree': date(2024, 6, 1),
                'equipe': equipe_alpha
            }
        )

        # 6. Catalogue Produits
        prod_moteur, _ = Produit.objects.get_or_create(
            referenceProduit="MOT-5KW-IND",
            defaults={
                'designation': "Moteur Électrique Triphasé 5kW Industriel",
                'prixVenteUnitaire': 850.00,
                'quantiteStock': 24
            }
        )
        prod_reducteur, _ = Produit.objects.get_or_create(
            referenceProduit="RED-R20-TORQ",
            defaults={
                'designation': "Réducteur de Vitesse à Engrenages R20",
                'prixVenteUnitaire': 420.50,
                'quantiteStock': 15
            }
        )

        # 7. Lots de production
        lot_1001, _ = LotProduction.objects.get_or_create(
            idLot=1001,
            defaults={
                'dateProduction': date.today() - timedelta(days=2),
                'ligne': ligne101,
                'produit': prod_moteur
            }
        )
        lot_1001.operateurs.set([op1, op2])

        # 8. Types d'incidents & Incidents
        type_meca, _ = TypeIncident.objects.get_or_create(
            codeType="INC-MECA",
            defaults={'libelle': "Défaillance mécanique / Grippage"}
        )
        type_elec, _ = TypeIncident.objects.get_or_create(
            codeType="INC-ELEC",
            defaults={'libelle': "Surtension ou coupure électrique"}
        )

        IncidentProduction.objects.get_or_create(
            numeroIncident=501,
            defaults={
                'tempsArret': timedelta(minutes=45),
                'lot': lot_1001,
                'typeIncident': type_meca
            }
        )

        # 9. Fournisseurs & Pièces détachées
        fourn_skf, _ = Fournisseur.objects.get_or_create(
            codeFournisseur="FOURN-SKF",
            defaults={
                'raisonSociale': "SKF Roulements France",
                'adresse': "34 Rue de la Mécanique, 69007 Lyon",
                'telephone': "+33 4 78 00 11 22"
            }
        )
        fourn_seal, _ = Fournisseur.objects.get_or_create(
            codeFournisseur="FOURN-SEAL",
            defaults={
                'raisonSociale': "SealTech Joints Industriels",
                'adresse': "12 Avenue de l'Industrie, 92000 Nanterre",
                'telephone': "+33 1 45 88 99 00"
            }
        )

        p_roulement, _ = Piece.objects.get_or_create(
            referencePiece="PIECE-SKF-6205",
            defaults={
                'libelle': "Roulement à billes SKF 6205-2RS",
                'prixUnitaireHT': 14.50,
                'quantiteStock': 120
            }
        )
        p_joint, _ = Piece.objects.get_or_create(
            referencePiece="PIECE-JOINT-V50",
            defaults={
                'libelle': "Joint torique Viton 50mm haute température",
                'prixUnitaireHT': 3.20,
                'quantiteStock': 300
            }
        )
        p_arbre, _ = Piece.objects.get_or_create(
            referencePiece="PIECE-ARBRE-AX40",
            defaults={
                'libelle': "Arbre de transmission usiné Ø40mm",
                'prixUnitaireHT': 88.00,
                'quantiteStock': 18
            }
        )
        p_ensemble, _ = Piece.objects.get_or_create(
            referencePiece="ENS-ROTOR-5KW",
            defaults={
                'libelle': "Sous-ensemble Rotor équilibré 5kW",
                'prixUnitaireHT': 180.00,
                'quantiteStock': 8
            }
        )

        # 10. Nomenclature (BOM récursif)
        # ENS-ROTOR-5KW se compose de : 1x Arbre + 2x Roulements + 2x Joints
        CompositionPiece.objects.get_or_create(
            pieceParent=p_ensemble,
            pieceComposant=p_arbre,
            defaults={'quantiteComposant': 1}
        )
        CompositionPiece.objects.get_or_create(
            pieceParent=p_ensemble,
            pieceComposant=p_roulement,
            defaults={'quantiteComposant': 2}
        )
        CompositionPiece.objects.get_or_create(
            pieceParent=p_ensemble,
            pieceComposant=p_joint,
            defaults={'quantiteComposant': 2}
        )

        # 11. Historique d'achats
        AchatPiece.objects.get_or_create(
            dateAchat=date(2026, 1, 10),
            piece=p_roulement,
            fournisseur=fourn_skf,
            defaults={'prixAchat': 13.80}
        )
        AchatPiece.objects.get_or_create(
            dateAchat=date(2026, 2, 1),
            piece=p_joint,
            fournisseur=fourn_seal,
            defaults={'prixAchat': 2.95}
        )

        # 12. Maintenance
        maint1, _ = Maintenance.objects.get_or_create(
            machine=mach3,
            dateDebut=date.today(),
            defaults={
                'heureDebut': time(9, 30),
                'duree': timedelta(hours=1, minutes=30)
            }
        )
        maint1.operateurs.set([op1])

        self.stdout.write(self.style.SUCCESS("[OK] Base de données industrielle peuplée avec succès !"))
        self.stdout.write(self.style.SUCCESS("  - admin : admin / admin123 (Administrateur)"))
        self.stdout.write(self.style.SUCCESS("  - resp_atelier : resp_atelier / resp123 (Responsable Ateliers)"))
        self.stdout.write(self.style.SUCCESS("  - collab_resp : collab_resp / collab123 (Collaborateur Responsable)"))
        self.stdout.write(self.style.SUCCESS("  - operateur1 : operateur1 / oper123 (Opérateur / Gestionnaire)"))

