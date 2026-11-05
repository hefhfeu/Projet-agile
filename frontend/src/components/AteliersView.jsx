import React, { useState } from 'react';
import { Factory, Plus, Users, Cpu, Layers, X, ShieldCheck, Check } from 'lucide-react';

export default function AteliersView({ data, onAddAtelier, onAddLigne }) {
  const [showAtelierModal, setShowAtelierModal] = useState(false);
  const [showLigneModal, setShowLigneModal] = useState(false);

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
      
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Module 1 : Ateliers & Lignes de Fabrication
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              CRUD &bull; M1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hiérarchie industrielle : 1 Atelier possède 1 Responsable attitré et regroupe plusieurs Lignes composées de Machines.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowAtelierModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Atelier</span>
          </button>
          <button
            onClick={() => setShowLigneModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Ajouter une Ligne</span>
          </button>
        </div>
      </div>

      {/* Grille des Ateliers & Lignes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.ateliers.map((atelier) => (
          <div key={atelier.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition">
            
            {/* Header de l'atelier */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Atelier #{atelier.numeroAtelier}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {atelier.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5">{atelier.libelle}</h3>
                
                {/* Responsable attitré (Contrainte 1:1 UML) */}
                <div className="mt-2 flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Responsable : <strong>{atelier.responsable_nom || "Cadre désigné"}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded-full border border-slate-200">
                  {atelier.lignes?.length || 0} ligne(s)
                </span>
              </div>
            </div>

            {/* Lignes de production rattachées */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                <span>Lignes de fabrication associées</span>
                <span>Effectif Requis</span>
              </div>

              {atelier.lignes?.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  Aucune ligne configurée dans cet atelier.
                </div>
              ) : (
                atelier.lignes?.map((ligne) => (
                  <div
                    key={ligne.id}
                    className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-xs">
                        L{ligne.numeroLigne}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          Ligne #{ligne.numeroLigne}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <Cpu className="w-3 h-3 text-slate-400" />
                          <span>{ligne.nombre_machines || 1} machine(s) active(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-bold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{ligne.nbOperateursNecessaires} ouvriers</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal Créer Atelier */}
      {showAtelierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Factory className="w-4 h-4 text-blue-600" />
                <span>Créer un Nouvel Atelier</span>
              </h3>
              <button
                onClick={() => setShowAtelierModal(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAtelier} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Numéro d'atelier (Identifiant unique)
                </label>
                <input
                  type="number"
                  value={nouveauNumAtelier}
                  onChange={(e) => setNouveauNumAtelier(e.target.value)}
                  placeholder="Ex: 30"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Libellé officiel de l'atelier
                </label>
                <input
                  type="text"
                  value={nouveauLibelleAtelier}
                  onChange={(e) => setNouveauLibelleAtelier(e.target.value)}
                  placeholder="Ex: Atelier Peinture & Traitement Thermique"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAtelierModal(false)}
                  className="cursor-pointer px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Valider et enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter une Ligne */}
      {showLigneModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-800" />
                <span>Ajouter une Ligne de Fabrication</span>
              </h3>
              <button
                onClick={() => setShowLigneModal(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLigne} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Atelier d'accueil
                </label>
                <select
                  value={atelierCibleLigne}
                  onChange={(e) => setAtelierCibleLigne(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                >
                  {data.ateliers.map((a) => (
                    <option key={a.id} value={a.id}>
                      Atelier #{a.numeroAtelier} — {a.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Numéro de ligne
                </label>
                <input
                  type="number"
                  value={nouveauNumLigne}
                  onChange={(e) => setNouveauNumLigne(e.target.value)}
                  placeholder="Ex: 104"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Effectif d'opérateurs nécessaire (nbOperateursNecessaires)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={nouveauNbOp}
                  onChange={(e) => setNouveauNbOp(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowLigneModal(false)}
                  className="cursor-pointer px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Affecter la ligne
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
