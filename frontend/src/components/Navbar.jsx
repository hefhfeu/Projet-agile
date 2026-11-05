import React from 'react';
import { Factory, LogOut, ShieldCheck, Database, Check } from 'lucide-react';

export default function Navbar({ currentUser, onSwitchUser, onLogout }) {
  const roleBadges = {
    ADMINISTRATEUR: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
      pill: 'bg-purple-600 text-white'
    },
    RESPONSABLE_ATELIER: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      pill: 'bg-blue-600 text-white'
    },
    COLLABORATEUR_RESPONSABLE: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-600 text-white'
    },
    OPERATEUR: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      pill: 'bg-amber-600 text-white'
    },
  };

  const currentBadge = roleBadges[currentUser?.role] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    pill: 'bg-slate-800 text-white'
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Identité Usine TWIN_3 */}
        <div className="flex items-center space-x-3.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-cyan-400 flex items-center justify-center shadow-md shadow-slate-950/20 border border-slate-800">
            <Factory className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                USINE TWIN_3
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                PROD 4.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Supervision Industrielle & Traçabilité Temps Réel
            </p>
          </div>
        </div>

        {/* Badge PostgreSQL Live & Sélecteur Rôle */}
        <div className="flex items-center space-x-3">
          
          {/* Témoin de connexion PostgreSQL 17 */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-50 border border-slate-200 text-slate-600">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>PostgreSQL 17 :5432</span>
          </div>

          {/* Sélecteur rapide de profil (Mode Démo / Évaluation) */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl text-xs border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              Rôle :
            </span>
            {[
              { id: 'admin', label: 'Admin', roleKey: 'ADMINISTRATEUR' },
              { id: 'resp_atelier', label: 'Resp. Ateliers', roleKey: 'RESPONSABLE_ATELIER' },
              { id: 'collab_resp', label: 'Collab. Resp.', roleKey: 'COLLABORATEUR_RESPONSABLE' },
              { id: 'operateur1', label: 'Opérateur', roleKey: 'OPERATEUR' },
            ].map((r) => {
              const active = currentUser?.username === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSwitchUser(r.id)}
                  className={`cursor-pointer px-2.5 py-1 rounded-lg font-medium text-xs transition-all duration-150 ${
                    active
                      ? `${roleBadges[r.roleKey].pill} shadow-xs font-semibold`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Badge utilisateur connecté */}
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
              {currentUser ? `${currentUser.prenom?.[0] || 'U'}${currentUser.nom?.[0] || ''}` : 'U'}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">
                {currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Utilisateur'}
              </div>
              <div className="flex items-center justify-end space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${currentBadge.dot}`}></span>
                <span className="text-[10px] font-medium text-slate-500 font-mono">
                  {currentUser?.role_libelle || currentUser?.role}
                </span>
              </div>
            </div>
            
            {/* Bouton de déconnexion */}
            <button
              onClick={onLogout}
              title="Fermer la session (Déconnexion)"
              className="cursor-pointer p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
