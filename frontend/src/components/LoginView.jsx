import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Factory, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginView({ onLogin, users }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const foundUser = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
      
      // En mode développement / local, on vérifie que le mot de passe correspond ou mot de passe par défaut
      if (foundUser) {
        onLogin(foundUser, password);
      } else {
        setError("Identifiant ou mot de passe incorrect. Veuillez vérifier vos accès.");
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (userAccount, defaultPwd) => {
    setUsername(userAccount.username);
    setPassword(defaultPwd);
    setError('');
    onLogin(userAccount, defaultPwd);
  };

  const accounts = [
    {
      username: 'admin',
      password: 'admin123',
      label: 'Administrateur',
      desc: 'Gestion des comptes, paramétrage global, accès back-office',
      color: 'border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-purple-900',
      badge: 'bg-purple-600 text-white',
    },
    {
      username: 'resp_atelier',
      password: 'resp123',
      label: 'Responsable Ateliers',
      desc: 'Gestion des ateliers, lignes de fabrication, catalogue & lots',
      color: 'border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-900',
      badge: 'bg-blue-600 text-white',
    },
    {
      username: 'collab_resp',
      password: 'collab123',
      label: 'Collaborateur Responsable',
      desc: 'Gestion des équipes, opérateurs, déclaration incidents & temps d\'arrêt',
      color: 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
    },
    {
      username: 'operateur1',
      password: 'oper123',
      label: 'Opérateur / Stocks',
      desc: 'Machines, maintenances avec décrémentation stock, nomenclatures',
      color: 'border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900',
      badge: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* En-tête de marque */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-950/50">
          <Factory className="w-9 h-9" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Usine de Production
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Système Informatisé de Gestion & Supervision Industrielle (TWIN_3)
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Conformité UML : Cas «include» S'authentifier & RBAC
        </div>
      </div>

      {/* Formulaire de connexion */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700/80">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Identifiant
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin, resp_atelier, operateur1..."
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-150 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Connexion sécurisée en cours...</span>
              ) : (
                <>
                  <span>Ouvrir ma session de travail</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Séparateur pour les profils préconfigurés */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Accès Rapides par Rôle (Soutenance)
              </span>
              <span className="text-[10px] text-cyan-400 font-medium">1 Clic pour tester</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {accounts.map((acc) => {
                const userObj = users.find(u => u.username === acc.username);
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => userObj && handleQuickLogin(userObj, acc.password)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-700/60 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${acc.badge}`}>
                          {acc.label}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {acc.username} / {acc.password}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {acc.desc}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Note de pied de page de conception */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Système 3-Tiers : Django REST Framework 5 &bull; React 18 &bull; PostgreSQL
        </p>
      </div>
    </div>
  );
}

