import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, Calendar, Search, Filter, Hash, UserCheck, X, Briefcase, Plus } from 'lucide-react';

export default function EquipesOperateursView({ data, onAddOperateur, onAddEquipe }) {
  const [showOpModal, setShowOpModal] = useState(false);
  const [showEqModal, setShowEqModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipeFilter, setSelectedEquipeFilter] = useState('ALL');

  // Formulaire opérateur
  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [equipeId, setEquipeId] = useState(data.equipes[0]?.id || 1);

  // Formulaire équipe
  const [numEquipe, setNumEquipe] = useState('');
  const [libelleEquipe, setLibelleEquipe] = useState('');
  const [responsableNom, setResponsableNom] = useState('Jean Dupont');

  const handleCreateOperateur = (e) => {
    e.preventDefault();
    if (!matricule || !nom || !prenom) return;

    const eq = data.equipes.find(e => e.id === parseInt(equipeId, 10));

    onAddOperateur({
      matricule: matricule.trim().toUpperCase(),
      nom: nom.trim(),
      prenom: prenom.trim(),
      dateEntree: new Date().toISOString().split('T')[0],
      equipe_id: parseInt(equipeId, 10),
      equipe_libelle: eq ? eq.libelle : "Équipe"
    });

    setMatricule('');
    setNom('');
    setPrenom('');
    setShowOpModal(false);
  };

  const handleCreateEquipe = (e) => {
    e.preventDefault();
    if (!numEquipe || !libelleEquipe) return;

    onAddEquipe({
      numeroEquipe: parseInt(numEquipe, 10),
      libelle: libelleEquipe.trim(),
      responsable_nom: responsableNom.trim() || "Jean Dupont",
      effectif: 0
    });

    setNumEquipe('');
    setLibelleEquipe('');
    setShowEqModal(false);
  };

  const operateursFiltres = data.operateurs.filter(op => {
    const matchSearch = op.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEquipe = selectedEquipeFilter === 'ALL' || op.equipe_id.toString() === selectedEquipeFilter;
    return matchSearch && matchEquipe;
  });

  return (
    <div className="space-y-6">
      
      {/* En-tête de section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Module 4 : Personnel & Organisation des Équipes
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Affectation stricte des opérateurs d'usine : un ouvrier appartient à une unique équipe supervisée par un collaborateur responsable désigné.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowEqModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-semibold shadow-sm transition-all hover:border-slate-400 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>Nouvelle Équipe</span>
          </button>
          <button
            onClick={() => setShowOpModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajouter un Opérateur</span>
          </button>
        </div>
      </div>

      {/* Cartes métriques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Ouvriers</div>
            <div className="text-2xl font-bold font-mono text-slate-900">{data.operateurs.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium">100% qualifiés & habilités</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Équipes de Quart</div>
            <div className="text-2xl font-bold font-mono text-slate-900">{data.equipes.length}</div>
            <div className="text-[11px] text-slate-500">Postes rotatifs 3×8</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Encadrement</div>
            <div className="text-2xl font-bold font-mono text-slate-900">{data.equipes.length}</div>
            <div className="text-[11px] text-amber-700 font-medium">Responsables assignés</div>
          </div>
        </div>
      </div>

      {/* Grille des Équipes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Équipes de production constituées</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono font-medium">
              {data.equipes.length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.equipes.map((equipe) => {
            const membres = data.operateurs.filter(op => op.equipe_id === equipe.id);
            return (
              <div 
                key={equipe.id} 
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Header de la carte */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-xs font-bold font-mono">
                        <Hash className="w-3 h-3" />
                        <span>Équipe #{equipe.numeroEquipe}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{equipe.libelle}</h4>
                    </div>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold text-xs rounded-full border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{membres.length} ouvrier(s)</span>
                    </span>
                  </div>

                  {/* Superviseur */}
                  <div className="mt-4 p-3 bg-slate-50/80 rounded-lg border border-slate-200/60 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {equipe.responsable_nom.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="truncate">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Superviseur d'équipe</div>
                      <div className="text-xs font-bold text-slate-800 truncate">{equipe.responsable_nom}</div>
                    </div>
                  </div>

                  {/* Liste des membres */}
                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Membres affectés</span>
                      <span className="font-mono text-slate-500">{membres.length}</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {membres.map((op) => (
                        <div 
                          key={op.matricule} 
                          className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100/80 rounded-lg text-xs border border-slate-200/50 transition-colors"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded shrink-0">
                              {op.matricule}
                            </span>
                            <span className="font-semibold text-slate-800 truncate">
                              {op.prenom} {op.nom}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                            {op.dateEntree}
                          </span>
                        </div>
                      ))}
                      {membres.length === 0 && (
                        <div className="text-center py-4 text-xs text-slate-400 italic">
                          Aucun opérateur rattaché pour l'instant
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Statut : Opérationnelle</span>
                  </span>
                  <button 
                    onClick={() => { setEquipeId(equipe.id); setShowOpModal(true); }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline cursor-pointer"
                  >
                    + Affecter un ouvrier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registre Exhaustif des Opérateurs */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Registre général du personnel d'usine</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fiches individuelles et historique d'embauche</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Recherche */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher ouvrier..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Filtre par équipe */}
            <div className="relative w-full sm:w-44">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedEquipeFilter}
                onChange={(e) => setSelectedEquipeFilter(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer"
              >
                <option value="ALL">Toutes les équipes</option>
                {data.equipes.map(eq => (
                  <option key={eq.id} value={eq.id.toString()}>
                    Équipe {eq.numeroEquipe} ({eq.libelle.substring(0, 15)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Identité de l'Ouvrier</th>
                <th className="py-3 px-4">Équipe d'Affectation</th>
                <th className="py-3 px-4">Date d'Embauche</th>
                <th className="py-3 px-4 text-center">Habilitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {operateursFiltres.map((op) => {
                const eq = data.equipes.find(e => e.id === op.equipe_id);
                return (
                  <tr key={op.matricule} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200/80">
                        {op.matricule}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {op.prenom[0]}{op.nom[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{op.prenom} {op.nom}</div>
                          <div className="text-[10px] text-slate-400">Opérateur Spécialisé</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {eq ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md font-semibold">
                          <Users className="w-3 h-3" />
                          <span>Équipe {eq.numeroEquipe} - {eq.libelle}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Non rattaché</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <span className="inline-flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{op.dateEntree}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium text-[11px]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Validée</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {operateursFiltres.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Aucun ouvrier ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajouter Opérateur */}
      {showOpModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Enrôler un Nouvel Opérateur</h3>
              </div>
              <button 
                onClick={() => setShowOpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOperateur} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matricule Unique <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="OP-005"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase font-mono bg-slate-50/50"
                />
                <p className="text-[11px] text-slate-400 mt-1">Identifiant d'usine unique au format OP-XXX</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prénom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Thomas"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Lemoine"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Équipe de Rattachement <span className="text-rose-500">*</span>
                </label>
                <select
                  value={equipeId}
                  onChange={(e) => setEquipeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
                >
                  {data.equipes.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      Équipe #{eq.numeroEquipe} — {eq.libelle} (Resp. {eq.responsable_nom})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Conformément aux règles de gestion, l'affectation est exclusive.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOpModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow transition active:scale-95 cursor-pointer"
                >
                  Confirmer l'Ajout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer Équipe */}
      {showEqModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Constituer une Nouvelle Équipe</h3>
              </div>
              <button 
                onClick={() => setShowEqModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEquipe} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro d'Équipe <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={numEquipe}
                  onChange={(e) => setNumEquipe(e.target.value)}
                  placeholder="3"
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Libellé du Quart / Brigade <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={libelleEquipe}
                  onChange={(e) => setLibelleEquipe(e.target.value)}
                  placeholder="Équipe Gamma (Nuit)"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collaborateur Responsable Assigné <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={responsableNom}
                  onChange={(e) => setResponsableNom(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Superviseur hiérarchique habilité</p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEqModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-slate-900 hover:bg-black text-white rounded-lg font-semibold shadow transition active:scale-95 cursor-pointer"
                >
                  Créer l'Équipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
