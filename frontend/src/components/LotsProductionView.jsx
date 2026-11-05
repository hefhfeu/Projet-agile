import React, { useState } from 'react';
import { Boxes, Plus, Search, Filter, Users, CheckCircle2, AlertTriangle, Calendar, X, Tag } from 'lucide-react';

export default function LotsProductionView({ data, onAddLot }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLigne, setFilterLigne] = useState('ALL');

  const [nouveauNumLot, setNouveauNumLot] = useState('');
  const [ligneSelectionnee, setLigneSelectionnee] = useState(data.lignes[0]?.numeroLigne || 101);
  const [produitSelectionne, setProduitSelectionne] = useState(data.produits[0]?.referenceProduit || '');
  const [ouvriersSelectionnes, setOuvriersSelectionnes] = useState([]);

  const toggleOuvrier = (matricule) => {
    if (ouvriersSelectionnes.includes(matricule)) {
      setOuvriersSelectionnes(ouvriersSelectionnes.filter(m => m !== matricule));
    } else {
      setOuvriersSelectionnes([...ouvriersSelectionnes, matricule]);
    }
  };

  const handleCreateLot = (e) => {
    e.preventDefault();
    if (!nouveauNumLot || ouvriersSelectionnes.length === 0) return;

    const prod = data.produits.find(p => p.referenceProduit === produitSelectionne);

    onAddLot({
      idLot: parseInt(nouveauNumLot, 10),
      dateProduction: new Date().toISOString().split('T')[0],
      ligne_numero: parseInt(ligneSelectionnee, 10),
      produit_ref: produitSelectionne,
      produit_nom: prod ? prod.designation : produitSelectionne,
      operateurs: ouvriersSelectionnes.map(m => {
        const op = data.operateurs.find(o => o.matricule === m);
        return op ? `${op.matricule} (${op.prenom} ${op.nom})` : m;
      }),
      nb_incidents: 0
    });

    setNouveauNumLot('');
    setOuvriersSelectionnes([]);
    setShowModal(false);
  };

  const lotsFiltres = data.lots.filter(lot => {
    const matchSearch = lot.idLot.toString().includes(searchTerm) ||
      lot.produit_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.produit_nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLigne = filterLigne === 'ALL' || lot.ligne_numero.toString() === filterLigne;
    return matchSearch && matchLigne;
  });

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Module 2 : Traçabilité des Lots de Fabrication
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              TRAÇABILITÉ &bull; M2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Traçabilité intégrale : chaque lot est lié à sa ligne, son produit fini et la liste nominative des ouvriers par matricule.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Lancer un Nouveau Lot</span>
        </button>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N° lot, référence produit..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterLigne}
            onChange={(e) => setFilterLigne(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="ALL">Toutes les lignes</option>
            {data.lignes.map(l => (
              <option key={l.id} value={l.numeroLigne.toString()}>Ligne #{l.numeroLigne}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau Data-Dense des Lots */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="text-[10px] uppercase tracking-wider font-mono bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">N° Lot</th>
                <th className="py-3 px-4 font-bold">Date de Fabrication</th>
                <th className="py-3 px-4 font-bold">Ligne</th>
                <th className="py-3 px-4 font-bold">Produit Fabriqué</th>
                <th className="py-3 px-4 font-bold">Ouvriers ayant œuvré sur le lot</th>
                <th className="py-3 px-4 font-bold">Contrôle Qualité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lotsFiltres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                    Aucun lot de fabrication ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                lotsFiltres.map((lot) => (
                  <tr key={lot.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      #{lot.idLot}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lot.dateProduction}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                        Ligne {lot.ligne_numero}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold font-mono text-slate-900">{lot.produit_ref}</div>
                      <div className="text-[11px] text-slate-500">{lot.produit_nom}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {lot.operateurs?.map((op, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono rounded-md border border-slate-200">
                            <Users className="w-2.5 h-2.5 text-slate-500" />
                            <span>{op}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {lot.nb_incidents > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>{lot.nb_incidents} incident(s)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Conforme (RAS)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Lot */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-cyan-600" />
                <span>Lancer un Ordre de Fabrication (Lot)</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Numéro de Lot
                  </label>
                  <input
                    type="number"
                    value={nouveauNumLot}
                    onChange={(e) => setNouveauNumLot(e.target.value)}
                    placeholder="Ex: 1004"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Ligne de Fabrication
                  </label>
                  <select
                    value={ligneSelectionnee}
                    onChange={(e) => setLigneSelectionnee(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition"
                  >
                    {data.lignes.map(l => (
                      <option key={l.id} value={l.numeroLigne}>Ligne #{l.numeroLigne}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Produit Fini à Assembler
                </label>
                <select
                  value={produitSelectionne}
                  onChange={(e) => setProduitSelectionne(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition"
                >
                  {data.produits.map(p => (
                    <option key={p.id} value={p.referenceProduit}>
                      {p.referenceProduit} — {p.designation} ({p.prixVenteUnitaire} €)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sélection nominative des ouvriers par matricule (Règle Métier 2) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Ouvriers Affectés au Lot (Matricules)
                  </label>
                  <span className="text-[11px] text-cyan-600 font-mono font-bold">
                    {ouvriersSelectionnes.length} sélectionné(s)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {data.operateurs.map((op) => {
                    const isChecked = ouvriersSelectionnes.includes(op.matricule);
                    return (
                      <button
                        type="button"
                        key={op.id}
                        onClick={() => toggleOuvrier(op.matricule)}
                        className={`cursor-pointer p-2 rounded-lg text-left text-xs border transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-cyan-50 border-cyan-300 text-cyan-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="font-mono text-[11px]">{op.matricule}</div>
                          <div className="text-[10px] text-slate-500">{op.prenom} {op.nom}</div>
                        </div>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={ouvriersSelectionnes.length === 0}
                  className="cursor-pointer px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Lancer la fabrication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
