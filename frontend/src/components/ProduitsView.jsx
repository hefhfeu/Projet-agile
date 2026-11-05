import React, { useState } from 'react';

export default function ProduitsView({ data, onAddProduit, onUpdateStock }) {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Module 3 : Catalogue des Produits Finis
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Référentiel des articles fabriqués, valorisation unitaire et niveaux de stock disponibles.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition"
        >
          + Enregistrer un Produit
        </button>
      </div>

      {/* Cartes Produits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.produits.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {prod.referenceProduit}
                </span>
                <span className="text-xs text-slate-400">Réf. #{prod.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                {prod.designation}
              </h3>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Prix unitaire</span>
                <span className="text-lg font-bold text-slate-900">
                  {prod.prixVenteUnitaire.toFixed(2)} €
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Stock fini</span>
                <span className={`text-lg font-bold ${prod.quantiteStock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {prod.quantiteStock} unités
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Création Produit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Enregistrer un nouveau produit fini</h3>
            <form onSubmit={handleCreateProduit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Référence Produit</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: MOT-10KW-HD"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Désignation complète</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Ex: Moteur Électrique Haute Puissance 10kW"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prix de vente (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    placeholder="Ex: 1250.00"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock initial</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

