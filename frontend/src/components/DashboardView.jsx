import React from 'react';

export default function DashboardView({ data, onNavigate }) {
  const totalArretMinutes = data.incidents.reduce((acc, inc) => acc + (inc.temps_minutes || 0), 0);
  const machinesEnMaintenance = data.machines.filter(m => m.etat === 'EN_MAINTENANCE' || m.etat === 'EN_PANNE').length;
  const piecesFaibleStock = data.pieces.filter(p => p.quantiteStock < 20);

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Supervision Opérationnelle de l'Usine
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Indicateurs de performance temps réel sur les ateliers, machines, lots et stocks.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Système synchronisé en temps réel</span>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ateliers & Lignes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Infrastructure</span>
            <span className="text-2xl">🏭</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">{data.ateliers.length}</span>
            <span className="text-sm text-slate-600 font-medium">ateliers</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {data.lignes.length} lignes &bull; {data.machines.length} machines installées
          </div>
        </div>

        {/* Lots de production */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Traçabilité Lots</span>
            <span className="text-2xl">📦</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-blue-600">{data.lots.length}</span>
            <span className="text-sm text-slate-600 font-medium">lots tracés</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Affectation nominative par matricule ouvrier
          </div>
        </div>

        {/* Arrêts & Incidents */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Incidents & Arrêts</span>
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-amber-600">{data.incidents.length}</span>
            <span className="text-sm text-slate-600 font-medium">incidents</span>
          </div>
          <div className="mt-1 text-xs text-amber-700 font-semibold">
            {totalArretMinutes} min d'arrêt cumulé sur les lots
          </div>
        </div>

        {/* État du Parc Machines */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parc Machines</span>
            <span className="text-2xl">🔧</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold ${machinesEnMaintenance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {machinesEnMaintenance}
            </span>
            <span className="text-sm text-slate-600 font-medium">en maintenance/panne</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {data.machines.length - machinesEnMaintenance} machines opérationnelles
          </div>
        </div>

      </div>

      {/* Alertes et actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Derniers lots et incidents */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Lots de fabrication récents</h3>
            <button
              onClick={() => onNavigate('lots')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Voir tous les lots &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">N° Lot</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Ligne</th>
                  <th className="py-2.5 px-3">Produit</th>
                  <th className="py-2.5 px-3">Ouvriers affectés</th>
                  <th className="py-2.5 px-3">Incidents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.lots.map(lot => (
                  <tr key={lot.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900">#{lot.idLot}</td>
                    <td className="py-3 px-3 text-slate-500 text-xs">{lot.dateProduction}</td>
                    <td className="py-3 px-3">Ligne {lot.ligne_numero}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{lot.produit_nom}</td>
                    <td className="py-3 px-3 text-xs text-slate-500">
                      {lot.operateurs.join(', ')}
                    </td>
                    <td className="py-3 px-3">
                      {lot.nb_incidents > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                          {lot.nb_incidents} incident(s)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          RAS
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertes Stocks & Pièces critiques */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Alertes Pièces Détachées</h3>
              <button
                onClick={() => onNavigate('stocks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Gérer stocks &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {piecesFaibleStock.map(piece => (
                <div key={piece.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-900">{piece.referencePiece}</div>
                    <div className="text-xs text-amber-700">{piece.libelle}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-900">{piece.quantiteStock}</span>
                    <span className="text-[10px] text-amber-700 block">en stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              💡 <strong>Règle de maintenance :</strong> la consommation décrémente automatiquement le stock et interdit toute saisie en cas de stock insuffisant.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

