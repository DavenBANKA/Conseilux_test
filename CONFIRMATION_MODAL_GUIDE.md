# 🔔 Confirmation Modal - Guide d'Utilisation

## ✅ Fonctionnalité Implémentée

Un système de pop-up de confirmation professionnel qui s'affiche lorsqu'un utilisateur tente de passer à la question suivante sans avoir répondu.

## 📁 Fichiers Créés/Modifiés

### 1. **static/js/confirmation-modal.js** ✅
- Composant JavaScript réutilisable
- Gère l'affichage et la fermeture du modal
- Fonction globale: `showConfirmationModal(message, onConfirm, onCancel)`

### 2. **static/css/main.css** ✅
- Styles pour le modal overlay
- Animation d'apparition (fadeIn + slideUp)
- Design responsive
- Boutons professionnels

### 3. **static/js/test.js** ✅
- Intégration dans le test de Reading
- Vérifie si la question est répondue
- Affiche le modal si non répondu

### 4. **static/js/listening_new.js** ✅
- Intégration dans le test de Listening
- Compte les questions non répondues
- Message adapté (1 question ou X questions)

### 5. **templates/test.html** ✅
- Ajout du script confirmation-modal.js

### 6. **templates/listening.html** ✅
- Ajout du script confirmation-modal.js

## 🎯 Fonctionnement

### Test de Reading
1. L'utilisateur clique sur "Next" sans répondre
2. Le modal apparaît avec le message:
   > "You have not answered this question. Do you want to skip it and move to the next question?"
3. Deux options:
   - **"No, Go Back"** → Reste sur la question actuelle
   - **"Yes, Continue"** → Passe à la question suivante

### Test de Listening
1. L'utilisateur clique sur "Next Section" avec des questions non répondues
2. Le modal apparaît avec le message:
   > "You have X unanswered questions in this section. Do you want to continue to the next section anyway?"
3. Deux options:
   - **"No, Go Back"** → Reste sur la section actuelle
   - **"Yes, Continue"** → Passe à la section suivante

## 💻 Utilisation du Composant

### Syntaxe de Base
```javascript
showConfirmationModal(message, onConfirm, onCancel);
```

### Paramètres
- **message** (string): Le message à afficher
- **onConfirm** (function): Fonction appelée si l'utilisateur clique "Yes"
- **onCancel** (function): Fonction appelée si l'utilisateur clique "No"

### Exemple d'Utilisation
```javascript
showConfirmationModal(
  'Are you sure you want to proceed?',
  function() {
    console.log('User confirmed');
    // Code à exécuter si confirmé
  },
  function() {
    console.log('User cancelled');
    // Code à exécuter si annulé
  }
);
```

## 🎨 Design

### Caractéristiques
- ✅ Overlay semi-transparent (rgba(0,0,0,.5))
- ✅ Carte blanche centrée avec ombre
- ✅ Icône d'avertissement (⚠️)
- ✅ Titre en gras
- ✅ Message centré et lisible
- ✅ Deux boutons clairs
- ✅ Animations fluides (fadeIn + slideUp)

### Couleurs
- **Overlay**: Noir 50% opacité
- **Carte**: Blanc (#ffffff)
- **Titre**: Bleu marine (#0b2545)
- **Message**: Gris (#6c757d)
- **Bouton primaire**: Jaune (#f1c40f)
- **Bouton secondaire**: Blanc avec bordure

### Responsive
- **Desktop**: Modal 500px de large
- **Mobile**: Modal 95% de largeur
- **Boutons**: Empilés verticalement sur mobile

## ⌨️ Interactions

### Fermeture du Modal
1. **Clic sur "No, Go Back"** → Ferme et annule
2. **Clic sur "Yes, Continue"** → Ferme et confirme
3. **Clic en dehors du modal** → Ferme et annule
4. **Touche Escape** → Ferme et annule

### Prévention du Scroll
- Quand le modal est ouvert, le scroll de la page est désactivé
- Quand le modal est fermé, le scroll est restauré

## 🔧 Personnalisation

### Modifier le Message
Dans `test.js` ou `listening_new.js`:
```javascript
showConfirmationModal(
  'Votre message personnalisé ici',
  onConfirm,
  onCancel
);
```

### Modifier les Textes des Boutons
Dans `confirmation-modal.js`, ligne 15-16:
```javascript
<button id="modal-cancel" class="modal-btn modal-btn-secondary">Non, Retour</button>
<button id="modal-confirm" class="modal-btn modal-btn-primary">Oui, Continuer</button>
```

### Modifier l'Icône
Dans `confirmation-modal.js`, ligne 13:
```javascript
<div class="modal-icon">⚠️</div>
// Remplacer par: ❓ ℹ️ ⚡ 🔔 etc.
```

### Modifier les Couleurs
Dans `main.css`, section "CONFIRMATION MODAL":
```css
.modal-btn-primary{
  background:#votre-couleur;
  color:#votre-couleur-texte;
}
```

## 🚀 Test

### Test de Reading
1. Démarrer le serveur: `python app.py`
2. Aller sur: `http://localhost:5000/test`
3. Ne pas répondre à une question
4. Cliquer sur "Next"
5. Le modal devrait apparaître

### Test de Listening
1. Aller sur: `http://localhost:5000/listening`
2. Ne pas répondre à toutes les questions d'une section
3. Cliquer sur "Next Section"
4. Le modal devrait apparaître avec le nombre de questions non répondues

## 🐛 Dépannage

### Le modal n'apparaît pas
**Solution**: Vérifier que `confirmation-modal.js` est bien chargé
```html
<!-- Dans test.html et listening.html -->
<script src="{{ url_for('static', filename='js/confirmation-modal.js') }}"></script>
```

### Erreur "showConfirmationModal is not defined"
**Solution**: S'assurer que `confirmation-modal.js` est chargé AVANT `test.js` et `listening_new.js`

### Le modal ne se ferme pas
**Solution**: Vérifier la console du navigateur pour les erreurs JavaScript

### Le scroll ne se restaure pas
**Solution**: Vérifier que `document.body.style.overflow = ''` est bien appelé

## 📊 Avantages

✅ **Prévient les erreurs**: Évite que l'utilisateur passe accidentellement
✅ **UX améliorée**: Donne une seconde chance de répondre
✅ **Professionnel**: Design moderne et cohérent
✅ **Réutilisable**: Peut être utilisé ailleurs dans l'application
✅ **Accessible**: Fermeture par Escape, clic extérieur
✅ **Responsive**: Fonctionne sur tous les appareils
✅ **Performant**: Animations fluides, pas de lag

## 🎓 Bonnes Pratiques

1. **Messages clairs**: Toujours expliquer pourquoi le modal apparaît
2. **Actions évidentes**: Boutons avec textes explicites
3. **Pas de blocage**: Toujours permettre de fermer le modal
4. **Cohérence**: Utiliser le même style partout
5. **Feedback visuel**: Animations pour indiquer l'action

## 📝 Notes Techniques

- Le modal est créé dynamiquement au premier appel
- Un seul modal existe dans le DOM (réutilisé)
- Les event listeners sont recréés à chaque appel (évite les doublons)
- Le z-index est 9999 pour être au-dessus de tout
- Compatible avec tous les navigateurs modernes

---

**Créé pour**: Site de test de niveau anglais Conseilux
**Version**: 1.0
**Date**: 2025
**Compatibilité**: Chrome, Firefox, Safari, Edge
