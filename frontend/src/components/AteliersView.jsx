import React, { useState } from 'react';

export default function AteliersView({ data, onAddAtelier, onAddLigne }) {
  const [showAtelierModal, setShowAtelierModal] = useState(false);
  const [showLigneModal, setShowLigneModal] = useState(false);
  const [selectedAtelierId, setSelectedAtelierId] = useState(data.ateliers[0]?.id || 1);

  const [nouveauNumAtelier, setNouveauNumAtelier] = useState('');
  const [nouveauLibelleAtelier, setNouveauLibelleAtelier] = useState('');

  const [nouveauNumLigne, setNouveauNumLigne] = useState('');
  const [nouveauNbOp, setNouveauNbOp] = useState(3);
  const [atelierCibleLigne, setAtelierCibleLigne] = useState(data.ateliers[0]?.id || 1);

  const handleCreateAtelier = (e) => {
    e.preventDefault();
    if (!nouveauNumAtelier || !nouveauLibelleAtelier) return;
    onAddAtelier({
      numeroAtelier: parseInt(nouveauNumAtelier, 10),
      libelle: nouveauLibelleAtelier,
      responsable_nom: "Michel Martin"
    });
    setNouveauNumAtelier('');
    setNouveauLibelleAtelier('');
    setShowAtelierModal(false);
  };

  const handleCreateLigne = (e) => {
    e.preventDefault();
    if (!nouveauNumLigne) return;
    onAddLigne({
      numeroLigne: parseInt(nouveauNumLigne, 10),
      nbOperateursNecessaires: parseInt(nouveauNbOp, 10),
      atelier_id: parseInt(atelierCibleLigne, 10)
    });
    setNouveauNumLigne('');
    setShowLigneModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 1 : Ateliers & Lignes de Fabrication
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Hiérarchie physique : 1 Atelier $\rightarrow$ plusieurs Lignes de fabrication $\rightarrow$ Machines.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowAtelierModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Créer un Atelier
          </button>
          <button
            onClick={() => setShowLigneModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Ajouter une Ligne
          </button>
        </div>
      </div>

      {/* Grille des Ateliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.ateliers.map((atelier) => (
          <div key={atelier.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Atelier #{atelier.numeroAtelier}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{atelier.libelle}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Responsable : <span className="font-semibold text-slate-700">{atelier.responsable_nom}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full">
                {atelier.lignes.length} Ligne(s)
              </span>
            </div>

            {/* Lignes de fabrication rattachées */}
            <div className="mt-5 space-y-2.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lignes de production rattachées
              </div>
              {atelier.lignes.map((ligne) => (
                <div
                  key={ligne.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      L{ligne.numeroLigne}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        Ligne {ligne.numeroLigne}
                      </div>
                      <div className="text-xs text-slate-500">
                        Effectif requis : <strong className="text-slate-700">{ligne.nbOperateursNecessaires} opérateurs</strong>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    {ligne.nombre_machines || 1} machine(s)
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Modal Créer Atelier */}
      {showAtelierModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Créer un nouvel atelier</h3>
            <form onSubmit={handleCreateAtelier} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro d'atelier</label>
                <input
                  type="number"
                  value={nouveauNumAtelier}
                  onChange={(e) => setNouveauNumAtelier(e.target.value)}
                  placeholder="Ex: 30"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Libellé de l'atelier</label>
                <input
                  type="text"
                  value={nouveauLibelleAtelier}
                  onChange={(e) => setNouveauLibelleAtelier(e.target.value)}
                  placeholder="Ex: Atelier Peinture & Conditionnement"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAtelierModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Enregistrer l'Atelier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer Ligne */}
      {showLigneModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Ajouter une ligne de fabrication</h3>
            <form onSubmit={handleCreateLigne} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de ligne</label>
                <input
                  type="number"
                  value={nouveauNumLigne}
                  onChange={(e) => setNouveauNumLigne(e.target.value)}
                  placeholder="Ex: 103"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre d'opérateurs nécessaires</label>
                <input
                  type="number"
                  min="1"
                  value={nouveauNbOp}
                  onChange={(e) => setNouveauNbOp(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Atelier de rattachement</label>
                <select
                  value={atelierCibleLigne}
                  onChange={(e) => setAtelierCibleLigne(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {data.ateliers.map(a => (
                    <option key={a.id} value={a.id}>
                      Atelier {a.numeroAtelier} - {a.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLigneModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-slate-900 hover:bg-black text-white rounded-lg font-semibold"
                >
                  Ajouter la Ligne
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

