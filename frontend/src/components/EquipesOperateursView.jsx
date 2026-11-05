import React, { useState } from 'react';

export default function EquipesOperateursView({ data, onAddOperateur, onAddEquipe }) {
  const [showOpModal, setShowOpModal] = useState(false);
  const [showEqModal, setShowEqModal] = useState(false);

  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [equipeId, setEquipeId] = useState(data.equipes[0]?.id || 1);

  const [numEquipe, setNumEquipe] = useState('');
  const [libelleEquipe, setLibelleEquipe] = useState('');

  const handleCreateOperateur = (e) => {
    e.preventDefault();
    if (!matricule || !nom || !prenom) return;

    const eq = data.equipes.find(e => e.id === parseInt(equipeId, 10));

    onAddOperateur({
      matricule: matricule.trim().toUpperCase(),
      nom: nom.trim(),
      prenom: prenom.trim(),
      dateEntree: new Date().toISOString().split('T')[0],
      equipe_id: parseInt(equipeId, 10),
      equipe_libelle: eq ? eq.libelle : "Équipe"
    });

    setMatricule('');
    setNom('');
    setPrenom('');
    setShowOpModal(false);
  };

  const handleCreateEquipe = (e) => {
    e.preventDefault();
    if (!numEquipe || !libelleEquipe) return;

    onAddEquipe({
      numeroEquipe: parseInt(numEquipe, 10),
      libelle: libelleEquipe.trim(),
      responsable_nom: "Jean Dupont",
      effectif: 0
    });

    setNumEquipe('');
    setLibelleEquipe('');
    setShowEqModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 4 : Équipes & Opérateurs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Règle métier : un opérateur appartient à une seule équipe, encadrée par un collaborateur responsable unique.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowEqModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Nouvelle Équipe
          </button>
          <button
            onClick={() => setShowOpModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Ajouter un Opérateur
          </button>
        </div>
      </div>

      {/* Cartes des Équipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.equipes.map((equipe) => {
          const membres = data.operateurs.filter(op => op.equipe_id === equipe.id);
          return (
            <div key={equipe.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Équipe #{equipe.numeroEquipe}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{equipe.libelle}</h3>
                  <div className="text-xs text-slate-500">
                    Collaborateur responsable : <span className="font-semibold text-slate-700">{equipe.responsable_nom}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                  {membres.length} ouvrier(s)
                </span>
              </div>

              {/* Membres de l'équipe */}
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Opérateurs affectés
                </div>
                {membres.map((op) => (
                  <div key={op.matricule} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-sm border border-slate-200/60">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                        {op.matricule}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {op.prenom} {op.nom}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Entrée : {op.dateEntree}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Ajouter Opérateur */}
      {showOpModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Ajouter un opérateur</h3>
            <form onSubmit={handleCreateOperateur} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Matricule</label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="Ex: OP-005"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Équipe de rattachement</label>
                <select
                  value={equipeId}
                  onChange={(e) => setEquipeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {data.equipes.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      Équipe {eq.numeroEquipe} - {eq.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOpModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer Équipe */}
      {showEqModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Créer une nouvelle équipe</h3>
            <form onSubmit={handleCreateEquipe} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro d'équipe</label>
                <input
                  type="number"
                  value={numEquipe}
                  onChange={(e) => setNumEquipe(e.target.value)}
                  placeholder="Ex: 3"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Libellé de l'équipe</label>
                <input
                  type="text"
                  value={libelleEquipe}
                  onChange={(e) => setLibelleEquipe(e.target.value)}
                  placeholder="Ex: Équipe Gamma (Nuit)"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEqModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-slate-900 hover:bg-black text-white rounded-lg font-semibold"
                >
                  Créer l'Équipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

