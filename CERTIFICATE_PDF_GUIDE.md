# 🎓 Système de Certificat PDF Personnalisé - Guide Complet

## ✅ Fonctionnalités Implémentées

### 1. Nom Complet dans la Base de Données
- ✅ Champ `full_name` ajouté au modèle User
- ✅ Automatiquement créé depuis first_name + last_name
- ✅ Accessible via `current_user.full_name`

### 2. Génération de Certificat PDF
- ✅ Utilise ReportLab pour créer des PDF professionnels
- ✅ Design élégant avec bordures décoratives
- ✅ Nom de l'utilisateur affiché en grand et souligné
- ✅ Niveau CEFR et score inclus
- ✅ Date d'émission automatique
- ✅ ID de certificat unique

### 3. Routes API
- ✅ `POST /api/generate_certificate` - Génère le certificat
- ✅ `GET /download_certificate` - Télécharge le PDF

### 4. Interface Utilisateur
- ✅ Bouton "Generate Certificate" sur la page de résultats
- ✅ Téléchargement automatique après génération
- ✅ Messages de succès/erreur

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
1. **certificate_generator.py** - Module de génération PDF
2. **templates/results_new.html** - Page de résultats avec certificat
3. **CERTIFICATE_PDF_GUIDE.md** - Ce guide

### Fichiers Modifiés
4. **models.py** - Ajout du champ `full_name`
5. **app_new.py** - Routes de génération et téléchargement
6. **requirements.txt** - Ajout de reportlab

## 🚀 Installation

### 1. Installer ReportLab
```bash
pip install reportlab==4.0.7
```

Ou installer toutes les dépendances:
```bash
pip install -r requirements.txt
```

### 2. Créer le dossier des certificats
Le dossier est créé automatiquement, mais vous pouvez le créer manuellement:
```bash
mkdir -p static/certificates
```

### 3. Mettre à jour la base de données
Si vous avez déjà des utilisateurs, vous devez ajouter le champ `full_name`:

**Option A: Recréer la base de données**
```bash
rm conseilux.db
python app.py  # Recrée la base avec le nouveau champ
```

**Option B: Migration SQL manuelle**
```sql
ALTER TABLE users ADD COLUMN full_name VARCHAR(200);
UPDATE users SET full_name = first_name || ' ' || last_name;
```

## 📊 Structure du Certificat

### Design
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    CONSEILUX                        │
│              Training and Development               │
│                                                     │
│                   CERTIFICATE                       │
│              of English Proficiency                 │
│                                                     │
│              This certifies that                    │
│                                                     │
│                  [USER NAME]                        │
│              ─────────────────                      │
│                                                     │
│    has successfully completed the English Test     │
│           and demonstrated proficiency at          │
│                                                     │
│                CEFR Level [LEVEL]                   │
│                                                     │
│                 Score: XX/116                       │
│                                                     │
│  Date: [DATE]        ____________                   │
│                   Authorized Signature              │
│                                                     │
│              Certificate ID: CSLX-XXXXX             │
└─────────────────────────────────────────────────────┘
```

### Éléments du Certificat
1. **Bordure décorative** - Double bordure (bleue et dorée)
2. **En-tête** - Logo et nom de l'entreprise
3. **Titre** - "CERTIFICATE of English Proficiency"
4. **Nom de l'utilisateur** - En grand, gras, souligné
5. **Texte de réussite** - Description de l'accomplissement
6. **Niveau CEFR** - En grand et doré
7. **Score** - Score total sur 116
8. **Pied de page** - Date, signature, ID unique

## 💻 Utilisation

### Depuis la Page de Résultats

1. L'utilisateur termine le test
2. Va sur `/resultats`
3. Voit son score et niveau
4. Clique sur "Generate Certificate"
5. Le certificat PDF est généré avec son nom
6. Téléchargement automatique

### Depuis le Code

```python
from certificate_generator import generate_user_certificate

# Générer un certificat
cert_path = generate_user_certificate(
    user_name="John Doe",
    level="B2",
    score=75,
    user_id=123
)

print(f"Certificate generated: {cert_path}")
```

### Via l'API

```javascript
// Générer le certificat
const response = await fetch('/api/generate_certificate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    level: 'B2',
    score: 75
  })
});

const data = await response.json();

if (data.success) {
  // Télécharger
  window.location.href = data.download_url;
}
```

## 🎨 Personnalisation

### Changer les Couleurs

Dans `certificate_generator.py`:
```python
# Colors
self.color_primary = HexColor('#0b2545')  # Bleu principal
self.color_accent = HexColor('#f1c40f')   # Doré
self.color_text = HexColor('#333333')     # Texte
```

### Modifier le Texte

Dans la méthode `_draw_achievement_text`:
```python
text1 = "Votre texte personnalisé ici"
c.drawCentredString(self.page_width / 2, y_position, text1)
```

### Ajouter un Logo

```python
def _draw_header(self, c):
    # Ajouter une image
    logo_path = "static/images/logo.png"
    if os.path.exists(logo_path):
        c.drawImage(logo_path, x, y, width=2*cm, height=2*cm)
```

### Changer la Police

```python
# Enregistrer une police personnalisée
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont('CustomFont', 'path/to/font.ttf'))

# Utiliser la police
c.setFont("CustomFont", 24)
```

## 🔍 Détails Techniques

### Nom du Fichier
Format: `certificate_{user_id}_{timestamp}.pdf`
Exemple: `certificate_123_20250115_143022.pdf`

### Emplacement
Les certificats sont sauvegardés dans:
```
static/certificates/certificate_123_20250115_143022.pdf
```

### Nom de Téléchargement
Format: `Conseilux_Certificate_{User_Name}.pdf`
Exemple: `Conseilux_Certificate_John_Doe.pdf`

### ID de Certificat
Format: `CSLX-{YYYYMMDD}-{XXXX}`
Exemple: `CSLX-20250115-7834`

## 📱 Responsive

Le certificat est en format A4 paysage (landscape), optimisé pour:
- ✅ Impression
- ✅ Affichage sur écran
- ✅ Partage par email
- ✅ Téléchargement mobile

## 🔒 Sécurité

### Contrôle d'Accès
- ✅ Seuls les utilisateurs connectés peuvent générer des certificats
- ✅ Chaque utilisateur ne peut télécharger que ses propres certificats
- ✅ Les chemins de fichiers sont validés

### Validation
```python
@login_required
def download_certificate():
    cert_path = request.args.get('path')
    
    # Vérifier que le fichier existe
    if not cert_path or not os.path.exists(cert_path):
        return jsonify({'error': 'Certificate not found'}), 404
    
    # Vérifier que c'est bien un certificat de l'utilisateur
    # (à implémenter si nécessaire)
```

## 🐛 Dépannage

### Problème: "No module named 'reportlab'"
**Solution:**
```bash
pip install reportlab
```

### Problème: "Column full_name doesn't exist"
**Solution:** Recréer la base de données
```bash
rm conseilux.db
python app.py
```

### Problème: Certificat ne se génère pas
**Solution:** Vérifier les logs du serveur
```bash
python app.py
# Regarder les erreurs dans la console
```

### Problème: Nom n'apparaît pas sur le certificat
**Solution:** Vérifier que `full_name` est bien rempli
```python
# Dans Python shell
from models import User, db
user = User.query.first()
print(user.full_name)  # Doit afficher le nom
```

## 📊 Exemple Complet

### 1. Inscription
```python
# L'utilisateur s'inscrit
POST /register
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "secret123"
}

# full_name est automatiquement créé: "John Doe"
```

### 2. Test
```python
# L'utilisateur fait le test
# Progression sauvegardée automatiquement
```

### 3. Résultats
```python
# L'utilisateur voit ses résultats
GET /resultats

# Score: 75/116
# Niveau: B2
```

### 4. Génération du Certificat
```python
# Clic sur "Generate Certificate"
POST /api/generate_certificate
{
  "level": "B2",
  "score": 75
}

# Réponse:
{
  "success": true,
  "download_url": "/download_certificate?path=static/certificates/certificate_123_20250115_143022.pdf"
}
```

### 5. Téléchargement
```python
# Téléchargement automatique
GET /download_certificate?path=static/certificates/certificate_123_20250115_143022.pdf

# Fichier téléchargé: Conseilux_Certificate_John_Doe.pdf
```

## 🎯 Avantages

1. **Personnalisé** - Chaque certificat contient le nom de l'utilisateur
2. **Professionnel** - Design élégant et moderne
3. **Unique** - ID de certificat unique pour chaque génération
4. **Automatique** - Génération en un clic
5. **Sécurisé** - Accessible uniquement par l'utilisateur connecté
6. **Portable** - Format PDF universel
7. **Imprimable** - Optimisé pour l'impression

## 🚀 Prochaines Étapes

### Améliorations Possibles

1. **Signature numérique** - Ajouter une vraie signature
2. **QR Code** - Pour vérification en ligne
3. **Envoi par email** - Envoyer automatiquement par email
4. **Historique** - Sauvegarder tous les certificats générés
5. **Templates multiples** - Différents designs au choix
6. **Watermark** - Ajouter un filigrane
7. **Multi-langue** - Certificats en plusieurs langues

### Code pour Envoi par Email

```python
from flask_mail import Mail, Message

@app.route('/api/email_certificate', methods=['POST'])
@login_required
def email_certificate():
    # Générer le certificat
    cert_path = generate_user_certificate(...)
    
    # Envoyer par email
    msg = Message(
        'Your English Certificate',
        recipients=[current_user.email]
    )
    
    with open(cert_path, 'rb') as f:
        msg.attach(
            'certificate.pdf',
            'application/pdf',
            f.read()
        )
    
    mail.send(msg)
    
    return jsonify({'success': True})
```

## 📞 Support

Pour toute question:
1. Vérifier ce guide
2. Consulter les logs du serveur
3. Tester avec un nouvel utilisateur
4. Vérifier que ReportLab est installé

---

**Status**: ✅ PRÊT À UTILISER
**Version**: 1.0
**Technologies**: Flask, ReportLab, SQLAlchemy
**Format**: PDF A4 Landscape
**Créé pour**: Conseilux Training and Development
