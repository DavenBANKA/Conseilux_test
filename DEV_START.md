# 🚀 Guide de Démarrage en Mode Développement

## Démarrage Rapide

### Option 1 : Script Batch (Windows)
```bash
run_dev.bat
```

### Option 2 : Script PowerShell (Windows)
```powershell
.\run_dev.ps1
```

### Option 3 : Manuellement

1. **Activer l'environnement virtuel** :
```powershell
# PowerShell
.\venv\Scripts\Activate.ps1

# Ou CMD
venv\Scripts\activate.bat
```

2. **Lancer l'application** :
```bash
python app.py
```

## Configuration

L'application est configurée pour :
- ✅ **Mode DEBUG activé** : Rechargement automatique à chaque modification
- ✅ **Port** : 5000 (par défaut)
- ✅ **Host** : 0.0.0.0 (accessible depuis le réseau local)

## Accès à l'Application

Une fois lancée, l'application sera accessible sur :
- **Local** : http://localhost:5000
- **Réseau** : http://VOTRE_IP:5000

## Fonctionnalités Disponibles

- 🏠 Page d'accueil
- 📝 Test de lecture (90 questions)
- 🎧 Test d'écoute (26 questions)
- 📊 Page de résultats
- 🏆 **Certificat Premium PDF** (nouveau!)
  - Téléchargement direct depuis la page de résultats
  - Format PDF professionnel avec WeasyPrint

## Dépannage

### Erreur : "Module not found"
```bash
pip install -r requirements.txt
```

### Erreur : "Port already in use"
Changez le port dans `app.py` :
```python
port = int(os.environ.get('PORT', 5001))  # Utilisez un autre port
```

### Erreur WeasyPrint
Si vous avez des problèmes avec WeasyPrint, consultez :
- `CERTIFICAT_PREMIUM_WEASYPRINT.md` pour les dépendances système

## Arrêter l'Application

Appuyez sur **Ctrl+C** dans le terminal

