@echo off
TITLE Systeme Gestion Usine TWIN_3 - Demarrage
COLOR 0A

echo =====================================================================
echo  SYSTEME DE GESTION INDUSTRIELLE D'USINE DE PRODUCTION (TWIN_3)
echo =====================================================================
echo.
echo  Architecture:
echo    - Backend  : Django 5 REST Framework (http://localhost:8000)
echo    - Frontend : React 18 + Vite (http://localhost:5173)
echo    - RBAC     : Administrateur, Resp. Ateliers, Collab. Resp., Operateur
echo.
echo =====================================================================
echo  Demarrage simultane des deux serveurs...
echo =====================================================================

start "API Django Backend (Port 8000)" cmd /k "cd /d ""%~dp0backend"" && .\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

start "Frontend React Vite (Port 5173)" cmd /k "set ""PATH=C:\Program Files\nodejs;%PATH%"" && cd /d ""%~dp0frontend"" && call npm.cmd run dev"

echo.
echo  [SUCCES] Les 2 serveurs sont lances dans des fenetres separees.
echo.
echo  Acces:
echo    - Application Web React : http://localhost:5173
echo    - API Django REST       : http://localhost:8000/api/
echo    - Administration Django : http://localhost:8000/admin/
echo.
echo  Identifiants de test :
echo    - Administrateur        : admin / admin123
echo    - Resp. Ateliers        : resp_atelier / resp123
echo    - Collab. Responsable   : collab_resp / collab123
echo    - Operateur Production  : operateur1 / oper123
echo.
pause
