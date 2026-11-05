@echo off
TITLE Frontend React - Usine TWIN_3
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0frontend"
echo Lancement du serveur Vite React sur http://localhost:5173 ...
call npm.cmd run dev
pause
