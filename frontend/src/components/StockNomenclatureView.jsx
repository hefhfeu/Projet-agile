import React, { useState } from 'react';

export default function StockNomenclatureView({ data, onAddPiece, onAddNomenclature, onAddFournisseur, onAddAchat }) {
  const [activeSubTab, setActiveSubTab] = useState('pieces'); // 'pieces', 'nomenclature', 'fournisseurs'

  // Formulaires
  const [refPiece, setRefPiece] = useState('');
  const [libellePiece, setLibellePiece] = useState('');
  const [prixPiece, setPrixPiece] = useState('');
  const [stockPiece, setStockPiece] = useState(10);

  // Formulaire nomenclature
  const [parentPiece, setParentPiece] = useState(data.pieces[3]?.referencePiece || '');
  const [composantPiece, setComposantPiece] = useState(data.pieces[0]?.referencePiece || '');
  const [qteComposant, setQteComposant] = useState(1);
  const [cycleError, setCycleError] = useState('');

  const handleCreatePiece = (e) => {
    e.preventDefault();
    if (!refPiece || !libellePiece) return;
    onAddPiece({
      referencePiece: refPiece.trim().toUpperCase(),
      libelle: libellePiece.trim(),
      prixUnitaireHT: parseFloat(prixPiece) || 0,
      quantiteStock: parseInt(stockPiece, 10) || 0
    });
    setRefPiece('');
    setLibellePiece('');
    setPrixPiece('');
  };

  const handleCreateNomenclature = (e) => {
    e.preventDefault();
    setCycleError('');

    // Règle anti-cycle réflexive immédiate
    if (parentPiece === composantPiece) {
      setCycleError("Cycle interdit ! Une pièce ne peut pas être un composant d'elle-même.");
      return;
    }

    const comp = data.pieces.find(p => p.referencePiece === composantPiece);

    onAddNomenclature({
      parent_ref: parentPiece,
      composant_ref: composantPiece,
      quantite: parseInt(qteComposant, 10),
      composant_nom: comp ? comp.libelle : composantPiece
    });
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 6 & 8 : Pièces Détachées, Nomenclature (BOM) & Achats
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Arbre de nomenclature multi-niveaux avec contrôle anti-cycle récursif et référentiel fournisseurs.
          </p>
        </div>

        {/* Sous-onglets */}
        <div className="mt-3 sm:mt-0 flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('pieces')}
            className={`px-3 py-1.5 rounded-md transition ${activeSubTab === 'pieces' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Pièces ({data.pieces.length})
          </button>
          <button
            onClick={() => setActiveSubTab('nomenclature')}
            className={`px-3 py-1.5 rounded-md transition ${activeSubTab === 'nomenclature' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Arbre BOM ({data.nomenclatures.length})
          </button>
          <button
            onClick={() => setActiveSubTab('fournisseurs')}
            className={`px-3 py-1.5 rounded-md transition ${activeSubTab === 'fournisseurs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Fournisseurs & Achats
          </button>
        </div>
      </div>

      {/* Vue 1 : Stocks Pièces */}
      {activeSubTab === 'pieces' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Référence</th>
                  <th className="py-3 px-4">Désignation</th>
                  <th className="py-3 px-4">Prix HT</th>
                  <th className="py-3 px-4">Stock Actuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.pieces.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.referencePiece}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{p.libelle}</td>
                    <td className="py-3 px-4">{p.prixUnitaireHT.toFixed(2)} €</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${p.quantiteStock < 20 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {p.quantiteStock} unités
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulaire ajout pièce */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">+ Nouvelle pièce détachée</h3>
            <form onSubmit={handleCreatePiece} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Référence pièce</label>
                <input
                  type="text"
                  value={refPiece}
                  onChange={(e) => setRefPiece(e.target.value)}
                  placeholder="Ex: PIECE-COURR-C80"
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Libellé</label>
                <input
                  type="text"
                  value={libellePiece}
                  onChange={(e) => setLibellePiece(e.target.value)}
                  placeholder="Ex: Courroie crantée trapézoïdale"
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Prix HT (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prixPiece}
                    onChange={(e) => setPrixPiece(e.target.value)}
                    placeholder="25.50"
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Stock</label>
                  <input
                    type="number"
                    value={stockPiece}
                    onChange={(e) => setStockPiece(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded text-xs font-semibold shadow mt-2"
              >
                Ajouter au Référentiel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Vue 2 : Arbre de Nomenclature (BOM) */}
      {activeSubTab === 'nomenclature' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Visualisation Arborescente de la Nomenclature (BOM)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Représentation interactive de l'assemblage récursif des sous-ensembles et composants.
            </p>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 font-mono text-sm">
              <div className="p-3 bg-white border border-blue-200 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 text-blue-900 font-bold">
                  <span>📦</span>
                  <span>ENS-ROTOR-5KW</span>
                  <span className="text-xs font-sans text-slate-500 font-normal">(Sous-ensemble Rotor 5kW)</span>
                </div>
                
                {/* Branches enfants */}
                <div className="mt-3 pl-6 border-l-2 border-blue-300 space-y-2">
                  {data.nomenclatures.map((n) => (
                    <div key={n.id} className="flex items-center justify-between text-xs font-sans p-2 bg-slate-50 rounded border border-slate-200">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-700">{n.quantite}x</span>
                        <span className="font-mono text-blue-700">{n.composant_ref}</span>
                        <span className="text-slate-600">— {n.composant_nom}</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        Composant direct
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* Formulaire ajout relation BOM */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">+ Nouveau Lien de Composition</h3>
            <form onSubmit={handleCreateNomenclature} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pièce parente (composée)</label>
                <select
                  value={parentPiece}
                  onChange={(e) => { setParentPiece(e.target.value); setCycleError(''); }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none"
                >
                  {data.pieces.map(p => (
                    <option key={p.id} value={p.referencePiece}>{p.referencePiece} - {p.libelle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pièce composante</label>
                <select
                  value={composantPiece}
                  onChange={(e) => { setComposantPiece(e.target.value); setCycleError(''); }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none"
                >
                  {data.pieces.map(p => (
                    <option key={p.id} value={p.referencePiece}>{p.referencePiece} - {p.libelle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre d'exemplaires</label>
                <input
                  type="number"
                  min="1"
                  value={qteComposant}
                  onChange={(e) => setQteComposant(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none"
                />
              </div>

              {cycleError && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded font-medium">
                  ⚠️ {cycleError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow mt-2"
              >
                Valider la Composition
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Vue 3 : Fournisseurs & Achats */}
      {activeSubTab === 'fournisseurs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Référentiel Fournisseurs</h3>
            <div className="space-y-3">
              {data.fournisseurs.map((f) => (
                <div key={f.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{f.raisonSociale}</span>
                    <span className="font-mono text-xs text-blue-700">{f.codeFournisseur}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">📍 {f.adresse} &bull; 📞 {f.telephone}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Historique des Prix & Dates d'Achat</h3>
            <div className="space-y-2.5">
              {data.achats.map((a) => (
                <div key={a.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-slate-800">{a.piece_ref}</div>
                    <div className="text-slate-500">{a.fournisseur_nom} &bull; {a.dateAchat}</div>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">{a.prixAchat.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

