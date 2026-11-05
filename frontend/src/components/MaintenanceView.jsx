import React, { useState } from 'react';

export default function MaintenanceView({ data, onAddMaintenance }) {
  const [showModal, setShowModal] = useState(false);

  const [machineRef, setMachineRef] = useState(data.machines[0]?.referenceMachine || '');
  const [dureeMinutes, setDureeMinutes] = useState(60);
  const [operateurMatricule, setOperateurMatricule] = useState(data.operateurs[0]?.matricule || '');

  const [pieceRef, setPieceRef] = useState(data.pieces[0]?.referencePiece || '');
  const [quantitePiece, setQuantitePiece] = useState(1);
  const [errorStock, setErrorStock] = useState('');

  const handleCreateMaintenance = (e) => {
    e.preventDefault();
    setErrorStock('');

    // Règle de validation de stock
    const piece = data.pieces.find(p => p.referencePiece === pieceRef);
    if (piece && piece.quantiteStock < parseInt(quantitePiece, 10)) {
      setErrorStock(`Stock insuffisant ! Seules ${piece.quantiteStock} pièces sont disponibles.`);
      return;
    }

    const op = data.operateurs.find(o => o.matricule === operateurMatricule);
    const mach = data.machines.find(m => m.referenceMachine === machineRef);

    const dureeHours = Math.floor(dureeMinutes / 60).toString().padStart(2, '0');
    const dureeMins = (dureeMinutes % 60).toString().padStart(2, '0');

    onAddMaintenance({
      machine_ref: machineRef,
      ligne_numero: mach ? mach.numero_ligne : 101,
      dateDebut: new Date().toISOString().split('T')[0],
      heureDebut: new Date().toTimeString().split(' ')[0].substring(0, 5),
      duree: `${dureeHours}:${dureeMins}:00`,
      operateurs: [op ? `${op.matricule} (${op.prenom} ${op.nom})` : operateurMatricule],
      consommations: [
        {
          piece_ref: pieceRef,
          quantite: parseInt(quantitePiece, 10),
          libelle: piece ? piece.libelle : pieceRef
        }
      ]
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 5 : Machines & Interventions de Maintenance
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Relevé d'intervention (date, heure, durée, techniciens) et décrémentation atomique des pièces de rechange.
          </p>
        </div>
        <button
          onClick={() => { setErrorStock(''); setShowModal(true); }}
          className="mt-3 sm:mt-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow transition"
        >
          + Déclarer une Maintenance
        </button>
      </div>

      {/* Parc des Machines */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-3">État actuel du parc machines</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data.machines.map((mach) => (
            <div key={mach.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700">{mach.referenceMachine}</span>
                  <span className="text-[10px] text-slate-400">Ligne {mach.numero_ligne}</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    mach.etat === 'OPERATIONNELLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : mach.etat === 'EN_MAINTENANCE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {mach.etat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des Interventions de Maintenance */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Historique des interventions déclarées</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Machine</th>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Durée</th>
                <th className="py-3 px-4">Opérateur(s)</th>
                <th className="py-3 px-4">Pièces Consommées</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.maintenances.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {m.machine_ref} (Ligne {m.ligne_numero})
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {m.dateDebut} à {m.heureDebut}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    ⏱️ {m.duree}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {m.operateurs.join(', ')}
                  </td>
                  <td className="py-3 px-4">
                    {m.consommations.map((c, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs rounded font-medium">
                        -{c.quantite}x {c.piece_ref}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Déclarer Maintenance */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Déclarer une intervention de maintenance</h3>
            <form onSubmit={handleCreateMaintenance} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Machine concernée</label>
                  <select
                    value={machineRef}
                    onChange={(e) => setMachineRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {data.machines.map(m => (
                      <option key={m.id} value={m.referenceMachine}>
                        {m.referenceMachine} (Ligne {m.numero_ligne})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={dureeMinutes}
                    onChange={(e) => setDureeMinutes(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Opérateur intervenant</label>
                <select
                  value={operateurMatricule}
                  onChange={(e) => setOperateurMatricule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {data.operateurs.map(o => (
                    <option key={o.id} value={o.matricule}>
                      {o.matricule} - {o.prenom} {o.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pièce consommée */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-xs font-bold text-amber-900 mb-2">Pièce de rechange consommée</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-amber-800 mb-1">Pièce</label>
                    <select
                      value={pieceRef}
                      onChange={(e) => { setPieceRef(e.target.value); setErrorStock(''); }}
                      className="w-full px-2 py-1.5 border border-amber-300 bg-white rounded text-xs outline-none"
                    >
                      {data.pieces.map(p => (
                        <option key={p.id} value={p.referencePiece}>
                          {p.referencePiece} (Stock: {p.quantiteStock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-800 mb-1">Quantité</label>
                    <input
                      type="number"
                      min="1"
                      value={quantitePiece}
                      onChange={(e) => { setQuantitePiece(e.target.value); setErrorStock(''); }}
                      required
                      className="w-full px-2 py-1.5 border border-amber-300 bg-white rounded text-xs outline-none"
                    />
                  </div>
                </div>

                {errorStock && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 bg-rose-50 p-2 rounded border border-rose-200">
                    ❌ {errorStock}
                  </p>
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
                  className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
                >
                  Valider l'Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

