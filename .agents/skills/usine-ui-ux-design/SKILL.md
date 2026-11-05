---
name: usine-ui-ux-design
description: >-
  Système de design, charte graphique industrielle moderne et directives UX/UI avancées pour concevoir
  des interfaces attrayantes, élégantes et intuitives pour l'application d'usine.
  Utiliser cette compétence dès que l'utilisateur demande de créer des composants d'interface, d'embellir des écrans,
  de travailler le design visuel, les animations, les dashboards ou l'ergonomie tactile.
---

# Design System & Directives UX/UI — Usine de Production (TWIN_3)

Ce skill définit les standards visuels et ergonomiques pour produire une interface **moderne, attrayante, épurée et haut de gamme** (standard SaaS industriel 2026).

---

## 1. Identité Visuelle & Palette Chromatique

L'esthétique repose sur un style **Industriel Tech Moderne** : fond sobre, cartes contrastées avec ombres subtiles, et accents colorés dynamiques signalant l'état des machines et des lignes.

### Palette de Couleurs (Classes Tailwind)
* **Fond principal & Surfaces** :
  - Mode Clair : `bg-slate-50`, cartes `bg-white`, bordures `border-slate-200`.
  - Mode Sombre (Dark Tech) : `bg-slate-950`, cartes `bg-slate-900/80 border border-slate-800`, effet subtil de translucidité (`backdrop-blur-md`).
* **Couleurs d'Accents Métier** :
  - **Indigo / Bleu Électrique** (`text-indigo-600 bg-indigo-50 border-indigo-200`) : Actions principales, navigation, sélection.
  - **Vert Émeraude** (`text-emerald-600 bg-emerald-500/10 border-emerald-500/20`) : Machine en marche, lot en cours normal, stock optimal.
  - **Orange Ambré** (`text-amber-600 bg-amber-500/10 border-amber-500/20`) : Maintenance en cours, alerte stock faible, avertissement.
  - **Rouge Rubis** (`text-rose-600 bg-rose-500/10 border-rose-500/20`) : Incident déclaré, machine à l'arrêt critique, temps d'arrêt actif.
* **Typographie** :
  - Titres et interface : Police sans-serif moderne, nette et lisible (`Inter`, `Plus Jakarta Sans`).
  - Codes séries, matricules, durées et valeurs numériques : Police monospace (`JetBrains Mono` ou `font-mono`) pour un rendu technique élégant.

---

## 2. Patrons de Composants à Fort Impact Visuel

### A. Cartes d'Indicateurs KPI (Production Stats)
Ne jamais créer de simples boîtes de texte. Privilégier des cartes dynamiques à forte lisibilité :
* Grand chiffre clé (`text-3xl font-bold tracking-tight font-mono`).
* Badge d'état avec pulsation lumineuse (`relative flex h-3 w-3` + `animate-ping`) indiquant une ligne active.
* Icône vectorielle contextuelle stylisée (ex: roue crantée, jauge, boîte de pièces) placée dans un médaillon arrondi doux.
* Barre de progression visuelle pour les quantités en stock ou l'avancement d'un lot.

### B. Synoptique des Lignes de Production (Vue Usine Interactive)
* Représenter chaque atelier comme un conteneur parent regroupant ses lignes de fabrication sous forme de cartes d'état.
* Chaque ligne affiche :
  - Son numéro et son statut en temps réel (🟢 En cours, 🟠 Maintenance, 🔴 Arrêt).
  - Le lot actuellement fabriqué avec le nom du produit et sa jauge de quantité.
  - Le nombre d'opérateurs requis vs affectés (badge comparatif : `4 / 5 requis`).
  - Le bouton d'action contextuelle rapide (`Déclarer un arrêt`, `Voir détails`).

### C. Arborescence de Nomenclature Interactive (BOM Visualizer)
* Visualisation hiérarchique avec lignes de liaison SVG courbes ou connecteurs en pointillés (`border-l-2 border-indigo-200 pl-4`).
* Chaque composant affiche :
  - Son libellé et sa référence technique en badge monospace.
  - La quantité requise pour un exemplaire parent (ex: `× 4`).
  - Un badge de disponibilité du stock en temps réel (vert si stock suffisant, rouge clignotant si rupture).
  - Animation fluide au pliage/dépliage (`transition-all duration-300`).

### D. Formulaire Tactile "Fast-Input" pour Tablettes d'Atelier
* Hauteur minimale des boutons et sélecteurs de `48px` à `56px` (`h-12` ou `h-14`) pour éviter les erreurs de manipulation tactile.
* Sélecteur d'opérateurs sous forme de puces avec avatars ou badges matricules cliquables.
* Pavé tactile ou boutons `+` / `-` pour ajuster rapidement les quantités de pièces consommées sans devoir ouvrir le clavier virtuel de la tablette.

---

## 3. Micro-Interactions & Qualité de Finition (UX Polish)

1. **Skeleton Loaders Shimmer** :
   Toujours remplacer les roues de chargement génériques ("spinners") par des squelettes animés mimant la forme exacte des cartes et tableaux pendant la récupération des données de l'API.
2. **Notifications Toast Modernes (ex: Sonner)** :
   - Toast avec icône animée, titre net et description courte.
   - Possibilité d'annuler une action accidentelle lorsque applicable (ex: « Pièce retirée - *Annuler* »).
3. **Tiroirs Coulissants (Sheet / Slide-over)** :
   Pour déclarer une maintenance ou ajouter un incident sans faire perdre le contexte à l'utilisateur, ouvrir un panneau coulissant latéral plutôt qu'une redirection de page complète.
4. **États Vides Invitants (Empty States)** :
   Lorsqu'un atelier n'a pas encore de lignes ou qu'aucun incident n'est en cours, ne jamais laisser un écran vide : afficher une icône épurée, un message rassurant et un bouton d'action principal bien visible.

---

## 4. Bibliothèque d'Outils UI Recommandée

* **Framework CSS** : `Tailwind CSS 3/4` (classes utilitaires, flexbox/grid avancés).
* **Composants Primitifs Headless** : `Radix UI` ou `Shadcn UI` (accessibilité parfaite, modales, popovers, dropdowns).
* **Icônes** : `lucide-react` (style cohérent, fin et technique).
* **Animations** : `framer-motion` (transitions fluides de cartes, apparitions d'arborescences).
* **Graphiques & Métriques** : `Recharts` (courbes de temps d'arrêt, histogrammes d'incidents par type).

