# 🏆 Certificat Premium avec WeasyPrint

## Vue d'ensemble

Ce système génère des **certificats PDF professionnels et premium** en utilisant WeasyPrint. Les certificats sont créés à partir de templates HTML/CSS, ce qui permet un design sophistiqué et personnalisable.

## ✨ Caractéristiques

- ✅ **Design Premium** : Certificat élégant avec bordures décoratives, coins ornés, et mise en page professionnelle
- ✅ **Format A4 Paysage** : Format standard professionnel pour l'impression
- ✅ **Personnalisation Complète** : Nom de l'utilisateur, niveau CEFR, scores détaillés
- ✅ **Logo Intégré** : Support du logo Conseilux
- ✅ **ID Unique** : Chaque certificat a un ID unique pour la vérification
- ✅ **Watermark** : Filigrane discret pour l'authenticité
- ✅ **Sceau Officiel** : Sceau décoratif pour le professionnalisme

## 📋 Prérequis

### Installation des dépendances

```bash
pip install WeasyPrint==60.2
```

Ou installez toutes les dépendances :

```bash
pip install -r requirements.txt
```

### Dépendances système (Linux)

Sur Linux, vous pourriez avoir besoin d'installer des dépendances système :

```bash
# Ubuntu/Debian
sudo apt-get install python3-dev python3-pip python3-setuptools python3-wheel python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info

# CentOS/RHEL
sudo yum install python3-devel python3-pip cairo-devel pango-devel gdk-pixbuf2-devel libffi-devel
```

### Dépendances système (Windows)

Sur Windows, installez GTK+ runtime :
- Téléchargez depuis : https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases
- Ou utilisez conda : `conda install -c conda-forge weasyprint`

### Dépendances système (macOS)

```bash
brew install python3 cairo pango gdk-pixbuf libffi
```

## 🚀 Utilisation

### Méthode 1 : Via l'API Flask

L'endpoint `/api/generate_certificate` génère automatiquement un certificat premium :

```javascript
// Exemple depuis JavaScript
fetch('/api/generate_certificate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        level: 'B2',
        score: 85,
        reading_score: 65,
        listening_score: 20
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        window.location.href = data.download_url;
    }
});
```

### Méthode 2 : Directement en Python

```python
from weasyprint_certificate_generator import PremiumCertificateGenerator

generator = PremiumCertificateGenerator()

cert_path = generator.generate_certificate(
    user_name="John Doe",
    level="B2",
    reading_score=65,
    listening_score=20,
    total_score=85,
    user_id=1
)

print(f"Certificat généré : {cert_path}")
```

### Méthode 3 : Fonction Helper

```python
from weasyprint_certificate_generator import generate_premium_certificate

cert_path = generate_premium_certificate(
    user_name="Jane Smith",
    reading_score=70,
    listening_score=22,
    user_id=2
)
```

## 📊 Paramètres

### Niveaux CEFR

Les niveaux CEFR sont déterminés automatiquement basés sur le score total (sur 116) :

| Score Total | Niveau CEFR | Description |
|-------------|-------------|-------------|
| 101-116 | C2 | Proficient |
| 81-100 | C1 | Advanced |
| 61-80 | B2 | Upper Intermediate |
| 41-60 | B1 | Intermediate |
| 21-40 | A2 | Elementary |
| 0-20 | A1 | Beginner |

### Paramètres de Génération

```python
generate_certificate(
    user_name="Nom Complet",      # Requis
    level="B2",                    # Optionnel (calculé si absent)
    reading_score=65,              # Optionnel (0 par défaut)
    listening_score=20,            # Optionnel (0 par défaut)
    total_score=85,                # Optionnel (calculé si absent)
    user_id=1,                     # Pour l'ID du certificat
    output_path="path/to/cert.pdf", # Optionnel (auto-généré)
    logo_path="path/to/logo.png"   # Optionnel
)
```

## 🎨 Personnalisation

### Modifier le Design

Le template HTML se trouve dans `templates/certificate_premium.html`. Vous pouvez :

- Modifier les couleurs dans la section `<style>`
- Ajuster la mise en page
- Ajouter/retirer des éléments décoratifs
- Changer les polices

### Exemple de Personnalisation des Couleurs

```css
/* Couleur principale (bleu) */
.certificate-title {
    color: #1a237e; /* Modifier ici */
}

/* Couleur d'accent (or) */
.border-inner {
    border-color: #ffd700; /* Modifier ici */
}
```

## 📁 Structure des Fichiers

```
├── weasyprint_certificate_generator.py  # Générateur principal
├── templates/
│   └── certificate_premium.html         # Template HTML premium
├── app_new.py                           # Intégration Flask
└── static/
    └── certificates/                    # Certificats générés (auto-créé)
```

## 🐛 Dépannage

### Erreur : "WeasyPrint could not import some required library"

**Solution** : Installez les dépendances système nécessaires (voir section Prérequis).

### Erreur : "Logo not found"

**Solution** : Vérifiez que le logo existe dans `images/logo conseilux english.png` ou fournissez le chemin complet.

### Le PDF ne s'affiche pas correctement

**Solution** : 
- Vérifiez que toutes les polices sont disponibles
- Assurez-vous que les chemins des images sont corrects (utilisez file:// URLs)
- Vérifiez les logs pour les erreurs WeasyPrint

### Certificat vide ou mal formaté

**Solution** :
- Vérifiez que tous les paramètres requis sont fournis
- Vérifiez que le template HTML est valide
- Vérifiez les logs Flask pour les erreurs

## 🔒 Sécurité

- Les certificats sont générés uniquement pour les utilisateurs authentifiés
- Les noms de fichiers sont sanitized pour éviter les injections
- Les chemins sont validés pour éviter les accès non autorisés

## 📝 Exemple de Certificat Généré

Le certificat inclut :

1. **En-tête** : Logo Conseilux, titre "Certificate of English Proficiency"
2. **Corps** : 
   - Nom du récipiendaire (en grand)
   - Texte de certification
   - Badge du niveau CEFR
   - Scores (Reading, Listening, Total)
3. **Pied de page** :
   - Date d'émission
   - Ligne de signature
   - ID unique du certificat
4. **Éléments décoratifs** :
   - Bordures doubles (bleu et or)
   - Coins ornés
   - Watermark
   - Sceau officiel
   - Cercles décoratifs

## 🚀 Prochaines Améliorations

- [ ] Support de langues multiples
- [ ] Templates alternatifs
- [ ] QR Code pour vérification en ligne
- [ ] Signatures numériques
- [ ] Personnalisation des couleurs par niveau CEFR

## 📞 Support

Pour toute question ou problème, consultez :
- Documentation WeasyPrint : https://weasyprint.org/
- Issues GitHub du projet

---

**Créé avec ❤️ pour Conseilux**
