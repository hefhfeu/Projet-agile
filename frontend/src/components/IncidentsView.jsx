import React, { useState } from 'react';
import { AlertTriangle, Clock, Plus, Search, Filter, ShieldAlert, Tag, CheckCircle2, X, AlertCircle, Flame, BarChart2 } from 'lucide-react';

export default function IncidentsView({ data, onAddIncident, onAddTypeIncident }) {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Formulaire incident
  const [numIncident, setNumIncident] = useState('');
  const [lotSelectionne, setLotSelectionne] = useState(data.lots[0]?.idLot || 1001);
  const [typeCodeSelectionne, setTypeCodeSelectionne] = useState(data.typesIncidents[0]?.codeType || '');
  const [dureeArretMinutes, setDureeArretMinutes] = useState(30);

  // Formulaire type d'incident
  const [codeType, setCodeType] = useState('');
  const [libelleType, setLibelleType] = useState('');

  // Quick stepper helper
  const addDowntime = (mins) => {
    setDureeArretMinutes(prev => Math.max(5, (parseInt(prev, 10) || 0) + mins));
  };

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

  const totalMinutesArret = data.incidents.reduce((sum, inc) => sum + (inc.temps_minutes || 0), 0);
  const totalHeures = Math.floor(totalMinutesArret / 60);
  const resteMinutes = totalMinutesArret % 60;

  const incidentsFiltres = data.incidents.filter(inc => {
    const matchSearch = inc.numeroIncident.toString().includes(searchTerm) ||
      inc.idLot.toString().includes(searchTerm) ||
      inc.type_libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.produit_ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'ALL' || inc.type_code === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      
      {/* En-tête de section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Module 7 : Incidents de Production & Temps d'Arrêt
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Rattachement exclusif au lot de fabrication, typologie des aléas techniques et comptabilisation rigoureuse des temps d'indisponibilité machine.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTypeModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold shadow-sm transition-all hover:border-slate-400 active:scale-95 cursor-pointer"
          >
            <Tag className="w-4 h-4 text-slate-500" />
            <span>+ Type d'Incident</span>
          </button>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Déclarer un Incident</span>
          </button>
        </div>
      </div>

      {/* Cartes KPI Incidents & Temps d'Arrêt */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Incidents</div>
            <div className="text-2xl font-bold font-mono text-slate-900">{data.incidents.length}</div>
            <div className="text-[11px] text-slate-500">Lots impactés consignés</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Temps d'Arrêt Total</div>
            <div className="text-2xl font-bold font-mono text-amber-600">
              {totalHeures}h {resteMinutes}m
            </div>
            <div className="text-[11px] text-amber-700 font-medium">{totalMinutesArret} minutes cumulées</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Typologies Définies</div>
            <div className="text-2xl font-bold font-mono text-blue-600">{data.typesIncidents.length}</div>
            <div className="text-[11px] text-blue-700 font-medium">Référentiel normalisé</div>
          </div>
        </div>
      </div>

      {/* Tableau des Incidents Déclarés */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Registre officiel des incidents d'usine</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historique des pannes avec traçabilité lot et durée d'arrêt</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher incident ou lot..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
              />
            </div>

            <div className="relative w-full sm:w-44">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition cursor-pointer"
              >
                <option value="ALL">Tous les types</option>
                {data.typesIncidents.map(t => (
                  <option key={t.id} value={t.codeType}>[{t.codeType}] {t.libelle}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">N° Incident</th>
                <th className="py-3 px-4">Lot de Production Rattaché</th>
                <th className="py-3 px-4">Typologie & Cause Racine</th>
                <th className="py-3 px-4">Temps d'Arrêt Enregistré</th>
                <th className="py-3 px-4 text-center">Consignation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {incidentsFiltres.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200/80">
                      #{inc.numeroIncident}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 font-mono">Lot #{inc.idLot}</div>
                    <div className="text-[10px] text-slate-500">{inc.produit_ref}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      <span>{inc.type_libelle}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-50/60 rounded-md border border-rose-100">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>{inc.tempsArret}</span>
                      <span className="text-xs text-rose-500 font-sans font-normal">({inc.temps_minutes} min)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-medium text-[11px]">
                      <AlertCircle className="w-3 h-3" />
                      <span>Arrêt Consigné</span>
                    </span>
                  </td>
                </tr>
              ))}
              {incidentsFiltres.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Aucun incident ne correspond au filtre de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Référentiel des Types d'Incidents */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Nomenclature des Types d'Incidents</h3>
            <p className="text-xs text-slate-500">Grille de qualification industrielle des arrêts de chaîne</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
            {data.typesIncidents.length} Catégories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {data.typesIncidents.map((t) => (
            <div key={t.id} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                  {t.codeType}
                </span>
                <Tag className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="font-semibold text-xs text-slate-800 mt-2.5">
                {t.libelle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Déclarer Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Déclarer un Arrêt de Production</h3>
              </div>
              <button 
                onClick={() => setShowIncidentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro d'Incident <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={numIncident}
                  onChange={(e) => setNumIncident(e.target.value)}
                  placeholder="502"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lot de Fabrication Impacté <span className="text-rose-500">*</span>
                </label>
                <select
                  value={lotSelectionne}
                  onChange={(e) => setLotSelectionne(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none cursor-pointer"
                >
                  {data.lots.map(l => (
                    <option key={l.id} value={l.idLot}>
                      Lot #{l.idLot} — {l.produit_ref} (Ligne {l.ligne_numero})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Conformément au diagramme UML, un incident concerne un lot unique.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Typologie de l'Aléa <span className="text-rose-500">*</span>
                </label>
                <select
                  value={typeCodeSelectionne}
                  onChange={(e) => setTypeCodeSelectionne(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none cursor-pointer"
                >
                  {data.typesIncidents.map(t => (
                    <option key={t.id} value={t.codeType}>
                      [{t.codeType}] {t.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temps d'Arrêt Machine (minutes) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={dureeArretMinutes}
                  onChange={(e) => setDureeArretMinutes(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono"
                />
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <button 
                    type="button" 
                    onClick={() => addDowntime(10)} 
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                  >
                    +10m
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addDowntime(15)} 
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                  >
                    +15m
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addDowntime(30)} 
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                  >
                    +30m
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addDowntime(60)} 
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono font-medium cursor-pointer"
                  >
                    +1h
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow transition active:scale-95 cursor-pointer"
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
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Ajouter une Typologie d'Incident</h3>
              </div>
              <button 
                onClick={() => setShowTypeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateType} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code Typologie <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={codeType}
                  onChange={(e) => setCodeType(e.target.value)}
                  placeholder="INC-HYDR"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Libellé Explicatif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={libelleType}
                  onChange={(e) => setLibelleType(e.target.value)}
                  placeholder="Fuite sur circuit hydraulique haute pression"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTypeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-slate-900 hover:bg-black text-white rounded-lg font-semibold shadow transition active:scale-95 cursor-pointer"
                >
                  Ajouter au Référentiel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
