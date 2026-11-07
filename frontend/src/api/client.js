/**
 * Client API HTTP avec gestion des tokens JWT et synchronisation PostgreSQL en temps réel.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export const authStorage = {
  getToken: () => localStorage.getItem('usine_access_token'),
  getRefreshToken: () => localStorage.getItem('usine_refresh_token'),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('usine_user_profile') || 'null');
    } catch {
      return null;
    }
  },
  saveSession: (data) => {
    if (data.access) localStorage.setItem('usine_access_token', data.access);
    if (data.refresh) localStorage.setItem('usine_refresh_token', data.refresh);
    if (data.user) localStorage.setItem('usine_user_profile', JSON.stringify(data.user));
  },
  clearSession: () => {
    localStorage.removeItem('usine_access_token');
    localStorage.removeItem('usine_refresh_token');
    localStorage.removeItem('usine_user_profile');
  }
};

export async function apiRequest(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401 && authStorage.getRefreshToken()) {
      // Tentative de refresh automatique du token expiré
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: authStorage.getRefreshToken() })
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        authStorage.saveSession({ access: refreshData.access });
        headers['Authorization'] = `Bearer ${refreshData.access}`;
        const retryRes = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        return await retryRes.json();
      } else {
        authStorage.clearSession();
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `Erreur serveur (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Requête vers ${endpoint} indisponible :`, err.message);
    throw err;
  }
}

/**
 * Service API pour charger et persister toutes les données métier dans PostgreSQL.
 */
export const apiClient = {
  // 1. Authentification JWT
  async login(username, password) {
    const res = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      throw new Error("Identifiant ou mot de passe invalide.");
    }
    const data = await res.json();
    authStorage.saveSession(data);
    return data.user;
  },

  // 2. Récupération globale de toutes les tables PostgreSQL
  async fetchAllData() {
    const getResults = (data) => (data && data.results ? data.results : data) || [];

    const [
      ateliersRes,
      lignesRes,
      machinesRes,
      equipesRes,
      operateursRes,
      produitsRes,
      lotsRes,
      typesIncidentsRes,
      incidentsRes,
      maintenancesRes,
      piecesRes,
      fournisseursRes,
      nomenclaturesRes,
      achatsRes
    ] = await Promise.all([
      apiRequest('/usine/ateliers/').catch(() => null),
      apiRequest('/usine/lignes/').catch(() => null),
      apiRequest('/usine/machines/').catch(() => null),
      apiRequest('/usine/equipes/').catch(() => null),
      apiRequest('/usine/operateurs/').catch(() => null),
      apiRequest('/production/produits/').catch(() => null),
      apiRequest('/production/lots/').catch(() => null),
      apiRequest('/production/types-incidents/').catch(() => null),
      apiRequest('/production/incidents/').catch(() => null),
      apiRequest('/maintenance/interventions/').catch(() => null),
      apiRequest('/stock/pieces/').catch(() => null),
      apiRequest('/stock/fournisseurs/').catch(() => null),
      apiRequest('/stock/nomenclatures/').catch(() => null),
      apiRequest('/stock/achats/').catch(() => null)
    ]);

    // Formatage propre compatible avec les composants
    const ateliers = getResults(ateliersRes).map(a => ({
      id: a.id,
      numeroAtelier: a.numeroAtelier,
      libelle: a.libelle,
      responsable_nom: a.responsable_detail ? a.responsable_detail.nom_complet : "Michel Martin",
      lignes: (a.lignes || []).map(l => ({
        id: l.id,
        numeroLigne: l.numeroLigne,
        atelier_id: a.id,
        nbOperateursNecessaires: l.nbOperateursNecessaires,
        nombre_machines: l.nombre_machines || 0
      }))
    }));

    const lignes = getResults(lignesRes).map(l => ({
      id: l.id,
      numeroLigne: l.numeroLigne,
      atelier_id: l.atelier,
      nbOperateursNecessaires: l.nbOperateursNecessaires,
      nombre_machines: l.nombre_machines || 0
    }));

    const machines = getResults(machinesRes).map(m => ({
      id: m.id,
      referenceMachine: m.referenceMachine,
      numero_ligne: m.numero_ligne,
      etat: m.etat
    }));

    const equipes = getResults(equipesRes).map(eq => ({
      id: eq.id,
      numeroEquipe: eq.numeroEquipe,
      libelle: eq.libelle,
      responsable_nom: eq.responsable_detail ? eq.responsable_detail.nom_complet : "Jean Dupont",
      effectif: eq.effectif || 0
    }));

    const operateurs = getResults(operateursRes).map(op => ({
      id: op.id,
      matricule: op.matricule,
      nom: op.nom,
      prenom: op.prenom,
      dateEntree: op.dateEntree,
      equipe_id: op.equipe,
      equipe_libelle: op.libelle_equipe || "Équipe"
    }));

    const produits = getResults(produitsRes).map(p => ({
      id: p.id,
      referenceProduit: p.referenceProduit,
      designation: p.designation,
      prixVenteHT: parseFloat(p.prixVenteUnitaire || p.prixVenteHT || 0),
      quantiteStock: p.quantiteStock
    }));

    const lots = getResults(lotsRes).map(lot => ({
      id: lot.id,
      idLot: lot.idLot,
      dateProduction: lot.dateProduction,
      ligne_numero: lot.numero_ligne,
      produit_ref: lot.reference_produit,
      produit_nom: lot.designation_produit,
      operateurs: (lot.operateurs_detail || []).map(o => `${o.matricule} (${o.prenom} ${o.nom})`),
      nb_incidents: lot.nombre_incidents || 0
    }));

    const typesIncidents = getResults(typesIncidentsRes).map(t => ({
      id: t.id,
      codeType: t.codeType,
      libelle: t.libelle
    }));

    const incidents = getResults(incidentsRes).map(inc => ({
      id: inc.id,
      numeroIncident: inc.numeroIncident,
      idLot: inc.id_lot,
      produit_ref: inc.reference_produit_lot,
      type_code: inc.type_incident_detail ? inc.type_incident_detail.codeType : "",
      type_libelle: inc.type_incident_detail ? inc.type_incident_detail.libelle : "Incident",
      tempsArret: inc.tempsArret || "00:30:00",
      temps_minutes: inc.temps_minutes || Math.floor((inc.temps_arret_secondes || 0) / 60) || 30
    }));

    const maintenances = getResults(maintenancesRes).map(m => ({
      id: m.id,
      machine_ref: m.reference_machine,
      ligne_numero: m.numero_ligne,
      dateDebut: m.dateDebut,
      heureDebut: (m.heureDebut || "").substring(0, 5),
      duree: m.duree || "01:00:00",
      operateurs: (m.operateurs_detail || []).map(o => `${o.matricule} (${o.prenom} ${o.nom})`),
      consommations: (m.consommations || []).map(c => ({
        piece_ref: c.reference_piece,
        quantite: c.quantiteConsommee,
        libelle: c.libelle_piece
      }))
    }));

    const pieces = getResults(piecesRes).map(p => ({
      id: p.id,
      referencePiece: p.referencePiece,
      libelle: p.libelle,
      prixUnitaireHT: parseFloat(p.prixUnitaireHT || 0),
      quantiteStock: p.quantiteStock
    }));

    const nomenclatures = getResults(nomenclaturesRes).map(n => ({
      id: n.id,
      parent_ref: n.reference_parent,
      composant_ref: n.reference_composant,
      quantite: n.quantiteComposant,
      composant_nom: n.libelle_composant
    }));

    const fournisseurs = getResults(fournisseursRes).map(f => ({
      id: f.id,
      codeFournisseur: f.codeFournisseur,
      raisonSociale: f.raisonSociale,
      adresse: f.adresse,
      telephone: f.telephone
    }));

    const achats = getResults(achatsRes).map(a => ({
      id: a.id,
      dateAchat: a.dateAchat,
      prixAchat: parseFloat(a.prixAchat || 0),
      fournisseur_nom: a.fournisseur_nom,
      piece_ref: a.reference_piece
    }));

    return {
      ateliers,
      lignes,
      machines,
      equipes,
      operateurs,
      produits,
      lots,
      typesIncidents,
      incidents,
      maintenances,
      pieces,
      nomenclatures,
      fournisseurs,
      achats
    };
  },

  // 3. Mutations (POST vers PostgreSQL)
  async createAtelier(atelier) {
    return await apiRequest('/usine/ateliers/', {
      method: 'POST',
      body: JSON.stringify({
        numeroAtelier: parseInt(atelier.numeroAtelier, 10),
        libelle: atelier.libelle
      })
    });
  },

  async createLigne(ligne) {
    return await apiRequest('/usine/lignes/', {
      method: 'POST',
      body: JSON.stringify({
        numeroLigne: parseInt(ligne.numeroLigne, 10),
        nbOperateursNecessaires: parseInt(ligne.nbOperateursNecessaires, 10),
        atelier: parseInt(ligne.atelier_id, 10)
      })
    });
  },

  async createLot(lot) {
    return await apiRequest('/production/lots/', {
      method: 'POST',
      body: JSON.stringify({
        idLot: parseInt(lot.idLot, 10),
        produit_ref: lot.produit_ref,
        ligne_numero: parseInt(lot.ligne_numero, 10),
        operateurs_matricules: (lot.operateurs || []).map(op => {
          const m = op.match(/OP-[0-9]+/);
          return m ? m[0] : op;
        })
      })
    });
  },

  async createProduit(produit) {
    return await apiRequest('/production/produits/', {
      method: 'POST',
      body: JSON.stringify({
        referenceProduit: produit.referenceProduit,
        designation: produit.designation,
        prixVenteHT: parseFloat(produit.prixVenteHT || produit.prixVenteUnitaire || 0),
        quantiteStock: parseInt(produit.quantiteStock, 10) || 0
      })
    });
  },

  async createOperateur(op) {
    return await apiRequest('/usine/operateurs/', {
      method: 'POST',
      body: JSON.stringify({
        matricule: op.matricule,
        nom: op.nom,
        prenom: op.prenom,
        equipe: parseInt(op.equipe_id, 10)
      })
    });
  },

  async createEquipe(eq) {
    return await apiRequest('/usine/equipes/', {
      method: 'POST',
      body: JSON.stringify({
        numeroEquipe: parseInt(eq.numeroEquipe, 10),
        libelle: eq.libelle
      })
    });
  },

  async createMaintenance(maint) {
    return await apiRequest('/maintenance/interventions/', {
      method: 'POST',
      body: JSON.stringify({
        machine_ref: maint.machine_ref,
        duree: maint.duree,
        consommations_input: maint.consommations || []
      })
    });
  },

  async createPiece(piece) {
    return await apiRequest('/stock/pieces/', {
      method: 'POST',
      body: JSON.stringify({
        referencePiece: piece.referencePiece,
        libelle: piece.libelle,
        prixUnitaireHT: parseFloat(piece.prixUnitaireHT),
        quantiteStock: parseInt(piece.quantiteStock, 10)
      })
    });
  },

  async createNomenclature(nom) {
    return await apiRequest('/stock/nomenclatures/', {
      method: 'POST',
      body: JSON.stringify({
        parent_ref: nom.parent_ref,
        composant_ref: nom.composant_ref,
        quantite: parseInt(nom.quantite, 10)
      })
    });
  },

  async createIncident(inc) {
    return await apiRequest('/production/incidents/', {
      method: 'POST',
      body: JSON.stringify({
        numeroIncident: parseInt(inc.numeroIncident, 10),
        idLot: parseInt(inc.idLot, 10),
        type_code: inc.type_code,
        duree_minutes: parseInt(inc.temps_minutes, 10)
      })
    });
  },

  async createTypeIncident(typeInc) {
    return await apiRequest('/production/types-incidents/', {
      method: 'POST',
      body: JSON.stringify({
        codeType: typeInc.codeType,
        libelle: typeInc.libelle
      })
    });
  }
};
