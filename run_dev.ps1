# Script PowerShell pour lancer l'application en mode développement
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Conseilux Test - Mode Developpement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Activer l'environnement virtuel
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activation de l'environnement virtuel..." -ForegroundColor Green
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "ATTENTION: Environnement virtuel introuvable!" -ForegroundColor Yellow
    Write-Host "Creation de l'environnement virtuel..." -ForegroundColor Yellow
    python -m venv venv
    & "venv\Scripts\Activate.ps1"
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

Write-Host ""
Write-Host "Lancement de l'application Flask en mode DEBUG..." -ForegroundColor Green
Write-Host ""
Write-Host "L'application sera accessible sur: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter le serveur" -ForegroundColor Yellow
Write-Host ""

# Lancer l'application
python app.py

