@echo off
echo ========================================
echo  Conseilux Test - Mode Developpement
echo ========================================
echo.

REM Activer l'environnement virtuel
if exist "venv\Scripts\activate.bat" (
    echo Activation de l'environnement virtuel...
    call venv\Scripts\activate.bat
) else (
    echo ATTENTION: Environnement virtuel introuvable!
    echo Creation de l'environnement virtuel...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installation des dependances...
    pip install -r requirements.txt
)

echo.
echo Lancement de l'application Flask en mode DEBUG...
echo.
echo L'application sera accessible sur: http://localhost:5000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

REM Lancer l'application
python app.py

pause

