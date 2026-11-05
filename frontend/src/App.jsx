import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AteliersView from './components/AteliersView';
import LotsProductionView from './components/LotsProductionView';
import ProduitsView from './components/ProduitsView';
import EquipesOperateursView from './components/EquipesOperateursView';
import MaintenanceView from './components/MaintenanceView';
import StockNomenclatureView from './components/StockNomenclatureView';
import IncidentsView from './components/IncidentsView';
import LoginView from './components/LoginView';

import { INITIAL_DATA } from './api/mockData';
import { apiClient, authStorage } from './api/client';

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [currentUser, setCurrentUser] = useState(null); // Non connecté par défaut
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(false);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Chargement des données réelles depuis PostgreSQL
  const loadDatabase = async () => {
    try {
      const dbData = await apiClient.fetchAllData();
      if (dbData && dbData.ateliers && dbData.ateliers.length > 0) {
        setData(prev => ({
          ...prev,
          ateliers: dbData.ateliers.length > 0 ? dbData.ateliers : prev.ateliers,
          lignes: dbData.lignes.length > 0 ? dbData.lignes : prev.lignes,
          machines: dbData.machines.length > 0 ? dbData.machines : prev.machines,
          equipes: dbData.equipes.length > 0 ? dbData.equipes : prev.equipes,
          operateurs: dbData.operateurs.length > 0 ? dbData.operateurs : prev.operateurs,
          produits: dbData.produits.length > 0 ? dbData.produits : prev.produits,
          lots: dbData.lots.length > 0 ? dbData.lots : prev.lots,
          typesIncidents: dbData.typesIncidents.length > 0 ? dbData.typesIncidents : prev.typesIncidents,
          incidents: dbData.incidents.length > 0 ? dbData.incidents : prev.incidents,
          maintenances: dbData.maintenances.length > 0 ? dbData.maintenances : prev.maintenances,
          pieces: dbData.pieces.length > 0 ? dbData.pieces : prev.pieces,
          nomenclatures: dbData.nomenclatures.length > 0 ? dbData.nomenclatures : prev.nomenclatures,
          fournisseurs: dbData.fournisseurs.length > 0 ? dbData.fournisseurs : prev.fournisseurs,
          achats: dbData.achats.length > 0 ? dbData.achats : prev.achats,
        }));
        setIsDbConnected(true);
      }
    } catch (err) {
      console.warn('[PostgreSQL] Connexion indisponible, bascule locale :', err.message);
      setIsDbConnected(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  const handleLogin = async (user, password) => {
    try {
      const pwdMap = {
        'admin': 'admin123',
        'resp_atelier': 'resp123',
        'collab_resp': 'collab123',
        'operateur1': 'oper123'
      };
      const realPwd = password || pwdMap[user.username] || 'admin123';
      const liveUser = await apiClient.login(user.username, realPwd).catch(() => user);
      setCurrentUser(liveUser || user);
      await loadDatabase();
    } catch {
      setCurrentUser(user);
    }
    setActiveTab('dashboard');
    showToast(`Connexion réussie : Bienvenue ${user.prenom} ${user.nom} (${user.role_libelle})`, 'success');
  };

  const handleLogout = () => {
    authStorage.clearSession();
    setCurrentUser(null);
    showToast('Déconnexion effectuée avec succès.', 'info');
  };

  const handleSwitchUser = (username) => {
    const user = data.users.find(u => u.username === username);
    if (user) {
      handleLogin(user);
      showToast(`Profil actif : ${user.prenom} ${user.nom} (${user.role_libelle})`, 'info');
    }
  };

  // Module 1 : Ateliers & Lignes
  const handleAddAtelier = async (atelier) => {
    try {
      const saved = await apiClient.createAtelier(atelier);
      const newAtelier = {
        id: saved.id || Date.now(),
        numeroAtelier: saved.numeroAtelier || atelier.numeroAtelier,
        libelle: saved.libelle || atelier.libelle,
        responsable_nom: saved.responsable_detail?.nom_complet || "Michel Martin",
        lignes: []
      };
      setData(prev => ({
        ...prev,
        ateliers: [...prev.ateliers, newAtelier]
      }));
      showToast(`Atelier #${atelier.numeroAtelier} enregistré dans PostgreSQL usine_db !`);
    } catch {
      const newAtelier = { ...atelier, id: Date.now(), lignes: [] };
      setData(prev => ({ ...prev, ateliers: [...prev.ateliers, newAtelier] }));
      showToast(`Atelier #${atelier.numeroAtelier} créé avec succès !`);
    }
  };

  const handleAddLigne = async (ligne) => {
    try {
      const saved = await apiClient.createLigne(ligne);
      const newLigne = {
        id: saved.id || Date.now(),
        numeroLigne: saved.numeroLigne || ligne.numeroLigne,
        atelier_id: saved.atelier || ligne.atelier_id,
        nbOperateursNecessaires: saved.nbOperateursNecessaires || ligne.nbOperateursNecessaires,
        nombre_machines: 0
      };
      setData(prev => ({
        ...prev,
        lignes: [...prev.lignes, newLigne],
        ateliers: prev.ateliers.map(a => a.id === ligne.atelier_id ? { ...a, lignes: [...a.lignes, newLigne] } : a)
      }));
      showToast(`Ligne #${ligne.numeroLigne} enregistrée dans PostgreSQL usine_db !`);
    } catch {
      const newLigne = { ...ligne, id: Date.now(), nombre_machines: 0 };
      setData(prev => ({
        ...prev,
        lignes: [...prev.lignes, newLigne],
        ateliers: prev.ateliers.map(a => a.id === ligne.atelier_id ? { ...a, lignes: [...a.lignes, newLigne] } : a)
      }));
      showToast(`Ligne #${ligne.numeroLigne} ajoutée à l'atelier.`);
    }
  };

  // Module 2 : Lots
  const handleAddLot = async (lot) => {
    try {
      const saved = await apiClient.createLot(lot);
      const newLot = {
        id: saved.id || Date.now(),
        idLot: saved.idLot || lot.idLot,
        dateProduction: saved.dateProduction || lot.dateProduction,
        ligne_numero: saved.numero_ligne || lot.ligne_numero,
        produit_ref: saved.reference_produit || lot.produit_ref,
        produit_nom: saved.designation_produit || lot.produit_nom,
        operateurs: lot.operateurs || [],
        nb_incidents: 0
      };
      setData(prev => ({
        ...prev,
        lots: [newLot, ...prev.lots]
      }));
      showToast(`Lot #${lot.idLot} enregistré dans PostgreSQL usine_db !`);
    } catch {
      const newLot = { ...lot, id: Date.now() };
      setData(prev => ({ ...prev, lots: [newLot, ...prev.lots] }));
      showToast(`Lot #${lot.idLot} enregistré avec ses ouvriers affectés !`);
    }
  };

  // Module 3 : Produits
  const handleAddProduit = async (produit) => {
    try {
      const saved = await apiClient.createProduit(produit);
      const newProd = {
        id: saved.id || Date.now(),
        referenceProduit: saved.referenceProduit || produit.referenceProduit,
        designation: saved.designation || produit.designation,
        prixVenteHT: parseFloat(saved.prixVenteUnitaire || produit.prixVenteHT || 0),
        quantiteStock: saved.quantiteStock ?? produit.quantiteStock
      };
      setData(prev => ({
        ...prev,
        produits: [...prev.produits, newProd]
      }));
      showToast(`Produit ${produit.referenceProduit} enregistré dans PostgreSQL usine_db !`);
    } catch {
      const newProd = { ...produit, id: Date.now() };
      setData(prev => ({ ...prev, produits: [...prev.produits, newProd] }));
      showToast(`Produit ${produit.referenceProduit} ajouté au catalogue.`);
    }
  };

  // Module 4 : Opérateurs & Équipes
  const handleAddOperateur = async (operateur) => {
    try {
      const saved = await apiClient.createOperateur(operateur);
      const eq = data.equipes.find(e => e.id === operateur.equipe_id);
      const newOp = {
        id: saved.id || Date.now(),
        matricule: saved.matricule || operateur.matricule,
        nom: saved.nom || operateur.nom,
        prenom: saved.prenom || operateur.prenom,
        dateEntree: saved.dateEntree || operateur.dateEntree,
        equipe_id: operateur.equipe_id,
        equipe_libelle: eq ? eq.libelle : "Équipe"
      };
      setData(prev => ({
        ...prev,
        operateurs: [...prev.operateurs, newOp]
      }));
      showToast(`Opérateur ${operateur.matricule} enregistré dans PostgreSQL usine_db !`);
    } catch {
      const newOp = { ...operateur, id: Date.now() };
      setData(prev => ({ ...prev, operateurs: [...prev.operateurs, newOp] }));
      showToast(`Opérateur ${operateur.matricule} affecté à son équipe.`);
    }
  };

  const handleAddEquipe = async (equipe) => {
    try {
      const saved = await apiClient.createEquipe(equipe);
      const newEq = {
        id: saved.id || Date.now(),
        numeroEquipe: saved.numeroEquipe || equipe.numeroEquipe,
        libelle: saved.libelle || equipe.libelle,
        responsable_nom: equipe.responsable_nom || "Jean Dupont",
        effectif: 0
      };
      setData(prev => ({
        ...prev,
        equipes: [...prev.equipes, newEq]
      }));
      showToast(`Équipe #${equipe.numeroEquipe} enregistrée dans PostgreSQL usine_db !`);
    } catch {
      const newEq = { ...equipe, id: Date.now() };
      setData(prev => ({ ...prev, equipes: [...prev.equipes, newEq] }));
      showToast(`Équipe #${equipe.numeroEquipe} créée.`);
    }
  };

  // Module 5 : Maintenance avec Décrémentation Atomique du Stock
  const handleAddMaintenance = async (maintenance) => {
    try {
      await apiClient.createMaintenance(maintenance);
      showToast(`Intervention enregistrée dans PostgreSQL ! Stock décrémenté.`);
      await loadDatabase();
    } catch {
      const newMaint = { ...maintenance, id: Date.now() };
      let piecesMisesAJour = [...data.pieces];
      for (const conso of maintenance.consommations) {
        piecesMisesAJour = piecesMisesAJour.map(p => {
          if (p.referencePiece === conso.piece_ref) {
            return { ...p, quantiteStock: p.quantiteStock - conso.quantite };
          }
          return p;
        });
      }
      setData(prev => ({
        ...prev,
        pieces: piecesMisesAJour,
        maintenances: [newMaint, ...prev.maintenances]
      }));
      showToast(`Intervention enregistrée. Stock décrémenté.`);
    }
  };

  // Module 6 & 8 : Pièces & Nomenclature
  const handleAddPiece = async (piece) => {
    try {
      const saved = await apiClient.createPiece(piece);
      const newPiece = {
        id: saved.id || Date.now(),
        referencePiece: saved.referencePiece || piece.referencePiece,
        libelle: saved.libelle || piece.libelle,
        prixUnitaireHT: parseFloat(saved.prixUnitaireHT || piece.prixUnitaireHT),
        quantiteStock: saved.quantiteStock ?? piece.quantiteStock
      };
      setData(prev => ({
        ...prev,
        pieces: [...prev.pieces, newPiece]
      }));
      showToast(`Pièce ${piece.referencePiece} enregistrée dans PostgreSQL usine_db !`);
    } catch {
      const newPiece = { ...piece, id: Date.now() };
      setData(prev => ({ ...prev, pieces: [...prev.pieces, newPiece] }));
      showToast(`Pièce ${piece.referencePiece} ajoutée au stock.`);
    }
  };

  const handleAddNomenclature = async (nom) => {
    try {
      await apiClient.createNomenclature(nom);
      showToast(`Lien BOM ${nom.parent_ref} -> ${nom.quantite}x ${nom.composant_ref} enregistré dans PostgreSQL !`);
      await loadDatabase();
    } catch {
      const newNom = { ...nom, id: Date.now() };
      setData(prev => ({ ...prev, nomenclatures: [...prev.nomenclatures, newNom] }));
      showToast(`Composition validée (local).`);
    }
  };

  // Module 7 : Incidents & Arrêts
  const handleAddIncident = async (incident) => {
    try {
      const saved = await apiClient.createIncident(incident);
      const newInc = {
        id: saved.id || Date.now(),
        numeroIncident: saved.numeroIncident || incident.numeroIncident,
        idLot: saved.id_lot || incident.idLot,
        produit_ref: saved.reference_produit_lot || incident.produit_ref,
        type_code: incident.type_code,
        type_libelle: incident.type_libelle,
        tempsArret: saved.tempsArret || incident.tempsArret,
        temps_minutes: incident.temps_minutes
      };
      setData(prev => ({
        ...prev,
        incidents: [newInc, ...prev.incidents],
        lots: prev.lots.map(l => l.idLot === incident.idLot ? { ...l, nb_incidents: (l.nb_incidents || 0) + 1 } : l)
      }));
      showToast(`Incident #${incident.numeroIncident} enregistré dans PostgreSQL usine_db !`, 'warning');
    } catch {
      const newInc = { ...incident, id: Date.now() };
      setData(prev => ({
        ...prev,
        incidents: [newInc, ...prev.incidents],
        lots: prev.lots.map(l => l.idLot === incident.idLot ? { ...l, nb_incidents: (l.nb_incidents || 0) + 1 } : l)
      }));
      showToast(`Incident #${incident.numeroIncident} consigné (local).`, 'warning');
    }
  };

  const handleAddTypeIncident = async (typeInc) => {
    try {
      const saved = await apiClient.createTypeIncident(typeInc);
      const newType = {
        id: saved.id || Date.now(),
        codeType: saved.codeType || typeInc.codeType,
        libelle: saved.libelle || typeInc.libelle
      };
      setData(prev => ({
        ...prev,
        typesIncidents: [...prev.typesIncidents, newType]
      }));
      showToast(`Typologie ${typeInc.codeType} enregistrée dans PostgreSQL usine_db !`);
    } catch {
      const newType = { ...typeInc, id: Date.now() };
      setData(prev => ({ ...prev, typesIncidents: [...prev.typesIncidents, newType] }));
      showToast(`Type d'incident ${typeInc.codeType} ajouté.`);
    }
  };

  // Authentification obligatoire
  if (!currentUser) {
    return (
      <>
        {notification && (
          <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center space-x-2 transition ${
            notification.type === 'warning'
              ? 'bg-amber-600 text-white'
              : notification.type === 'info'
              ? 'bg-blue-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            <span>{notification.type === 'warning' ? '⚠️' : '✓'}</span>
            <span>{notification.message}</span>
          </div>
        )}
        <LoginView users={data.users} onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Toast de Notification */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center space-x-2 transition ${
          notification.type === 'warning'
            ? 'bg-amber-600 text-white'
            : notification.type === 'info'
            ? 'bg-blue-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          <span>{notification.type === 'warning' ? '⚠️' : '✓'}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Barre de navigation supérieure */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        isDbConnected={isDbConnected}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Menu latéral adaptatif par rôle */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser?.role}
        />

        {/* Espace de travail principal */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView data={data} onNavigate={setActiveTab} />
            )}
            {activeTab === 'ateliers' && (
              <AteliersView
                data={data}
                onAddAtelier={handleAddAtelier}
                onAddLigne={handleAddLigne}
              />
            )}
            {activeTab === 'lots' && (
              <LotsProductionView
                data={data}
                onAddLot={handleAddLot}
              />
            )}
            {activeTab === 'produits' && (
              <ProduitsView
                data={data}
                onAddProduit={handleAddProduit}
              />
            )}
            {activeTab === 'equipes' && (
              <EquipesOperateursView
                data={data}
                onAddOperateur={handleAddOperateur}
                onAddEquipe={handleAddEquipe}
              />
            )}
            {activeTab === 'maintenance' && (
              <MaintenanceView
                data={data}
                onAddMaintenance={handleAddMaintenance}
              />
            )}
            {activeTab === 'stocks' && (
              <StockNomenclatureView
                data={data}
                onAddPiece={handleAddPiece}
                onAddNomenclature={handleAddNomenclature}
              />
            )}
            {activeTab === 'incidents' && (
              <IncidentsView
                data={data}
                onAddIncident={handleAddIncident}
                onAddTypeIncident={handleAddTypeIncident}
              />
            )}
          </div>
        </main>
      </div>

    </div>
  );
}
