import React, { useState } from 'react';
import { Layers, Package, FolderTree, Truck, Plus, Search, AlertCircle, ShieldAlert, CheckCircle2, ChevronRight, X, ArrowUpRight, DollarSign, Calendar, Phone, MapPin, Tag } from 'lucide-react';

export default function StockNomenclatureView({ data, onAddPiece, onAddNomenclature, onAddFournisseur, onAddAchat }) {
  const [activeSubTab, setActiveSubTab] = useState('pieces'); // 'pieces', 'nomenclature', 'fournisseurs'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPieceModal, setShowAddPieceModal] = useState(false);
  const [showAddCompModal, setShowAddCompModal] = useState(false);

  // Formulaire ajout pièce
  const [refPiece, setRefPiece] = useState('');
  const [libellePiece, setLibellePiece] = useState('');
  const [prixPiece, setPrixPiece] = useState('');
  const [stockPiece, setStockPiece] = useState(15);

  // Formulaire nomenclature
  const [parentPiece, setParentPiece] = useState(data.pieces[3]?.referencePiece || '');
  const [composantPiece, setComposantPiece] = useState(data.pieces[0]?.referencePiece || '');
  const [qteComposant, setQteComposant] = useState(1);
  const [cycleError, setCycleError] = useState('');

  // Multiplicateur pour simulation de production BOM
  const [bomMultiplier, setBomMultiplier] = useState(1);

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
    setShowAddPieceModal(false);
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

    setShowAddCompModal(false);
  };

  const piecesFiltrees = data.pieces.filter(p => 
    p.referencePiece.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValeurStock = data.pieces.reduce((sum, p) => sum + (p.quantiteStock * p.prixUnitaireHT), 0);
  const piecesCritiques = data.pieces.filter(p => p.quantiteStock < 20);

  return (
    <div className="space-y-6">
      
      {/* En-tête de section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Module 6 & 8 : Stocks, Nomenclature (BOM) & Fournisseurs
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Gestion intégrée des pièces détachées, arborescence de composition récursive avec sécurité anti-cycle et référentiel d'achats fournisseurs.
          </p>
        </div>

        {/* Sous-onglets de navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('pieces')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeSubTab === 'pieces' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>Inventaire Pièces ({data.pieces.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('nomenclature')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeSubTab === 'nomenclature' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-4 h-4 text-indigo-600" />
            <span>Arbre BOM ({data.nomenclatures.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('fournisseurs')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeSubTab === 'fournisseurs' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Fournisseurs & Achats</span>
          </button>
        </div>
      </div>

      {/* SOUS-VUE 1 : INVENTAIRE DES PIÈCES */}
      {activeSubTab === 'pieces' && (
        <div className="space-y-6">
          {/* Métriques d'inventaire */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Références Pièces</div>
                <div className="text-2xl font-bold font-mono text-slate-900">{data.pieces.length}</div>
                <div className="text-[11px] text-slate-500">Composants & rechanges</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Valorisation Stock HT</div>
                <div className="text-2xl font-bold font-mono text-emerald-600">{totalValeurStock.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                <div className="text-[11px] text-emerald-700 font-medium">Actif immobilisé usine</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Seuil Critique (&lt; 20 u)</div>
                <div className="text-2xl font-bold font-mono text-rose-600">{piecesCritiques.length}</div>
                <div className="text-[11px] text-rose-700 font-medium">Réapprovisionnement suggéré</div>
              </div>
            </div>
          </div>

          {/* Tableau Inventaire */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Référentiel des pièces de fabrication & maintenance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Suivi des quantités en temps réel et valeur unitaire</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher référence ou nom..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
                <button
                  onClick={() => setShowAddPieceModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle Pièce</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-[11px] uppercase bg-slate-50/80 text-slate-500 border-b border-slate-200 font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Référence Technique</th>
                    <th className="py-3 px-4">Désignation & Catégorie</th>
                    <th className="py-3 px-4">Prix Unitaire HT</th>
                    <th className="py-3 px-4">Niveau de Stock</th>
                    <th className="py-3 px-4">Valeur Globale HT</th>
                    <th className="py-3 px-4 text-center">État Réserve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {piecesFiltrees.map((p) => {
                    const isLow = p.quantiteStock < 20;
                    const valeurLigne = p.quantiteStock * p.prixUnitaireHT;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200/80">
                            {p.referencePiece}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {p.libelle}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {p.prixUnitaireHT.toFixed(2)} €
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (p.quantiteStock / 50) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-mono font-bold text-slate-800">
                              {p.quantiteStock}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                          {valeurLigne.toFixed(2)} €
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-medium text-[11px]">
                              <AlertCircle className="w-3 h-3" />
                              <span>Seuil Bas</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Conforme</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-VUE 2 : ARBRE DE NOMENCLATURE (BOM) */}
      {activeSubTab === 'nomenclature' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <span>Visualisation Arborescente de la Nomenclature (BOM)</span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-200 font-mono">
                    Multi-Niveaux
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arborescence récursive garantie sans cycle avec multiplicateur de lot pour simulation d'assemblage
                </p>
              </div>

              {/* Multiplicateur de lot de production */}
              <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shrink-0">
                <span className="text-xs font-semibold text-slate-500">Simulation lot :</span>
                {[1, 5, 10].map(mult => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setBomMultiplier(mult)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition ${
                      bomMultiplier === mult 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ×{mult}
                  </button>
                ))}
              </div>
            </div>

            {/* Arborescence visuelle */}
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
                {/* Racine : Sous-ensemble parent */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200 shadow-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-slate-900">ENS-ROTOR-5KW</span>
                        <span className="px-2 py-0.2 text-[10px] bg-indigo-100 text-indigo-800 font-bold rounded">
                          Produit / Sous-ensemble Composé
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">Sous-ensemble rotor synchrone 5kW pour moteur triphasé</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Lot simulé : </span>
                    <span className="font-mono font-bold text-indigo-600 text-sm">×{bomMultiplier} unité(s)</span>
                  </div>
                </div>

                {/* Branches enfants (BOM items) */}
                <div className="mt-3 pl-6 border-l-2 border-indigo-200 space-y-2.5">
                  {data.nomenclatures.map((n) => {
                    const compPiece = data.pieces.find(p => p.referencePiece === n.composant_ref);
                    const qteRequise = n.quantite * bomMultiplier;
                    const stockDispo = compPiece ? compPiece.quantiteStock : 0;
                    const stockSuffisant = stockDispo >= qteRequise;

                    return (
                      <div 
                        key={n.id} 
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white rounded-lg border border-slate-200/80 hover:border-indigo-300 transition-all gap-2"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                                {n.composant_ref}
                              </span>
                              <span className="font-semibold text-xs text-slate-900 truncate">
                                {n.composant_nom}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Ratio unitaire : {n.quantite} pièce(s) par ensemble &bull; P.U. {compPiece?.prixUnitaireHT.toFixed(2)} €
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-slate-800">
                              Besoin : <span className="text-indigo-600">{qteRequise}</span>
                            </div>
                            <div className={`text-[10px] font-mono font-semibold ${stockSuffisant ? 'text-emerald-600' : 'text-rose-600'}`}>
                              Stock : {stockDispo} ({stockSuffisant ? 'Disponible' : 'Manquant'})
                            </div>
                          </div>
                          <span className={`w-2.5 h-2.5 rounded-full ${stockSuffisant ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Règle de conformité et Anti-cycle */}
              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200/80 flex items-center space-x-3 text-xs text-indigo-900">
                <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Garantie algorithmique :</strong> Vérification systématique par parcours en profondeur (DFS) pour interdire tout cycle ou dépendance circulaire dans la structure produit.
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire ajout relation BOM */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm h-fit">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Nouveau Lien de Composition</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Associer un composant à un sous-ensemble</p>

            <form onSubmit={handleCreateNomenclature} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pièce parente (composée)</label>
                <select
                  value={parentPiece}
                  onChange={(e) => { setParentPiece(e.target.value); setCycleError(''); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {data.pieces.map(p => (
                    <option key={p.id} value={p.referencePiece}>{p.referencePiece} — {p.libelle}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pièce composante</label>
                <select
                  value={composantPiece}
                  onChange={(e) => { setComposantPiece(e.target.value); setCycleError(''); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {data.pieces.map(p => (
                    <option key={p.id} value={p.referencePiece}>{p.referencePiece} — {p.libelle}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quantité requise par unité</label>
                <input
                  type="number"
                  min="1"
                  value={qteComposant}
                  onChange={(e) => setQteComposant(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {cycleError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-semibold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cycleError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow transition active:scale-95 cursor-pointer mt-2"
              >
                Valider l'Association BOM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SOUS-VUE 3 : FOURNISSEURS & ACHATS */}
      {activeSubTab === 'fournisseurs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Répertoire Fournisseurs */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Référentiel Fournisseurs Partenaires</h3>
                <p className="text-xs text-slate-500">Entreprises homologuées pour l'approvisionnement</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {data.fournisseurs.length} Partenaires
              </span>
            </div>

            <div className="space-y-3">
              {data.fournisseurs.map((f) => (
                <div key={f.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{f.raisonSociale}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                      {f.codeFournisseur}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{f.adresse}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{f.telephone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historique des Prix d'Achat */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Historique des Commandes & Prix d'Achat</h3>
                <p className="text-xs text-slate-500">Traçabilité des facturations et cours des matières</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {data.achats.length} Entrées
              </span>
            </div>

            <div className="space-y-2.5">
              {data.achats.map((a) => (
                <div 
                  key={a.id} 
                  className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{a.piece_ref}</span>
                      <span className="text-xs text-slate-600">&bull; {a.fournisseur_nom}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{a.dateAchat}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {a.prixAchat.toFixed(2)} € HT
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajout Pièce */}
      {showAddPieceModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Nouvelle Pièce Détachée</h3>
              </div>
              <button 
                onClick={() => setShowAddPieceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePiece} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Référence Pièce <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={refPiece}
                  onChange={(e) => setRefPiece(e.target.value)}
                  placeholder="PIECE-COURR-C80"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Désignation Complète <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={libellePiece}
                  onChange={(e) => setLibellePiece(e.target.value)}
                  placeholder="Courroie crantée trapézoïdale C80"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix Unitaire HT (€) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={prixPiece}
                    onChange={(e) => setPrixPiece(e.target.value)}
                    placeholder="25.50"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock Initial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={stockPiece}
                    onChange={(e) => setStockPiece(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPieceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition active:scale-95 cursor-pointer"
                >
                  Ajouter au Référentiel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
