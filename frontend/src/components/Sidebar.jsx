import React from 'react';

export default function Sidebar({ activeTab, onSelectTab, userRole }) {
  const isAdmin = userRole === 'ADMINISTRATEUR';
  const isRespAtelier = userRole === 'RESPONSABLE_ATELIER' || isAdmin;
  const isCollabResp = userRole === 'COLLABORATEUR_RESPONSABLE' || isAdmin;
  const isOperateur = userRole === 'OPERATEUR' || isAdmin;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊', visible: true, tag: 'Général' },
    { id: 'ateliers', label: 'Ateliers & Lignes', icon: '🏭', visible: isRespAtelier, tag: 'Module 1' },
    { id: 'lots', label: 'Lots de Production', icon: '📦', visible: isRespAtelier, tag: 'Module 2' },
    { id: 'produits', label: 'Catalogue Produits', icon: '🏷️', visible: isRespAtelier, tag: 'Module 3' },
    { id: 'equipes', label: 'Équipes & Opérateurs', icon: '👥', visible: isCollabResp, tag: 'Module 4' },
    { id: 'incidents', label: 'Incidents & Arrêts', icon: '⚠️', visible: isCollabResp, tag: 'Module 7' },
    { id: 'maintenance', label: 'Machines & Maintenance', icon: '🔧', visible: isOperateur, tag: 'Module 5' },
    { id: 'stocks', label: 'Pièces & Nomenclatures', icon: '⚙️', visible: isOperateur, tag: 'Module 6 & 8' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-3 mb-3">
        Navigation Industrielle
      </div>

      <nav className="space-y-1">
        {menuItems.filter(item => item.visible).map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                {item.tag}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-400">
        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
          <div className="font-semibold text-slate-200 mb-1">Règles Métier Actives</div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            • Décrémentation atomique de stock<br/>
            • Contrôle anti-cycle BOM récursif<br/>
            • Traçabilité lot $\rightarrow$ ouvriers
          </p>
        </div>
      </div>
    </aside>
  );
}

