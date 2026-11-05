import React from 'react';
import {
  Factory,
  Boxes,
  AlertTriangle,
  Wrench,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function DashboardView({ data, onNavigate }) {
  const totalArretMinutes = data.incidents.reduce((acc, inc) => acc + (inc.temps_minutes || 0), 0);
  const totalArretHeures = Math.floor(totalArretMinutes / 60);
  const resteMinutes = totalArretMinutes % 60;
  const dureeFormatee = totalArretHeures > 0 ? `${totalArretHeures}h ${resteMinutes}m` : `${totalArretMinutes} min`;

  const machinesEnMaintenance = data.machines.filter(m => m.etat === 'EN_MAINTENANCE' || m.etat === 'EN_PANNE').length;
  const machinesOp = data.machines.length - machinesEnMaintenance;
  const tauxDispo = data.machines.length > 0 ? Math.round((machinesOp / data.machines.length) * 100) : 100;

  const piecesFaibleStock = data.pieces.filter(p => p.quantiteStock < 25);

  return (
    <div className="space-y-6">
      
      {/* En-tête de supervision avec badge temps réel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tableau de Bord & Supervision Industrielle
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              EN DIRECT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs de performance industrielle temps réel (OEE, cadences, arrêts machine et stocks).
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>PostgreSQL Connecté &bull; 17 Tables</span>
          </div>
        </div>
      </div>

      {/* Cartes KPI Industrielles — Data-Dense Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Infrastructure Usine */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Infrastructure</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{data.ateliers.length}</span>
            <span className="text-xs font-medium text-slate-500">ateliers</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2 font-mono">
            <span>{data.lignes.length} lignes actives</span>
            <span>{data.machines.length} machines</span>
          </div>
        </div>

        {/* KPI 2 : Lots de Production */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Traçabilité Lots</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-indigo-600 font-mono">{data.lots.length}</span>
            <span className="text-xs font-medium text-slate-500">lots tracés</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
            Matricules ouvriers associés à 100%
          </div>
        </div>

        {/* KPI 3 : Temps d'Arrêt Cumulé */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Temps d'Arrêt Total</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-600 font-mono">{dureeFormatee}</span>
          </div>
          <div className="mt-2 text-xs text-rose-700 font-medium border-t border-slate-100 pt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{data.incidents.length} incident(s) consigné(s)</span>
          </div>
        </div>

        {/* KPI 4 : Disponibilité Parc Machines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Disponibilité Parc</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">{tauxDispo}%</span>
            <span className="text-xs font-medium text-slate-500">opérationnel</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2 font-mono">
            <span>{machinesOp} en ligne</span>
            <span className="text-amber-600 font-semibold">{machinesEnMaintenance} maint./arrêt</span>
          </div>
        </div>

      </div>

      {/* Grille Synoptique et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Synoptique des Ateliers & Lignes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">État des Lignes de Fabrication</h3>
              <p className="text-xs text-slate-500">Synoptique temps réel des capacités de production</p>
            </div>
            <button
              onClick={() => onNavigate('ateliers')}
              className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Gérer les ateliers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.ateliers.map((atelier) => (
              <div key={atelier.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Atelier #{atelier.numeroAtelier} — {atelier.libelle}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    {atelier.lignes?.length || 0} ligne(s)
                  </span>
                </div>
                <div className="space-y-1.5 mt-3">
                  {atelier.lignes?.map((ligne) => (
                    <div key={ligne.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-800">Ligne #{ligne.numeroLigne}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {ligne.nbOperateursNecessaires} ouvriers requis
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau Latéral : Alertes Stock & Actions Rapides */}
        <div className="space-y-6">
          
          {/* Alertes de Stock Critique (Module 6 & 8) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Alertes Seuil de Réappro</span>
              </h4>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {piecesFaibleStock.length} pièce(s)
              </span>
            </div>

            <div className="space-y-2.5">
              {piecesFaibleStock.slice(0, 3).map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-800">{p.referencePiece}</span>
                    <span className="font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                      Stock : {p.quantiteStock}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.libelle}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('stocks')}
              className="cursor-pointer w-full mt-3 py-2 text-xs font-semibold text-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              Consulter l'inventaire complet &rarr;
            </button>
          </div>

          {/* Raccourcis d'actions rapides */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-md border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Actions Opérationnelles Rapides</span>
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('lots')}
                className="cursor-pointer w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-left text-xs font-semibold rounded-xl flex items-center justify-between transition"
              >
                <span>Lancer un ordre de fabrication (Lot)</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={() => onNavigate('maintenance')}
                className="cursor-pointer w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-left text-xs font-semibold rounded-xl flex items-center justify-between transition"
              >
                <span>Déclarer une intervention de maintenance</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => onNavigate('incidents')}
                className="cursor-pointer w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-left text-xs font-semibold rounded-xl flex items-center justify-between transition"
              >
                <span>Signaler un incident avec temps d'arrêt</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
