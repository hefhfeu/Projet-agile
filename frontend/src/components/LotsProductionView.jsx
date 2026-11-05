import React, { useState } from 'react';

export default function LotsProductionView({ data, onAddLot }) {
  const [showModal, setShowModal] = useState(false);
  const [nouveauNumLot, setNouveauNumLot] = useState('');
  const [ligneSelectionnee, setLigneSelectionnee] = useState(data.lignes[0]?.numeroLigne || 101);
  const [produitSelectionne, setProduitSelectionne] = useState(data.produits[0]?.referenceProduit || '');
  const [ouvriersSelectionnes, setOuvriersSelectionnes] = useState([]);

  const toggleOuvrier = (matricule) => {
    if (ouvriersSelectionnes.includes(matricule)) {
      setOuvriersSelectionnes(ouvriersSelectionnes.filter(m => m !== matricule));
    } else {
      setOuvriersSelectionnes([...ouvriersSelectionnes, matricule]);
    }
  };

  const handleCreateLot = (e) => {
    e.preventDefault();
    if (!nouveauNumLot || ouvriersSelectionnes.length === 0) return;

    const prod = data.produits.find(p => p.referenceProduit === produitSelectionne);

    onAddLot({
      idLot: parseInt(nouveauNumLot, 10),
      dateProduction: new Date().toISOString().split('T')[0],
      ligne_numero: parseInt(ligneSelectionnee, 10),
      produit_ref: produitSelectionne,
      produit_nom: prod ? prod.designation : produitSelectionne,
      operateurs: ouvriersSelectionnes.map(m => {
        const op = data.operateurs.find(o => o.matricule === m);
        return op ? `${op.matricule} (${op.prenom} ${op.nom})` : m;
      }),
      nb_incidents: 0
    });

    setNouveauNumLot('');
    setOuvriersSelectionnes([]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 2 : Traçabilité des Lots de Production
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Traçabilité intégrale : chaque lot est lié à sa ligne, son produit fini et la liste nominative des ouvriers par matricule.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition"
        >
          + Lancer un Nouveau Lot
        </button>
      </div>

      {/* Liste des Lots */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Identifiant Lot</th>
                <th className="py-3 px-4">Date de Production</th>
                <th className="py-3 px-4">Ligne de Fabrication</th>
                <th className="py-3 px-4">Produit Fabriqué</th>
                <th className="py-3 px-4">Ouvriers ayant œuvré sur le lot</th>
                <th className="py-3 px-4">État & Incidents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">#{lot.idLot}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">{lot.dateProduction}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Ligne {lot.ligne_numero}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{lot.produit_ref}</div>
                    <div className="text-xs text-slate-500">{lot.produit_nom}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {lot.operateurs.map((op, idx) => (
                        <span key={idx} className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                          {op}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {lot.nb_incidents > 0 ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
                        ⚠️ {lot.nb_incidents} incident(s)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                        ✓ En cours (RAS)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Lot */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Créer un nouveau lot de fabrication</h3>
            <form onSubmit={handleCreateLot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Lot</label>
                  <input
                    type="number"
                    value={nouveauNumLot}
                    onChange={(e) => setNouveauNumLot(e.target.value)}
                    placeholder="Ex: 1003"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ligne de fabrication</label>
                  <select
                    value={ligneSelectionnee}
                    onChange={(e) => setLigneSelectionnee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {data.lignes.map(l => (
                      <option key={l.id} value={l.numeroLigne}>
                        Ligne {l.numeroLigne} ({l.nom_atelier})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Produit à fabriquer</label>
                <select
                  value={produitSelectionne}
                  onChange={(e) => setProduitSelectionne(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {data.produits.map(p => (
                    <option key={p.id} value={p.referenceProduit}>
                      {p.referenceProduit} - {p.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Affecter les ouvriers (matricules) *
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1.5 bg-slate-50">
                  {data.operateurs.map((op) => (
                    <label key={op.matricule} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ouvriersSelectionnes.includes(op.matricule)}
                        onChange={() => toggleOuvrier(op.matricule)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-mono font-semibold">{op.matricule}</span>
                      <span>— {op.prenom} {op.nom} ({op.equipe_libelle})</span>
                    </label>
                  ))}
                </div>
                {ouvriersSelectionnes.length === 0 && (
                  <p className="text-[11px] text-rose-500 mt-1">Au moins un ouvrier doit être affecté au lot.</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={ouvriersSelectionnes.length === 0}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold"
                >
                  Enregistrer le Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

