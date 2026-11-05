# Système Informatisé de Gestion d'une Usine de Production
### Projet TWIN_3 — Génie Logiciel & Méthodes Agiles (2026)

Ce projet implémente l'application web complète de supervision industrielle conformément au **Dossier de Référence de Conception UML & d'Architecture Logicielle**.

---

## 📁 Structure du Projet

```text
├── DOSSIER_DE_REFERENCE.md      # Spécification maîtresse unique et dictionnaire UML
├── standalone_demo.html         # Application React complète exécutable directement dans tout navigateur
├── backend/                     # API REST Django 5 (3-Tiers)
│   ├── config/                  # Configuration globale (settings, URLs, SimpleJWT, CORS)
│   ├── apps/
│   │   ├── authentification/   # CompteUtilisateur (4 rôles RBAC, login JWT, seed_data)
│   │   ├── usine/              # Atelier, LigneProduction, Machine, Collaborateur, Equipe, Operateur
│   │   ├── production/         # Produit, LotProduction, IncidentProduction, TypeIncident
│   │   ├── maintenance/        # Maintenance, ConsommationPiece (décrémentation atomique de stock)
│   │   └── stock_achats/       # Piece, CompositionPiece (BOM récursif anti-cycle), Fournisseur, AchatPiece
│   └── manage.py
└── frontend/                    # Application SPA React.js (Vite + Tailwind CSS)
    ├── src/
    │   ├── api/                 # Client HTTP JWT & magasin de données réactives
    │   ├── components/          # Composants modulaires pour les 8 modules métier
    │   └── App.jsx              # Orchestration des rôles, vues et notifications
    └── package.json
```

---

## 🚀 1. Démonstration Immédiate (Sans installation préalable)

Pour évaluer et faire une démonstration immédiate de l'ensemble des **8 modules** et des **4 profils utilisateurs** sans dépendre de l'installation de Python ou Node.js :

👉 **Double-cliquez simplement sur le fichier :**  
`standalone_demo.html` (ou faites un clic droit $\rightarrow$ *Ouvrir avec* $\rightarrow$ *Chrome / Edge / Firefox*).

Vous pourrez immédiatement :
- Basculer entre les 4 rôles (`Admin`, `Resp. Ateliers`, `Collab. Resp.`, `Opérateur`).
- Créer des ateliers et lignes de fabrication (Module 1).
- Tracer des lots avec ouvriers par matricule (Module 2).
- Gérer le catalogue produits finis et stocks (Module 3).
- Affecter des ouvriers aux équipes (Module 4).
- Déclarer des maintenances avec **décrémentation automatique du stock** (Module 5).
- Consulter la **nomenclature récursive (BOM)** (Module 6 & 8).
- Consigner des incidents avec relevé obligatoire du **temps d'arrêt** (Module 7).

---

## 🐍 2. Démarrage du Backend Django avec PostgreSQL

### Pré-requis :
1. **Python 3.12** (ex: via PowerShell administrateur : `winget install Python.Python.3.12`).
2. **PostgreSQL** (version 14, 15 ou 16 avec pgAdmin ou service actif sur le port 5432).

### Configuration PostgreSQL :
1. Créez la base de données dans pgAdmin ou via la commande SQL :
   ```sql
   CREATE DATABASE usine_db;
   ```
2. Vérifiez ou ajustez les identifiants dans le fichier `backend/.env` :
   ```ini
   DB_NAME=usine_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   ```

```powershell
# 1. Se positionner dans le dossier backend
cd backend

# 2. Créer et activer l'environnement virtuel
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Installer les dépendances (dont le connecteur PostgreSQL psycopg2-binary)
pip install -r requirements.txt

# 4. Appliquer les migrations pour créer les 17 tables dans PostgreSQL
python manage.py makemigrations
python manage.py migrate

# 5. Peupler automatiquement PostgreSQL avec les données et comptes de test
python manage.py seed_data

# 6. Démarrer le serveur de développement
python manage.py runserver 8000
```

### Comptes de démonstration pré-configurés :
| Rôle | Nom d'utilisateur | Mot de passe | Droits |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin` | `admin123` | Accès complet + Back-office Django Admin |
| **Responsable Ateliers** | `resp_atelier` | `resp123` | Ateliers, Lignes, Produits, Lots |
| **Collaborateur Responsable** | `collab_resp` | `collab123` | Équipes, Opérateurs, Incidents & Arrêts |
| **Opérateur / Stocks** | `operateur1` | `oper123` | Machines, Maintenance, Stocks & Nomenclatures |

* **API REST Interactive** : http://127.0.0.1:8000/api/
* **Back-Office d'Administration** : http://127.0.0.1:8000/admin/

---

## ⚡ 3. Démarrage Simplifié en 1 Clic (`demarrer_projet.bat`)

Pour lancer simultanément le backend Django et le frontend React sans saisir de commande dans le terminal :

👉 **Double-cliquez sur le script à la racine :**
```text
demarrer_projet.bat
```
Ce script ouvre automatiquement deux fenêtres de terminal :
1. **Fenêtre 1 (Backend Django)** : API REST sur `http://localhost:8000`
2. **Fenêtre 2 (Frontend React Vite)** : Interface utilisateur sur `http://localhost:5173`

*(Des scripts individuels `lancer_backend.bat` et `lancer_frontend.bat` sont également disponibles).*

---

## 🧪 4. Exécution des Tests Automatisés

Le projet intègre une suite de tests unitaires automatisés validant la conformité des règles métier (détection de cycles récursifs DFS, décrémentation atomique des stocks, sécurité JWT et autorisations RBAC) :

```powershell
cd backend
.\venv\Scripts\python.exe manage.py test
```
*Résultat : 8 tests exécutés avec succès (`OK`).*

