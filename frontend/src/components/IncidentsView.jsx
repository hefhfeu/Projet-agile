import React, { useState } from 'react';

export default function IncidentsView({ data, onAddIncident, onAddTypeIncident }) {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Formulaire incident
  const [numIncident, setNumIncident] = useState('');
  const [lotSelectionne, setLotSelectionne] = useState(data.lots[0]?.idLot || 1001);
  const [typeCodeSelectionne, setTypeCodeSelectionne] = useState(data.typesIncidents[0]?.codeType || '');
  const [dureeArretMinutes, setDureeArretMinutes] = useState(30);

  // Formulaire type d'incident
  const [codeType, setCodeType] = useState('');
  const [libelleType, setLibelleType] = useState('');

  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (!numIncident || !lotSelectionne || !typeCodeSelectionne) return;

    const lot = data.lots.find(l => l.idLot === parseInt(lotSelectionne, 10));
    const typeInc = data.typesIncidents.find(t => t.codeType === typeCodeSelectionne);

    const hours = Math.floor(dureeArretMinutes / 60).toString().padStart(2, '0');
    const mins = (dureeArretMinutes % 60).toString().padStart(2, '0');

    onAddIncident({
      numeroIncident: parseInt(numIncident, 10),
      idLot: parseInt(lotSelectionne, 10),
      produit_ref: lot ? lot.produit_ref : '',
      type_code: typeCodeSelectionne,
      type_libelle: typeInc ? typeInc.libelle : typeCodeSelectionne,
      tempsArret: `${hours}:${mins}:00`,
      temps_minutes: parseInt(dureeArretMinutes, 10)
    });

    setNumIncident('');
    setShowIncidentModal(false);
  };

  const handleCreateType = (e) => {
    e.preventDefault();
    if (!codeType || !libelleType) return;
    onAddTypeIncident({
      codeType: codeType.trim().toUpperCase(),
      libelle: libelleType.trim()
    });
    setCodeType('');
    setLibelleType('');
    setShowTypeModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 7 : Incidents de Production & Temps d'Arrêt
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Règles métier : Un incident concerne un lot unique et mémorise systématiquement le temps d'arrêt machine.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowTypeModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Type d'Incident
          </button>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            + Déclarer un Incident
          </button>
        </div>
      </div>

      {/* Tableau des Incidents Déclarés */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Incidents déclarés sur les lots</h3>
          <span className="text-xs font-semibold text-slate-500">
            {data.incidents.length} incident(s) répertorié(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">N° Incident</th>
                <th className="py-3 px-4">Lot de Production Impacté</th>
                <th className="py-3 px-4">Type de Panne / Incident</th>
                <th className="py-3 px-4">Temps d'Arrêt Mesuré</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{inc.numeroIncident}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">Lot #{inc.idLot}</span>
                    <span className="text-xs text-slate-500 block font-mono">{inc.produit_ref}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
                      {inc.type_libelle}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-700 font-mono">
                    ⏱️ {inc.tempsArret} ({inc.temps_minutes} min)
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                      Arrêt consigné
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Types d'Incidents Référencés */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Référentiel des Types d'Incidents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.typesIncidents.map((t) => (
            <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="font-mono font-bold text-slate-800 block text-[11px] text-blue-700">
                {t.codeType}
              </span>
              <span className="font-medium text-slate-700 mt-1 block">
                {t.libelle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Déclarer Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Déclarer un incident d'arrêt de production</h3>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro d'incident</label>
                <input
                  type="number"
                  value={numIncident}
                  onChange={(e) => setNumIncident(e.target.value)}
                  placeholder="Ex: 502"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lot de fabrication unique concerné</label>
                <select
                  value={lotSelectionne}
                  onChange={(e) => setLotSelectionne(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {data.lots.map(l => (
                    <option key={l.id} value={l.idLot}>
                      Lot #{l.idLot} — {l.produit_ref} (Ligne {l.ligne_numero})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type d'incident</label>
                <select
                  value={typeCodeSelectionne}
                  onChange={(e) => setTypeCodeSelectionne(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {data.typesIncidents.map(t => (
                    <option key={t.id} value={t.codeType}>
                      [{t.codeType}] {t.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Temps d'arrêt (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={dureeArretMinutes}
                  onChange={(e) => setDureeArretMinutes(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                >
                  Enregistrer l'Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer Type Incident */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Ajouter un type d'incident</h3>
            <form onSubmit={handleCreateType} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Code Type</label>
                <input
                  type="text"
                  value={codeType}
                  onChange={(e) => setCodeType(e.target.value)}
                  placeholder="Ex: INC-HYDR"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Libellé</label>
                <input
                  type="text"
                  value={libelleType}
                  onChange={(e) => setLibelleType(e.target.value)}
                  placeholder="Ex: Fuite du circuit hydraulique"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTypeModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-slate-900 hover:bg-black text-white rounded-lg font-semibold"
                >
                  Ajouter le Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

