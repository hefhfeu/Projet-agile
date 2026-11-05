import React, { useState } from 'react';
import { Tag, Plus, Search, Layers, Box, CheckCircle2, X, TrendingUp } from 'lucide-react';

export default function ProduitsView({ data, onAddProduit, onUpdateStock }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [reference, setReference] = useState('');
  const [designation, setDesignation] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState(0);

  const handleCreateProduit = (e) => {
    e.preventDefault();
    if (!reference || !designation || !prix) return;
    onAddProduit({
      referenceProduit: reference.trim().toUpperCase(),
      designation: designation.trim(),
      prixVenteUnitaire: parseFloat(prix),
      quantiteStock: parseInt(stock, 10) || 0
    });
    setReference('');
    setDesignation('');
    setPrix('');
    setStock(0);
    setShowModal(false);
  };

  const produitsFiltres = data.produits.filter(p =>
    p.referenceProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValeurStock = data.produits.reduce((acc, p) => acc + (p.prixVenteUnitaire * p.quantiteStock), 0);

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Module 3 : Catalogue des Produits Finis
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
              CATALOGUE &bull; M3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Référentiel des articles fabriqués, prix de vente unitaire HT et valorisation des stocks finis.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className="text-slate-500">Valeur stock total :</span>
            <span className="font-bold text-slate-900">{totalValeurStock.toLocaleString('fr-FR')} €</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer un Produit</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par référence produit (ex: MOT-5KW), désignation..."
          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-none transition"
        />
      </div>

      {/* Grille des Cartes Produits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {produitsFiltres.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          produitsFiltres.map((prod) => {
            const niveauPourcent = Math.min(100, Math.round((prod.quantiteStock / 80) * 100));
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 bg-sky-50 text-sky-800 rounded-lg border border-sky-200">
                      {prod.referenceProduit}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">ID: #{prod.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
                    {prod.designation}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Prix Vente Unitaire :</span>
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {parseFloat(prod.prixVenteUnitaire).toFixed(2)} €
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Box className="w-3.5 h-3.5 text-slate-400" />
                      <span>Stock magasin :</span>
                    </span>
                    <span className={`font-bold ${prod.quantiteStock > 15 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {prod.quantiteStock} unité(s)
                    </span>
                  </div>

                  {/* Barre de progression de stock */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        prod.quantiteStock > 30
                          ? 'bg-emerald-500'
                          : prod.quantiteStock > 15
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${niveauPourcent}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal Créer Produit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-600" />
                <span>Enregistrer un Produit au Catalogue</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Référence Produit (Code unique)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: POMPE-HYDR-200"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Désignation commerciale
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Ex: Pompe hydraulique haute pression 200 bars"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Prix de Vente HT (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    placeholder="Ex: 850.00"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Stock Initial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition"
                  />
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
                  className="cursor-pointer px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Créer le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
