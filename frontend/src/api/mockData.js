/**
 * Données initiales et état réactif de démonstration pour le frontend.
 * Reproduit fidèlement les 17 entités et les règles métier du dossier.
 */

export const INITIAL_DATA = {
  users: [
    { id: 1, username: 'admin', role: 'ADMINISTRATEUR', role_libelle: 'Administrateur', nom: 'Admin', prenom: 'Système' },
    { id: 2, username: 'resp_atelier', role: 'RESPONSABLE_ATELIER', role_libelle: 'Responsable Ateliers', nom: 'Martin', prenom: 'Michel' },
    { id: 3, username: 'collab_resp', role: 'COLLABORATEUR_RESPONSABLE', role_libelle: 'Collaborateur Responsable', nom: 'Dupont', prenom: 'Jean' },
    { id: 4, username: 'operateur1', role: 'OPERATEUR', role_libelle: 'Opérateur / Gestionnaire', nom: 'Bernard', prenom: 'Thomas' },
  ],
  ateliers: [
    {
      id: 1,
      numeroAtelier: 10,
      libelle: "Atelier Usinage & Assemblage Mécanique",
      responsable: 2,
      responsable_nom: "Michel Martin",
      lignes: [
        { id: 1, numeroLigne: 101, nbOperateursNecessaires: 4, nombre_machines: 2 },
        { id: 2, numeroLigne: 102, nbOperateursNecessaires: 3, nombre_machines: 1 }
      ]
    },
    {
      id: 2,
      numeroAtelier: 20,
      libelle: "Atelier Traitement Thermique & Finition",
      responsable: 2,
      responsable_nom: "Michel Martin",
      lignes: [
        { id: 3, numeroLigne: 201, nbOperateursNecessaires: 2, nombre_machines: 2 }
      ]
    }
  ],
  lignes: [
    { id: 1, numeroLigne: 101, nbOperateursNecessaires: 4, atelier_id: 1, nom_atelier: "Atelier Usinage" },
    { id: 2, numeroLigne: 102, nbOperateursNecessaires: 3, atelier_id: 1, nom_atelier: "Atelier Usinage" },
    { id: 3, numeroLigne: 201, nbOperateursNecessaires: 2, atelier_id: 2, nom_atelier: "Atelier Finition" },
  ],
  machines: [
    { id: 1, referenceMachine: "FRAIS-CNC-01", etat: "OPERATIONNELLE", ligne_id: 1, numero_ligne: 101 },
    { id: 2, referenceMachine: "TOUR-NUM-02", etat: "OPERATIONNELLE", ligne_id: 1, numero_ligne: 101 },
    { id: 3, referenceMachine: "ROBOT-ASS-03", etat: "EN_MAINTENANCE", ligne_id: 2, numero_ligne: 102 },
    { id: 4, referenceMachine: "FOUR-THERM-01", etat: "OPERATIONNELLE", ligne_id: 3, numero_ligne: 201 },
  ],
  equipes: [
    { id: 1, numeroEquipe: 1, libelle: "Équipe Alpha (Matin)", responsable_nom: "Jean Dupont", effectif: 3 },
    { id: 2, numeroEquipe: 2, libelle: "Équipe Beta (Après-midi)", responsable_nom: "Jean Dupont", effectif: 2 },
  ],
  operateurs: [
    { id: 1, matricule: "OP-001", nom: "Bernard", prenom: "Thomas", dateEntree: "2022-03-01", equipe_id: 1, equipe_libelle: "Équipe Alpha" },
    { id: 2, matricule: "OP-002", nom: "Leroy", prenom: "Sophie", dateEntree: "2023-01-15", equipe_id: 1, equipe_libelle: "Équipe Alpha" },
    { id: 3, matricule: "OP-003", nom: "Moreau", prenom: "Lucas", dateEntree: "2024-06-01", equipe_id: 1, equipe_libelle: "Équipe Alpha" },
    { id: 4, matricule: "OP-004", nom: "Dubois", prenom: "Camille", dateEntree: "2021-09-10", equipe_id: 2, equipe_libelle: "Équipe Beta" },
  ],
  produits: [
    { id: 1, referenceProduit: "MOT-5KW-IND", designation: "Moteur Électrique Triphasé 5kW Industriel", prixVenteUnitaire: 850.00, quantiteStock: 24 },
    { id: 2, referenceProduit: "RED-R20-TORQ", designation: "Réducteur de Vitesse à Engrenages R20", prixVenteUnitaire: 420.50, quantiteStock: 15 },
    { id: 3, referenceProduit: "POMP-HYD-70B", designation: "Pompe Hydraulique Haute Pression 70 Bars", prixVenteUnitaire: 1290.00, quantiteStock: 6 },
  ],
  lots: [
    {
      id: 1,
      idLot: 1001,
      dateProduction: "2026-11-01",
      ligne_numero: 101,
      produit_ref: "MOT-5KW-IND",
      produit_nom: "Moteur Électrique 5kW",
      operateurs: ["OP-001 (Thomas Bernard)", "OP-002 (Sophie Leroy)"],
      nb_incidents: 1
    },
    {
      id: 2,
      idLot: 1002,
      dateProduction: "2026-11-02",
      ligne_numero: 102,
      produit_ref: "RED-R20-TORQ",
      produit_nom: "Réducteur R20",
      operateurs: ["OP-003 (Lucas Moreau)"],
      nb_incidents: 0
    }
  ],
  typesIncidents: [
    { id: 1, codeType: "INC-MECA", libelle: "Défaillance mécanique / Grippage" },
    { id: 2, codeType: "INC-ELEC", libelle: "Surtension ou coupure électrique" },
    { id: 3, codeType: "INC-QUAL", libelle: "Défaut matière première hors tolérance" },
  ],
  incidents: [
    {
      id: 1,
      numeroIncident: 501,
      idLot: 1001,
      produit_ref: "MOT-5KW-IND",
      type_code: "INC-MECA",
      type_libelle: "Défaillance mécanique / Grippage",
      tempsArret: "00:45:00",
      temps_minutes: 45
    }
  ],
  pieces: [
    { id: 1, referencePiece: "PIECE-SKF-6205", libelle: "Roulement à billes SKF 6205-2RS", prixUnitaireHT: 14.50, quantiteStock: 120 },
    { id: 2, referencePiece: "PIECE-JOINT-V50", libelle: "Joint torique Viton 50mm", prixUnitaireHT: 3.20, quantiteStock: 300 },
    { id: 3, referencePiece: "PIECE-ARBRE-AX40", libelle: "Arbre de transmission Ø40mm", prixUnitaireHT: 88.00, quantiteStock: 18 },
    { id: 4, referencePiece: "ENS-ROTOR-5KW", libelle: "Sous-ensemble Rotor équilibré 5kW", prixUnitaireHT: 180.00, quantiteStock: 8 },
  ],
  nomenclatures: [
    { id: 1, parent_ref: "ENS-ROTOR-5KW", composant_ref: "PIECE-ARBRE-AX40", quantite: 1, composant_nom: "Arbre de transmission" },
    { id: 2, parent_ref: "ENS-ROTOR-5KW", composant_ref: "PIECE-SKF-6205", quantite: 2, composant_nom: "Roulement à billes" },
    { id: 3, parent_ref: "ENS-ROTOR-5KW", composant_ref: "PIECE-JOINT-V50", quantite: 2, composant_nom: "Joint torique Viton" },
  ],
  fournisseurs: [
    { id: 1, codeFournisseur: "FOURN-SKF", raisonSociale: "SKF Roulements France", adresse: "69007 Lyon", telephone: "+33 4 78 00 11 22" },
    { id: 2, codeFournisseur: "FOURN-SEAL", raisonSociale: "SealTech Joints Industriels", adresse: "92000 Nanterre", telephone: "+33 1 45 88 99 00" },
  ],
  achats: [
    { id: 1, dateAchat: "2026-01-10", piece_ref: "PIECE-SKF-6205", fournisseur_nom: "SKF Roulements", prixAchat: 13.80 },
    { id: 2, dateAchat: "2026-02-01", piece_ref: "PIECE-JOINT-V50", fournisseur_nom: "SealTech Joints", prixAchat: 2.95 },
  ],
  maintenances: [
    {
      id: 1,
      machine_ref: "ROBOT-ASS-03",
      ligne_numero: 102,
      dateDebut: "2026-11-03",
      heureDebut: "09:30",
      duree: "01:30:00",
      operateurs: ["OP-001 (Thomas Bernard)"],
      consommations: [
        { piece_ref: "PIECE-SKF-6205", quantite: 2, libelle: "Roulement à billes SKF" }
      ]
    }
  ]
};

