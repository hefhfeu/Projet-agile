-- ==============================================================================
-- Script SQL d'initialisation de la base PostgreSQL pour l'Usine TWIN_3
-- À exécuter dans pgAdmin ou via psql : psql -U postgres -f init_database.sql
-- ==============================================================================

-- 1. Création de la base de données (si elle n'existe pas)
SELECT 'CREATE DATABASE usine_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'usine_db')\gexec

-- 2. Connexion à la base usine_db
\c usine_db;

-- 3. Encodage et paramètres régionaux
SET client_encoding = 'UTF8';
SET timezone = 'UTC';

-- Les 17 tables avec leurs contraintes de clés primaires, clés étrangères,
-- intégrité référentielle et index seront automatiquement créées par Django :
-- python manage.py migrate

