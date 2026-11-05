import React from 'react';

export default function Navbar({ currentUser, onSwitchUser, onLogout }) {
  const roleBadges = {
    ADMINISTRATEUR: 'bg-purple-100 text-purple-800 border-purple-300',
    RESPONSABLE_ATELIER: 'bg-blue-100 text-blue-800 border-blue-300',
    COLLABORATEUR_RESPONSABLE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    OPERATEUR: 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Identité Usine */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow">
            🏭
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Système de Gestion d'Usine
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Conception Agile TWIN_3 &bull; Supervision Industrielle
            </p>
          </div>
        </div>

        {/* Profil & Contrôles */}
        <div className="flex items-center space-x-4">
          {/* Sélecteur rapide de rôle (Mode Démo / Évaluation) */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Simuler profil :</span>
            <button
              onClick={() => onSwitchUser('admin')}
              className={`px-2 py-0.5 rounded ${currentUser?.username === 'admin' ? 'bg-purple-600 text-white font-medium' : 'hover:bg-slate-200'}`}
            >
              Admin
            </button>
            <button
              onClick={() => onSwitchUser('resp_atelier')}
              className={`px-2 py-0.5 rounded ${currentUser?.username === 'resp_atelier' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-200'}`}
            >
              Resp. Ateliers
            </button>
            <button
              onClick={() => onSwitchUser('collab_resp')}
              className={`px-2 py-0.5 rounded ${currentUser?.username === 'collab_resp' ? 'bg-emerald-600 text-white font-medium' : 'hover:bg-slate-200'}`}
            >
              Collab. Resp.
            </button>
            <button
              onClick={() => onSwitchUser('operateur1')}
              className={`px-2 py-0.5 rounded ${currentUser?.username === 'operateur1' ? 'bg-amber-600 text-white font-medium' : 'hover:bg-slate-200'}`}
            >
              Opérateur
            </button>
          </div>

          {/* Badge utilisateur actuel */}
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800">
                {currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Non connecté'}
              </div>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${roleBadges[currentUser?.role] || 'bg-gray-100 text-gray-700'}`}>
                {currentUser?.role_libelle || currentUser?.role}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              title="Déconnexion"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}

