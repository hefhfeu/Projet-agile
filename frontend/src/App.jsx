import React, { useState } from 'react';
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

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [currentUser, setCurrentUser] = useState(null); // Non connecté par défaut (exige l'authentification)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Connexion réussie : Bienvenue ${user.prenom} ${user.nom} (${user.role_libelle})`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Déconnexion effectuée avec succès.', 'info');
  };

  // Changement rapide d'utilisateur / profil simulé
  const handleSwitchUser = (username) => {
    const user = data.users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      showToast(`Profil actif : ${user.prenom} ${user.nom} (${user.role_libelle})`, 'info');
    }
  };

  // Module 1 : Ateliers & Lignes
  const handleAddAtelier = (atelier) => {
    const newAtelier = { ...atelier, id: Date.now(), lignes: [] };
    setData(prev => ({
      ...prev,
      ateliers: [...prev.ateliers, newAtelier]
    }));
    showToast(`Atelier #${atelier.numeroAtelier} créé avec succès !`);
  };

  const handleAddLigne = (ligne) => {
    const newLigne = { ...ligne, id: Date.now(), nombre_machines: 0 };
    setData(prev => ({
      ...prev,
      lignes: [...prev.lignes, newLigne],
      ateliers: prev.ateliers.map(a => a.id === ligne.atelier_id ? { ...a, lignes: [...a.lignes, newLigne] } : a)
    }));
    showToast(`Ligne #${ligne.numeroLigne} ajoutée à l'atelier.`);
  };

  // Module 2 : Lots
  const handleAddLot = (lot) => {
    const newLot = { ...lot, id: Date.now() };
    setData(prev => ({
      ...prev,
      lots: [newLot, ...prev.lots]
    }));
    showToast(`Lot #${lot.idLot} enregistré avec ses ouvriers affectés !`);
  };

  // Module 3 : Produits
  const handleAddProduit = (produit) => {
    const newProd = { ...produit, id: Date.now() };
    setData(prev => ({
      ...prev,
      produits: [...prev.produits, newProd]
    }));
    showToast(`Produit ${produit.referenceProduit} ajouté au catalogue.`);
  };

  // Module 4 : Opérateurs & Équipes
  const handleAddOperateur = (operateur) => {
    const newOp = { ...operateur, id: Date.now() };
    setData(prev => ({
      ...prev,
      operateurs: [...prev.operateurs, newOp]
    }));
    showToast(`Opérateur ${operateur.matricule} affecté à son équipe.`);
  };

  const handleAddEquipe = (equipe) => {
    const newEq = { ...equipe, id: Date.now() };
    setData(prev => ({
      ...prev,
      equipes: [...prev.equipes, newEq]
    }));
    showToast(`Équipe #${equipe.numeroEquipe} créée.`);
  };

  // Module 5 : Maintenance avec DÉCRÉMENTATION ATOMIQUE DU STOCK
  const handleAddMaintenance = (maintenance) => {
    const newMaint = { ...maintenance, id: Date.now() };

    // Décrémentation du stock pour chaque pièce consommée
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

    showToast(`Intervention enregistrée. Stock décrémenté automatiquement.`);
  };

  // Module 6 & 8 : Pièces & Nomenclature
  const handleAddPiece = (piece) => {
    const newPiece = { ...piece, id: Date.now() };
    setData(prev => ({
      ...prev,
      pieces: [...prev.pieces, newPiece]
    }));
    showToast(`Pièce ${piece.referencePiece} ajoutée au stock.`);
  };

  const handleAddNomenclature = (nom) => {
    const newNom = { ...nom, id: Date.now() };
    setData(prev => ({
      ...prev,
      nomenclatures: [...prev.nomenclatures, newNom]
    }));
    showToast(`Composition ${nom.parent_ref} -> ${nom.quantite}x ${nom.composant_ref} validée.`);
  };

  // Module 7 : Incidents & Arrêts
  const handleAddIncident = (incident) => {
    const newInc = { ...incident, id: Date.now() };
    setData(prev => ({
      ...prev,
      incidents: [newInc, ...prev.incidents],
      lots: prev.lots.map(l => l.idLot === incident.idLot ? { ...l, nb_incidents: (l.nb_incidents || 0) + 1 } : l)
    }));
    showToast(`Incident #${incident.numeroIncident} consigné sur le lot #${incident.idLot} (${incident.temps_minutes} min).`, 'warning');
  };

  const handleAddTypeIncident = (typeInc) => {
    const newType = { ...typeInc, id: Date.now() };
    setData(prev => ({
      ...prev,
      typesIncidents: [...prev.typesIncidents, newType]
    }));
    showToast(`Type d'incident ${typeInc.codeType} ajouté.`);
  };

  // Si aucun utilisateur n'est connecté, afficher l'écran d'authentification obligatoire
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

