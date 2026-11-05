@echo off
TITLE Backend Django - Usine TWIN_3
cd /d "%~dp0backend"
echo Lancement du serveur Django sur http://127.0.0.1:8000 ...
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
pause
