import React, { useState } from 'react';
import { Wrench, Clock, AlertTriangle, CheckCircle2, Cog, Package, Plus, Search, Filter, X, User, Activity, AlertCircle } from 'lucide-react';

export default function MaintenanceView({ data, onAddMaintenance }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMachine, setFilterMachine] = useState('ALL');

  const [machineRef, setMachineRef] = useState(data.machines[0]?.referenceMachine || '');
  const [dureeMinutes, setDureeMinutes] = useState(60);
  const [operateurMatricule, setOperateurMatricule] = useState(data.operateurs[0]?.matricule || '');

  const [pieceRef, setPieceRef] = useState(data.pieces[0]?.referencePiece || '');
  const [quantitePiece, setQuantitePiece] = useState(1);
  const [errorStock, setErrorStock] = useState('');

  // Quick stepper helper
  const addMinutes = (mins) => {
    setDureeMinutes(prev => Math.max(5, (parseInt(prev, 10) || 0) + mins));
  };

  const handleCreateMaintenance = (e) => {
    e.preventDefault();
    setErrorStock('');

    // Règle de validation de stock
    const piece = data.pieces.find(p => p.referencePiece === pieceRef);
    if (piece && piece.quantiteStock < parseInt(quantitePiece, 10)) {
      setErrorStock(`Stock insuffisant ! Seules ${piece.quantiteStock} pièces disponibles pour ${piece.libelle}.`);
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

  const selectedPieceObject = data.pieces.find(p => p.referencePiece === pieceRef);

  const maintenancesFiltrees = data.maintenances.filter(m => {
    const matchSearch = m.machine_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.operateurs.some(op => op.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.consommations.some(c => c.piece_ref.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchMachine = filterMachine === 'ALL' || m.machine_ref === filterMachine;
    return matchSearch && matchMachine;
  });

  const machinesOperationnelles = data.machines.filter(m => m.etat === 'OPERATIONNELLE').length;
  const machinesEnMaintenance = data.machines.filter(m => m.etat === 'EN_MAINTENANCE').length;
  const machinesArretees = data.machines.filter(m => m.etat === 'ARRETEE').length;

  return (
    <div className="space-y-6">
      
      {/* En-tête de section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Module 5 : Machines & Interventions de Maintenance
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Surveillance du parc machines, déclaration des interventions techniques et décrémentation atomique des pièces de rechange du stock.
          </p>
        </div>

        {/* Bouton d'action */}
        <button
          onClick={() => { setErrorStock(''); setShowModal(true); }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Déclarer une Intervention</span>
        </button>
      </div>

      {/* Cartes KPI Maintenance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Opérationnelles</div>
            <div className="text-2xl font-bold font-mono text-emerald-600">
              {machinesOperationnelles} <span className="text-xs text-slate-400 font-sans font-normal">/ {data.machines.length}</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Taux de dispo 75%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">En Maintenance</div>
            <div className="text-2xl font-bold font-mono text-amber-600">{machinesEnMaintenance}</div>
            <div className="text-[11px] text-amber-700 font-medium">Interventions actives</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Machines Arrêtées</div>
            <div className="text-2xl font-bold font-mono text-rose-600">{machinesArretees}</div>
            <div className="text-[11px] text-rose-700 font-medium">Action requise</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Interventions Clôturées</div>
            <div className="text-2xl font-bold font-mono text-blue-600">{data.maintenances.length}</div>
            <div className="text-[11px] text-blue-700 font-medium">Historique consigné</div>
          </div>
        </div>
      </div>

      {/* Parc des Machines : Cartes d'état en direct */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">État en direct du parc machine</h3>
            <p className="text-xs text-slate-500">Supervision de chaque unité installée sur les lignes</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
            {data.machines.length} Équipements
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.machines.map((mach) => {
            const isOp = mach.etat === 'OPERATIONNELLE';
            const isMaint = mach.etat === 'EN_MAINTENANCE';
            return (
              <div 
                key={mach.id} 
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isOp 
                    ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300' 
                    : isMaint 
                    ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300' 
                    : 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800 shadow-2xs">
                      {mach.referenceMachine}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Ligne #{mach.numero_ligne}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isOp ? 'bg-emerald-500 ring-2 ring-emerald-200' : isMaint ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-rose-500 ring-2 ring-rose-200'
                    }`}></span>
                    <span className={`text-xs font-bold ${
                      isOp ? 'text-emerald-800' : isMaint ? 'text-amber-800' : 'text-rose-800'
                    }`}>
                      {mach.etat}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Diagnostic OK</span>
                  <button
                    onClick={() => {
                      setMachineRef(mach.referenceMachine);
                      setShowModal(true);
                    }}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 cursor-pointer hover:underline"
                  >
                    Intervenir &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historique des Interventions */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Historique des interventions de maintenance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Relevé chronologique avec décompte des pièces de rechange consommées</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher intervention..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            <div className="relative w-full sm:w-44">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <select
                value={filterMachine}
                onChange={(e) => setFilterMachine(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition cursor-pointer"
              >
                <option value="ALL">Toutes machines</option>
                {data.machines.map(m => (
                  <option key={m.id} value={m.referenceMachine}>{m.referenceMachine}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Équipement Machine</th>
                <th className="py-3 px-4">Date & Horodatage</th>
                <th className="py-3 px-4">Durée de l'Arrêt</th>
                <th className="py-3 px-4">Technicien(s) Intervenant(s)</th>
                <th className="py-3 px-4">Pièces de Rechange Décomptées</th>
                <th className="py-3 px-4 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {maintenancesFiltrees.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        <Cog className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-slate-900 block">{m.machine_ref}</span>
                        <span className="text-[10px] text-slate-400">Ligne #{m.ligne_numero}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    <div className="font-semibold text-slate-800">{m.dateDebut}</div>
                    <div className="text-[10px] text-slate-400">à {m.heureDebut}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{m.duree}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {m.operateurs.map((op, i) => (
                        <div key={i} className="flex items-center space-x-1 text-slate-700">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{op}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {m.consommations.map((c, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-md text-[11px] font-mono font-semibold"
                        >
                          <Package className="w-3 h-3 text-rose-500" />
                          <span>-{c.quantite}x {c.piece_ref}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Clôturée</span>
                    </span>
                  </td>
                </tr>
              ))}
              {maintenancesFiltrees.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Aucune intervention ne correspond à votre filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Déclarer Intervention */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Enregistrer une Intervention de Maintenance</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaintenance} className="space-y-4 mt-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Machine Concernée <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={machineRef}
                    onChange={(e) => setMachineRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    {data.machines.map(m => (
                      <option key={m.id} value={m.referenceMachine}>
                        {m.referenceMachine} (Ligne {m.numero_ligne}) - {m.etat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durée d'Intervention (min) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={dureeMinutes}
                    onChange={(e) => setDureeMinutes(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-mono"
                  />
                  {/* Quick steppers tactiles */}
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <button 
                      type="button" 
                      onClick={() => addMinutes(15)} 
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                    >
                      +15m
                    </button>
                    <button 
                      type="button" 
                      onClick={() => addMinutes(30)} 
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                    >
                      +30m
                    </button>
                    <button 
                      type="button" 
                      onClick={() => addMinutes(60)} 
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                    >
                      +1h
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technicien / Opérateur Intervenant <span className="text-rose-500">*</span>
                </label>
                <select
                  value={operateurMatricule}
                  onChange={(e) => setOperateurMatricule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {data.operateurs.map(o => (
                    <option key={o.id} value={o.matricule}>
                      {o.matricule} — {o.prenom} {o.nom} (Équipe {o.equipe_id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pièce consommée avec contrôle de stock en temps réel */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                    <Package className="w-3.5 h-3.5" />
                    <span>Pièce de rechange décomptée du stock</span>
                  </div>
                  {selectedPieceObject && (
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedPieceObject.quantiteStock < 10 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Stock : {selectedPieceObject.quantiteStock} dispo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-amber-800 mb-1">Référence pièce</label>
                    <select
                      value={pieceRef}
                      onChange={(e) => { setPieceRef(e.target.value); setErrorStock(''); }}
                      className="w-full px-2.5 py-1.5 border border-amber-300 bg-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {data.pieces.map(p => (
                        <option key={p.id} value={p.referencePiece}>
                          {p.referencePiece} — {p.libelle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-800 mb-1">Qté utilisée</label>
                    <input
                      type="number"
                      min="1"
                      value={quantitePiece}
                      onChange={(e) => { setQuantitePiece(e.target.value); setErrorStock(''); }}
                      required
                      className="w-full px-2.5 py-1.5 border border-amber-300 bg-white rounded-lg text-xs outline-none font-mono focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {errorStock && (
                  <div className="flex items-center space-x-2 mt-3 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorStock}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow transition active:scale-95 cursor-pointer"
                >
                  Valider l'Intervention & Décrémenter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
