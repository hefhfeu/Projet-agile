import React from 'react';
import {
  LayoutDashboard,
  Factory,
  Boxes,
  Tag,
  Users,
  AlertTriangle,
  Wrench,
  Layers,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, userRole }) {
  const isAdmin = userRole === 'ADMINISTRATEUR';
  const isRespAtelier = userRole === 'RESPONSABLE_ATELIER' || isAdmin;
  const isCollabResp = userRole === 'COLLABORATEUR_RESPONSABLE' || isAdmin;
  const isOperateur = userRole === 'OPERATEUR' || isAdmin;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, visible: true, tag: 'Général', color: 'text-indigo-400' },
    { id: 'ateliers', label: 'Ateliers & Lignes', icon: Factory, visible: isRespAtelier, tag: 'M1', color: 'text-blue-400' },
    { id: 'lots', label: 'Lots de Production', icon: Boxes, visible: isRespAtelier, tag: 'M2', color: 'text-cyan-400' },
    { id: 'produits', label: 'Catalogue Produits', icon: Tag, visible: isRespAtelier, tag: 'M3', color: 'text-sky-400' },
    { id: 'equipes', label: 'Équipes & Opérateurs', icon: Users, visible: isCollabResp, tag: 'M4', color: 'text-emerald-400' },
    { id: 'incidents', label: 'Incidents & Arrêts', icon: AlertTriangle, visible: isCollabResp, tag: 'M7', color: 'text-rose-400' },
    { id: 'maintenance', label: 'Machines & Maintenance', icon: Wrench, visible: isOperateur, tag: 'M5', color: 'text-amber-400' },
    { id: 'stocks', label: 'Stocks & Nomenclatures', icon: Layers, visible: isOperateur, tag: 'M6 & 8', color: 'text-violet-400' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800">
      
      {/* Section En-tête Navigation */}
      <div className="flex items-center justify-between px-3 mb-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
        <span>Modules Métier</span>
        <span className="text-[10px] text-indigo-400">8 Modules</span>
      </div>

      {/* Liste des menus avec icônes Lucide */}
      <nav className="space-y-1">
        {menuItems.filter(item => item.visible).map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`cursor-pointer w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : item.color} group-hover:scale-110`} />
                <span className="text-xs">{item.label}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isActive
                  ? 'bg-indigo-700/80 text-white'
                  : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
              }`}>
                {item.tag}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Cartouche Récapitulatif Système */}
      <div className="mt-auto pt-6 border-t border-slate-800/80">
        <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Intégrité PostgreSQL</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Décrémentation atomique</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Anti-cycle BOM (DFS)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Traçabilité par matricule</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
