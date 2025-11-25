# 🔄 Guide de Migration - Système d'Authentification

## ✅ Ce qui a été créé

Votre système d'authentification et de reprise automatique est maintenant complet! Voici ce qui a été implémenté:

### 📦 Nouveaux Fichiers

1. **config.py** - Configuration Flask
2. **models.py** - Modèles de base de données (User, Progress)
3. **app_new.py** - Application Flask avec authentification
4. **requirements.txt** - Dépendances Python
5. **templates/auth/login.html** - Page de connexion
6. **templates/auth/register.html** - Page d'inscription
7. **templates/dashboard.html** - Dashboard avec pop-up de reprise
8. **static/js/progress-manager.js** - Gestionnaire de progression
9. **Styles CSS** ajoutés dans main.css

### 🚀 Installation Rapide

#### Étape 1: Installer les dépendances
```bash
pip install -r requirements.txt
```

#### Étape 2: Renommer les fichiers
```bash
# Sauvegarder l'ancien app.py
mv app.py app_old.py

# Utiliser le nouveau
mv app_new.py app.py
```

#### Étape 3: Démarrer le serveur
```bash
python app.py
```

#### Étape 4: Tester
```
http://localhost:5000
```

## 🎯 Fonctionnalités

### 1. Inscription / Connexion
- ✅ Formulaire d'inscription avec validation
- ✅ Connexion sécurisée
- ✅ Sessions persistantes
- ✅ Mots de passe hashés

### 2. Sauvegarde Automatique
- ✅ Sauvegarde à chaque question
- ✅ Debounce (évite trop de requêtes)
- ✅ Sauvegarde avant fermeture
- ✅ Stockage en base de données

### 3. Reprise Automatique
- ✅ Détection de progression
- ✅ Pop-up "Continuer / Recommencer"
- ✅ Redirection intelligente
- ✅ Option de réinitialisation

## 📊 Base de Données

### Structure

**Table users:**
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- phone
- created_at

**Table progress:**
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- current_section ('reading' ou 'listening')
- current_question (numéro de la question)
- answers (JSON des réponses)
- reading_completed (BOOLEAN)
- listening_completed (BOOLEAN)
- test_completed (BOOLEAN)
- updated_at

### Création Automatique
La base de données `conseilux.db` est créée automatiquement au premier lancement.

## 🔌 Intégration dans les Tests

### Pour test.js (Reading)

Ajouter au début du fichier:
```html
<script src="{{ url_for('static', filename='js/progress-manager.js') }}"></script>
```

Ajouter dans le code:
```javascript
// Créer le gestionnaire
const progressManager = new ProgressManager('reading');

// Au chargement, restaurer la progression
async function initWithProgress() {
  const progress = await progressManager.loadProgress();
  
  if (progress && progress.current_section === 'reading') {
    state.index = progress.current_question;
    state.answers = progress.answers;
  }
  
  render();
}

// Appeler au démarrage
initWithProgress();

// Sauvegarder à chaque changement
function goNext(auto=false){
  // ... code existant ...
  
  // Sauvegarder
  progressManager.saveProgressDebounced(state.index, state.answers);
}
```

### Pour listening_new.js (Listening)

Même principe:
```javascript
const progressManager = new ProgressManager('listening');

async function initWithProgress() {
  const progress = await progressManager.loadProgress();
  
  if (progress && progress.current_section === 'listening') {
    state.sectionIndex = progress.current_question;
    state.answers = progress.answers;
  }
  
  render();
}

initWithProgress();

// Sauvegarder à chaque section
function goNext(){
  // ... code existant ...
  
  progressManager.saveProgressDebounced(state.sectionIndex, state.answers);
}
```

## 🧪 Test Complet

### Scénario 1: Nouvel Utilisateur
1. ✅ Aller sur `http://localhost:5000`
2. ✅ Cliquer "Take the Test"
3. ✅ S'inscrire avec email/mot de passe
4. ✅ Arriver sur le dashboard
5. ✅ Cliquer "Start Test"
6. ✅ Commencer le test
7. ✅ Répondre à quelques questions
8. ✅ Fermer le navigateur

### Scénario 2: Reprise
1. ✅ Rouvrir le navigateur
2. ✅ Aller sur `http://localhost:5000`
3. ✅ Se connecter
4. ✅ **Pop-up apparaît**: "Test in Progress"
5. ✅ Cliquer "Continue"
6. ✅ Reprendre exactement où on s'était arrêté

### Scénario 3: Recommencer
1. ✅ Se connecter
2. ✅ Pop-up apparaît
3. ✅ Cliquer "Start Over"
4. ✅ Confirmer
5. ✅ Test recommence à zéro

## 🎨 Personnalisation

### Changer les Couleurs
Dans `main.css`, section "AUTHENTICATION PAGES"

### Modifier le Pop-up
Dans `dashboard.html`, fonction `showResumeModal()`

### Ajouter des Champs
Dans `models.py`, classe `User`

## 🔒 Sécurité

### En Production
1. **Changer SECRET_KEY** dans `config.py`
2. **Utiliser PostgreSQL** au lieu de SQLite
3. **Activer HTTPS**
4. **Ajouter protection CSRF**
5. **Limiter les tentatives de connexion**

### Exemple config.py pour production:
```python
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')  # Variable d'environnement
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')  # PostgreSQL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = True  # HTTPS only
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
```

## 📱 Routes Disponibles

### Publiques
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/about`, `/method`, `/cefr-levels`, `/faq` - Pages info

### Protégées (nécessitent connexion)
- `/dashboard` - Dashboard utilisateur
- `/test` - Test de Reading
- `/listening` - Test de Listening
- `/reading-to-listening` - Transition
- `/resultats` - Résultats
- `/certificate` - Certificat

### API
- `POST /api/save_progress` - Sauvegarder progression
- `GET /api/load_progress` - Charger progression
- `POST /api/reset_progress` - Réinitialiser progression

## 🐛 Dépannage Rapide

### Erreur: "No module named 'flask_sqlalchemy'"
```bash
pip install Flask-SQLAlchemy
```

### Erreur: "No module named 'flask_login'"
```bash
pip install Flask-Login
```

### Base de données corrompue
```bash
rm conseilux.db
python app.py  # Recrée la base
```

### Pop-up ne s'affiche pas
1. Ouvrir DevTools (F12)
2. Onglet Console
3. Vérifier les erreurs JavaScript

## ✨ Avantages du Système

1. **Expérience Utilisateur**
   - Pas besoin de refaire le test
   - Reprise exacte où on s'était arrêté
   - Choix de recommencer si souhaité

2. **Technique**
   - Base de données relationnelle
   - Sauvegarde automatique
   - Code réutilisable
   - API REST propre

3. **Sécurité**
   - Mots de passe hashés
   - Sessions sécurisées
   - Protection des routes
   - Validation des données

## 📞 Checklist de Migration

- [ ] Installer les dépendances (`pip install -r requirements.txt`)
- [ ] Renommer app.py en app_old.py
- [ ] Renommer app_new.py en app.py
- [ ] Démarrer le serveur (`python app.py`)
- [ ] Tester l'inscription
- [ ] Tester la connexion
- [ ] Tester le dashboard
- [ ] Intégrer progress-manager.js dans test.js
- [ ] Intégrer progress-manager.js dans listening_new.js
- [ ] Tester la sauvegarde automatique
- [ ] Tester la reprise
- [ ] Tester le recommencement

## 🎉 Résultat Final

Un système complet d'authentification avec:
- ✅ Inscription/Connexion sécurisée
- ✅ Sauvegarde automatique de progression
- ✅ Reprise intelligente du test
- ✅ Pop-up professionnel
- ✅ Base de données SQLite
- ✅ API REST
- ✅ Design responsive
- ✅ Code propre et documenté

---

**Prêt à utiliser!** 🚀
