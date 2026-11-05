"""
Générateur du Guide de Soutenance Officiel au format PDF
Système Informatisé de Gestion d'Usine de Production - TWIN_3
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # En-tête (pages 2 et suivantes)
        if self._pageNumber > 1:
            self.drawString(14 * mm, 285 * mm, "Système de Gestion d'Usine TWIN_3 — Guide de Soutenance & Recette")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(14 * mm, 282 * mm, 196 * mm, 282 * mm)
            
        # Pied de page (toutes les pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(14 * mm, 14 * mm, 196 * mm, 14 * mm)
        self.drawString(14 * mm, 9 * mm, "Génie Logiciel & Méthodes Agiles — Promotion TWIN_3 2026")
        self.drawRightString(196 * mm, 9 * mm, f"Page {self._pageNumber} sur {page_count}")
        self.restoreState()

def generer_pdf(chemin_pdf):
    doc = SimpleDocTemplate(
        chemin_pdf,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm
    )

    styles = getSampleStyleSheet()

    # Définition des styles personnalisés
    style_titre_doc = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A')
    )
    style_sous_titre = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B')
    )
    style_h1 = ParagraphStyle(
        'CustomH1',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    style_h2 = ParagraphStyle(
        'CustomH2',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    style_body = ParagraphStyle(
        'CustomBody',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )
    style_body_bold = ParagraphStyle(
        'CustomBodyBold',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0F172A')
    )
    style_box_success = ParagraphStyle(
        'BoxSuccess',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#166534')
    )
    style_box_info = ParagraphStyle(
        'BoxInfo',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E40AF')
    )
    style_code = ParagraphStyle(
        'CodeStyle',
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # =========================================================================
    # PAGE 1 : EN-TÊTE, CADRAGE & ARCHITECTURE
    # =========================================================================
    
    header_data = [
        [
            Paragraph("<b>GUIDE DE SOUTENANCE ORALE & RECETTE</b>", style_titre_doc),
            Paragraph("<b>PROMOTION TWIN_3</b><br/><font size='8' color='#64748B'>Génie Logiciel &bull; 2026</font>", style_sous_titre)
        ],
        [
            Paragraph("Système Informatisé de Gestion d'Usine de Production &bull; Démonstration & Questions Jury", style_sous_titre),
            ""
        ]
    ]
    t_header = Table(header_data, colWidths=[130 * mm, 52 * mm])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 4 * mm))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0F172A"), spaceBefore=0, spaceAfter=8))

    # Boîte de validation
    box_intro = [
        [Paragraph("<b>Statut Officiel du Projet : 100% Développé, Testé & Validé sur PostgreSQL 17</b><br/>"
                   "Ce document récapitule l'architecture 3-tiers, le scénario chronologique idéal en 6 étapes (15 min) "
                   "pour la soutenance orale, la traçabilité complète dans PostgreSQL et les réponses aux questions pièges du jury.", style_box_success)]
    ]
    t_intro = Table(box_intro, colWidths=[182 * mm])
    t_intro.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86EFAC')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_intro)
    story.append(Spacer(1, 3 * mm))

    story.append(Paragraph("1. Architecture 3-Tiers & Stack Technologique Justifiée", style_h1))
    
    stack_data = [
        [
            Paragraph("<b>Tier Présentation (Frontend React SPA)</b>", style_body_bold),
            Paragraph("<b>Tier Métier & Données (Django REST & PostgreSQL)</b>", style_body_bold)
        ],
        [
            Paragraph("&bull; <b>React 18</b> + <b>Vite</b> + <b>Tailwind CSS</b>.<br/>"
                      "&bull; 8 vues métier modulaires conformes au rapport UML.<br/>"
                      "&bull; Écran de connexion conforme au cas <i>«include» S'authentifier</i>.<br/>"
                      "&bull; Client HTTP asynchrone avec gestion automatique des tokens JWT.", style_body),
            Paragraph("&bull; <b>Django 5 & Django REST Framework</b> (Python 3.12).<br/>"
                      "&bull; <b>PostgreSQL 17</b> (17 tables relationnelles du diagramme UML).<br/>"
                      "&bull; Verrouillage de concurrence SQL (<code>select_for_update</code>).<br/>"
                      "&bull; 8 tests unitaires automatisés validés à 100% (8/8 OK).", style_body)
        ]
    ]
    t_stack = Table(stack_data, colWidths=[91 * mm, 91 * mm])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("2. Matrice des 4 Acteurs et Comptes de Démonstration (RBAC)", style_h1))
    
    rbac_data = [
        [
            Paragraph("<b>Rôle (RBAC)</b>", style_body_bold),
            Paragraph("<b>Identifiant</b>", style_body_bold),
            Paragraph("<b>Mot de passe</b>", style_body_bold),
            Paragraph("<b>Périmètre Métier & Habilitations Accordées</b>", style_body_bold)
        ],
        [
            Paragraph("<font color='#6B21A8'><b>ADMINISTRATEUR</b></font>", style_body),
            Paragraph("<code>admin</code>", style_code),
            Paragraph("<code>admin123</code>", style_code),
            Paragraph("Supervision globale, gestion des comptes utilisateurs, back-office technique Django.", style_body)
        ],
        [
            Paragraph("<font color='#1E40AF'><b>RESPONSABLE ATELIERS</b></font>", style_body),
            Paragraph("<code>resp_atelier</code>", style_code),
            Paragraph("<code>resp123</code>", style_code),
            Paragraph("Création ateliers & lignes, catalogue produits, ordres de fabrication & lots.", style_body)
        ],
        [
            Paragraph("<font color='#15803D'><b>COLLABORATEUR RESP.</b></font>", style_body),
            Paragraph("<code>collab_resp</code>", style_code),
            Paragraph("<code>collab123</code>", style_code),
            Paragraph("Gestion des équipes, affectation ouvriers, consignation des incidents & temps d'arrêt.", style_body)
        ],
        [
            Paragraph("<font color='#B45309'><b>OPÉRATEUR / STOCKS</b></font>", style_body),
            Paragraph("<code>operateur1</code>", style_code),
            Paragraph("<code>oper123</code>", style_code),
            Paragraph("Machines, interventions de maintenance avec décrémentation stock, nomenclature (BOM).", style_body)
        ],
    ]
    t_rbac = Table(rbac_data, colWidths=[40 * mm, 25 * mm, 25 * mm, 92 * mm])
    t_rbac.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_rbac)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("3. Démarrage Simplifié en 1 Clic Avant la Soutenance", style_h1))
    box_start = [
        [Paragraph("👉 <b>Double-cliquez sur :</b> <code>demarrer_projet.bat</code> (à la racine du projet).<br/>"
                   "Deux fenêtres s'ouvrent : l'API Django sur <b>http://localhost:8000</b> et l'application React sur <b>http://localhost:5173</b>.<br/>"
                   "<i>(En cas d'imprévu matériel ou réseau, double-cliquez directement sur <code>standalone_demo.html</code> pour une démo autonome).</i>", style_box_info)]
    ]
    t_start = Table(box_start, colWidths=[182 * mm])
    t_start.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#93C5FD')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_start)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2 : SCÉNARIO DE DÉMONSTRATION CHRONOLOGIQUE (15 MINUTES)
    # =========================================================================
    
    story.append(Paragraph("<b>SCÉNARIO DE DÉMONSTRATION ORALE (CHRONO 15 MINUTES)</b>", style_titre_doc))
    story.append(Paragraph("Déroulé pas-à-pas conçu pour captiver le jury et prouver la couverture intégrale du sujet", style_sous_titre))
    story.append(Spacer(1, 2 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceBefore=0, spaceAfter=8))

    etapes = [
        (
            "Étape 1 : Connexion Sécurisée & Cloisonnement RBAC",
            "⏱️ 0:00 - 2:00",
            "« Conformément au cas d'utilisation UML obligatoire «include» S'authentifier, l'accès est entièrement verrouillé par jeton JWT. Chaque acteur dispose d'un espace de travail personnalisé selon ses habilitations. »",
            "Sur <b>http://localhost:5173</b>, montrez l'écran de Login officiel. Cliquez sur le badge d'accès rapide <b>Administrateur</b> (<code>admin / admin123</code>). Montrez le tableau de bord avec les KPI temps réel (lignes actives, temps d'arrêt cumulé, alertes stock)."
        ),
        (
            "Étape 2 : Ateliers, Lignes & Traçabilité des Lots (Modules 1 & 2)",
            "⏱️ 2:00 - 5:00",
            "« Le Responsable d'Ateliers gère les capacités industrielles physiques et lance les ordres de fabrication. Chaque lot est tracé avec les ouvriers affectés. »",
            "Connectez-vous en <code>resp_atelier</code>. Allez sur <b>Ateliers & Lignes</b>, cliquez sur <i>+ Créer un Atelier</i> (ex: Atelier Usinage Lourd #3 avec 4 opérateurs). Allez ensuite sur <b>Lots de Production</b> : montrez qu'un lot associe le produit, la date et la liste des <b>matricules des ouvriers</b>."
        ),
        (
            "Étape 3 : Équipes d'Ouvriers & Déclaration d'Incident (Modules 4 & 7)",
            "⏱️ 5:00 - 8:00",
            "« Le Collaborateur Responsable pilote les équipes humaines et qualifie les aléas de fabrication avec saisie obligatoire du temps d'arrêt machine. »",
            "Connectez-vous en <code>collab_resp</code>. Allez dans <b>Équipes & Opérateurs</b> : montrez l'affectation matricule/équipe. Puis dans <b>Incidents</b>, cliquez sur <i>+ Déclarer un Incident</i> sur le Lot #1001, panne mécanique, <b>45 min de temps d'arrêt</b> : montrez le compteur d'arrêt qui s'actualise !"
        ),
        (
            "Étape 4 : Maintenance & Décrémentation Atomique de Stock (Module 5)",
            "⏱️ 8:00 - 11:00 (POINT CLÉ)",
            "« Voici l'un des algorithmes critiques du sujet : lors d'une intervention de maintenance, la consommation de pièces déclenche une transaction atomique décrémentant immédiatement le stock dans PostgreSQL. »",
            "Connectez-vous en <code>operateur1</code>. Notez le stock actuel de la pièce <i>Roulement SKF 6205</i> (ex: 120 unités). Déclarez une maintenance sur la machine ROBOT-ASS-03, consommez <b>2 roulements</b> : montrez que le stock passe instantanément à <b>118 unités</b> !"
        ),
        (
            "Étape 5 : Nomenclature Récursive (BOM) & Algorithme Anti-Cycle (Module 6)",
            "⏱️ 11:00 - 13:30",
            "« Une pièce peut être composée d'autres pièces sur plusieurs niveaux. Notre backend intègre un algorithme de détection de cycle en profondeur (DFS) pour interdire toute boucle récursive infinie. »",
            "Ouvrez l'onglet <b>Stock & Nomenclature</b>. Montrez l'arborescence multi-niveaux du <i>Rotor 5kW</i> (arbre, roulements, joints). Modifiez le multiplicateur de calcul pour prouver le dimensionnement dynamique des composants nécessaires."
        ),
        (
            "Étape 6 : Preuve dans PostgreSQL 17 & Banc de Tests Automatisés",
            "⏱️ 13:30 - 15:00",
            "« Toutes ces actions sont enregistrées en temps réel dans notre base relationnelle PostgreSQL et couvertes par notre banc de tests unitaires automatisés. »",
            "Basculez sur <b>pgAdmin 4</b>, montrez la table <code>stock_achats_piece</code> avec la valeur 118 à jour. Ouvrez un terminal et exécutez <code>python manage.py test</code> pour prouver les <b>8/8 tests réussis (OK)</b> devant le jury."
        ),
    ]

    for titre, chrono, speech, action in etapes:
        step_content = [
            [
                Paragraph(f"<b>{titre}</b>", style_body_bold),
                Paragraph(f"<b>{chrono}</b>", ParagraphStyle('Chr', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#0284C7'), alignment=2))
            ],
            [
                Paragraph(f"<i>Ce que vous dites :</i> {speech}", style_body),
                ""
            ],
            [
                Paragraph(f"👉 <b>Action :</b> {action}", style_body),
                ""
            ]
        ]
        t_step = Table(step_content, colWidths=[140 * mm, 42 * mm])
        t_step.setStyle(TableStyle([
            ('SPAN', (0,1), (1,1)),
            ('SPAN', (0,2), (1,2)),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F8FAFC')),
            ('BACKGROUND', (0,2), (-1,2), colors.HexColor('#F1F5F9')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_step)
        story.append(Spacer(1, 2.5 * mm))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3 : QUESTIONS PIÈGES DU JURY & ARGUMENTAIRES TECHNIQUES
    # =========================================================================
    
    story.append(Paragraph("<b>QUESTIONS DU JURY & ARGUMENTAIRES TECHNIQUES</b>", style_titre_doc))
    story.append(Paragraph("Les réponses d'ingénierie logicielle précises pour obtenir la note maximale", style_sous_titre))
    story.append(Spacer(1, 2 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceBefore=0, spaceAfter=8))

    questions = [
        (
            "Q1 : Pourquoi avoir choisi Django REST Framework et PostgreSQL plutôt que du NoSQL ?",
            "« Le modèle industriel d'une usine requiert une forte intégrité référentielle (ACID) : un incident doit obligatoirement être rattaché à un lot unique, une maintenance référence une machine unique. PostgreSQL garantit le respect strict des clés étrangères et la cohérence des écritures concurrentes. Django REST Framework fournit un ORM puissant, un système RBAC natif et un back-office d'administration accélérant la maintenance. »"
        ),
        (
            "Q2 : Comment empêchez-vous qu'un stock devienne négatif en cas d'accès simultanés (Race Condition) ?",
            "« Dans l'application maintenance, la méthode <code>consommerPieces()</code> est encapsulée dans un bloc <code>@transaction.atomic</code> avec l'instruction SQL <code>select_for_update()</code>. Cela pose un verrou exclusif sur la ligne de la pièce dans PostgreSQL. Le système vérifie <code>if piece.quantiteStock < quantite: raise ValidationError()</code> avant de décrémenter, garantissant qu'aucune écriture concurrente ne corrompe l'inventaire. »"
        ),
        (
            "Q3 : Comment fonctionne l'algorithme anti-cycle dans la nomenclature récursive (BOM) ?",
            "« La nomenclature forme un Graphe Orienté Acyclique (DAG). Dans <code>apps/stock_achats/services.py</code>, avant d'ajouter une relation Parente &rarr; Composante, nous exécutons un parcours en profondeur (DFS) depuis la pièce composante. Si la pièce parente est déjà présente dans sa descendance, un cycle infini se formerait. L'algorithme détecte l'anomalie et lève une <code>ValidationError</code> pour rejeter l'opération. »"
        ),
        (
            "Q4 : Comment est gérée la sécurité et la communication entre le Frontend et le Backend ?",
            "« L'architecture est une SPA (Single Page Application) découplée communiquant via des requêtes HTTP asynchrones (REST JSON). L'authentification utilise des jetons JWT (SimpleJWT). Lors du login, le backend délivre un access token et un refresh token. Chaque requête suivante porte l'en-tête <code>Authorization: Bearer &lt;token&gt;</code>, inspecté par les permissions Django pour autoriser ou refuser l'accès (403 Forbidden). »"
        ),
    ]

    for q, rep in questions:
        q_content = [
            [Paragraph(f"<b>{q}</b>", style_body_bold)],
            [Paragraph(f"<b>Réponse argumentée :</b> {rep}", style_body)]
        ]
        t_q = Table(q_content, colWidths=[182 * mm])
        t_q.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#FEF3C7')),
            ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#FFFBEB')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#F59E0B')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t_q)
        story.append(Spacer(1, 3.5 * mm))

    story.append(Paragraph("Fiche Mémo des Commandes Clés pour la Soutenance", style_h2))

    cmd_data = [
        [
            Paragraph("<b>Action Voulue</b>", style_body_bold),
            Paragraph("<b>Commande Terminal (PowerShell / CMD)</b>", style_body_bold),
            Paragraph("<b>Résultat Immédiat</b>", style_body_bold)
        ],
        [
            Paragraph("Lancer l'application complète", style_body),
            Paragraph("<code>demarrer_projet.bat</code>", style_code),
            Paragraph("Démarre Django (:8000) et React (:5173).", style_body)
        ],
        [
            Paragraph("Prouver les tests unitaires", style_body),
            Paragraph("<code>cd backend; .\\venv\\Scripts\\python.exe manage.py test</code>", style_code),
            Paragraph("Exécute les 8 tests sur PostgreSQL (OK).", style_body)
        ],
        [
            Paragraph("Ouvrir le Back-office Admin", style_body),
            Paragraph("URL navigateur : <code>http://localhost:8000/admin/</code>", style_code),
            Paragraph("Accès super-administrateur aux 17 tables.", style_body)
        ],
        [
            Paragraph("Vérifier l'historique Git", style_body),
            Paragraph("<code>git log --oneline -2</code>", style_code),
            Paragraph("Affiche les 2 commits de sauvegarde officiels.", style_body)
        ],
    ]
    t_cmd = Table(cmd_data, colWidths=[45 * mm, 75 * mm, 62 * mm])
    t_cmd.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_cmd)

    # Construction du PDF avec numérotation automatique
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] PDF généré avec succès : {chemin_pdf}")

if __name__ == "__main__":
    chemin_sortie = os.path.join(os.getcwd(), "GUIDE_DE_SOUTENANCE_TWIN3.pdf")
    generer_pdf(chemin_sortie)
