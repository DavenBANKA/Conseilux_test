# 📜 Guide Complet du Système de Certificats PDF

## 🎯 Vue d'ensemble

Ce système génère des **certificats PDF professionnels** pour les utilisateurs ayant terminé le test d'anglais. Les certificats sont :
- ✅ 100% générés en Python avec ReportLab
- ✅ Format A4 professionnel
- ✅ Personnalisés avec le nom de l'utilisateur
- ✅ Affichent le niveau CEFR obtenu
- ✅ Téléchargeables immédiatement

---

## 📁 Structure des fichiers

```
├── pdf_certificate_generator.py    # Générateur de PDF (logique métier)
├── app_certificate.py              # Application Flask complète
├── models.py                       # Modèles SQLAlchemy (User, Progress)
├── config.py                       # Configuration Flask
├── test_pdf_generation.py          # Tests unitaires
├── templates/
│   └── certificate_download.html   # Page de téléchargement
└── certificates/                   # Dossier de sortie (créé automatiquement)
```

---

## 🚀 Installation et Configuration

### 1. Dépendances

Vérifiez que `requirements.txt` contient :

```txt
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-Login==0.6.3
Werkzeug==3.0.1
reportlab==4.0.7
```

Installez les dépendances :

```bash
pip install -r requirements.txt
```

### 2. Initialisation de la base de données

```bash
# Créer les tables
flask --app app_certificate init-db

# Créer un utilisateur de test
flask --app app_certificate create-test-user
```

### 3. Lancement de l'application

```bash
python app_certificate.py
```

L'application sera accessible sur `http://localhost:5000`

---

## 🧪 Tests

### Test rapide sans Flask

Exécutez le script de test pour générer des certificats d'exemple :

```bash
python test_pdf_generation.py
```

Cela créera plusieurs certificats PDF dans les dossiers `certificates/` et `test_certificates/`.

### Test avec l'application Flask

1. Connectez-vous avec l'utilisateur de test :
   - Email: `test@example.com`
   - Mot de passe: `password123`

2. Accédez à `/generate_certificate`

3. Le PDF se téléchargera automatiquement

---

## 💻 Utilisation dans votre code

### Génération simple d'un certificat

```python
from pdf_certificate_generator import create_user_certificate

# Générer un certificat
pdf_path = create_user_certificate(
    full_name="Jean Dupont",
    level="B2"
)

print(f"Certificat créé : {pdf_path}")
```

### Génération avancée avec options

```python
from pdf_certificate_generator import CertificateGenerator
from datetime import datetime

generator = CertificateGenerator()

generator.generate_certificate(
    output_path="mon_certificat.pdf",
    full_name="Marie Martin",
    level="C1",
    completion_date=datetime(2025, 11, 25)
)
```

### Intégration dans une route Flask

```python
from flask import send_file
from flask_login import login_required, current_user
from pdf_certificate_generator import create_user_certificate

@app.route('/download_certificate')
@login_required
def download_certificate():
    # Générer le certificat
    pdf_path = create_user_certificate(
        full_name=current_user.full_name,
        level="B2"  # Récupérez le vrai niveau depuis votre logique
    )
    
    # Envoyer le fichier
    return send_file(
        pdf_path,
        mimetype='application/pdf',
        as_attachment=True,
        download_name='certificate.pdf'
    )
```

---

## 🎨 Personnalisation du design

### Modifier les couleurs

Dans `pdf_certificate_generator.py`, modifiez les couleurs HEX :

```python
# Cadre principal (actuellement bleu foncé)
c.setStrokeColor(colors.HexColor('#1e3a8a'))

# Accents dorés
c.setStrokeColor(colors.HexColor('#d4af37'))

# Niveau (actuellement vert)
c.setFillColor(colors.HexColor('#059669'))
```

### Ajouter un logo

Le système cherche automatiquement un logo dans :
```
images/logo conseilux english.png
```

Pour utiliser un autre logo, modifiez la méthode `_draw_header()` :

```python
logo_path = os.path.join('images', 'votre_logo.png')
```

### Modifier la mise en page

Chaque section du certificat est dans une méthode séparée :

- `_draw_border()` : Cadre et bordures
- `_draw_header()` : Logo et en-tête
- `_draw_title()` : Titre principal
- `_draw_recipient()` : Nom de l'utilisateur
- `_draw_achievement()` : Niveau CEFR
- `_draw_date()` : Date d'obtention
- `_draw_footer()` : Signature et mentions légales

---

## 🔧 Configuration avancée

### Changer le format de page

```python
from reportlab.lib.pagesizes import letter, A4

# Format Letter (US)
generator = CertificateGenerator(page_size=letter)

# Format A4 (Europe)
generator = CertificateGenerator(page_size=A4)
```

### Personnaliser le nom de fichier

```python
# Dans app_certificate.py, modifiez la route :
return send_file(
    pdf_path,
    mimetype='application/pdf',
    as_attachment=True,
    download_name=f'Certificate_{current_user.full_name}_{level}.pdf'
)
```

### Ajouter des polices personnalisées

```python
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Enregistrer une police
pdfmetrics.registerFont(TTFont('MaPolice', 'chemin/vers/police.ttf'))

# Utiliser la police
c.setFont("MaPolice", 24)
```

---

## 📊 Calcul du niveau CEFR

La fonction `calculate_cefr_level()` dans `app_certificate.py` détermine le niveau basé sur les réponses.

**Exemple actuel (à adapter) :**

```python
def calculate_cefr_level(answers):
    correct_count = sum(1 for a in answers.values() if a.get('correct'))
    total = len(answers)
    score = (correct_count / total) * 100
    
    if score >= 90: return "C2"
    elif score >= 80: return "C1"
    elif score >= 70: return "B2"
    elif score >= 60: return "B1"
    elif score >= 50: return "A2"
    else: return "A1"
```

**Adaptez cette logique selon vos critères !**

---

## 🔒 Sécurité

### Vérifications importantes

1. **Authentification requise** : La route utilise `@login_required`
2. **Validation du test** : Vérifie que `progress.test_completed == True`
3. **Noms de fichiers sécurisés** : Supprime les caractères dangereux

### Recommandations

- Limitez le nombre de téléchargements par utilisateur
- Ajoutez un watermark avec un ID unique
- Stockez les certificats générés pour éviter la régénération

---

## 🐛 Dépannage

### Le PDF ne se génère pas

```bash
# Vérifiez que ReportLab est installé
pip show reportlab

# Testez la génération manuelle
python test_pdf_generation.py
```

### Erreur "Permission denied"

Le dossier `certificates/` n'est pas accessible en écriture :

```bash
mkdir certificates
chmod 755 certificates
```

### Le logo ne s'affiche pas

Vérifiez que le fichier existe :

```python
import os
logo_path = 'images/logo conseilux english.png'
print(os.path.exists(logo_path))
```

### Caractères spéciaux mal affichés

ReportLab utilise des polices standard. Pour les caractères Unicode :

```python
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Utilisez une police Unicode
pdfmetrics.registerFont(TTFont('Unicode', 'DejaVuSans.ttf'))
c.setFont("Unicode", 12)
```

---

## 📝 Exemple complet d'intégration

### 1. Bouton dans le template

```html
<!-- Dans templates/results.html -->
{% if progress.test_completed %}
<div class="text-center mt-8">
    <a href="{{ url_for('generate_certificate') }}" 
       class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        📜 Télécharger mon certificat
    </a>
</div>
{% endif %}
```

### 2. Route Flask

```python
@app.route('/generate_certificate')
@login_required
def generate_certificate():
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    
    if not progress or not progress.test_completed:
        flash('Terminez d\'abord le test !', 'warning')
        return redirect(url_for('test'))
    
    level = calculate_cefr_level(progress.get_answers())
    
    pdf_path = create_user_certificate(
        full_name=current_user.full_name,
        level=level
    )
    
    return send_file(pdf_path, as_attachment=True)
```

### 3. Modèle User

```python
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
```

---

## ✅ Checklist de déploiement

- [ ] ReportLab installé
- [ ] Dossier `certificates/` créé avec permissions d'écriture
- [ ] Logo placé dans `images/` (optionnel)
- [ ] Base de données initialisée
- [ ] Tests passés avec succès
- [ ] Route `/generate_certificate` accessible
- [ ] Authentification fonctionnelle
- [ ] Logique de calcul du niveau CEFR adaptée

---

## 🎉 Résultat final

Vos utilisateurs peuvent maintenant :

1. ✅ S'inscrire et se connecter
2. ✅ Passer le test d'anglais
3. ✅ Voir leurs résultats
4. ✅ **Télécharger un certificat PDF professionnel personnalisé**

Le certificat contient :
- Leur nom complet
- Le niveau CEFR obtenu
- La date d'obtention
- Un design professionnel avec cadre et couleurs

---

## 📞 Support

Pour toute question ou personnalisation, référez-vous aux fichiers :
- `pdf_certificate_generator.py` : Logique de génération
- `app_certificate.py` : Intégration Flask
- `test_pdf_generation.py` : Exemples de tests

**Bon développement ! 🚀**
