# Instructions pour créer le favicon

## Option 1 : Utiliser un convertisseur en ligne (RECOMMANDÉ)

1. Allez sur https://favicon.io/favicon-converter/
2. Uploadez votre fichier `images/logo conseilux english.png`
3. Téléchargez le fichier `favicon.ico` généré
4. Placez le fichier `favicon.ico` dans le dossier `static/`

## Option 2 : Utiliser un autre convertisseur

1. Allez sur https://www.icoconverter.com/
2. Uploadez `images/logo conseilux english.png`
3. Sélectionnez la taille 32x32 ou 16x16
4. Téléchargez le fichier .ico
5. Renommez-le en `favicon.ico`
6. Placez-le dans le dossier `static/`

## Option 3 : Utiliser Photoshop/GIMP

1. Ouvrez `images/logo conseilux english.png`
2. Redimensionnez à 32x32 pixels
3. Exportez en format .ico
4. Sauvegardez comme `favicon.ico` dans `static/`

## Après avoir créé le favicon :

```bash
git add static/favicon.ico
git commit -m "Add favicon.ico"
git push origin main
```

## Alternative temporaire

Si vous ne pouvez pas créer le .ico maintenant, le PNG fonctionnera dans la plupart des navigateurs modernes.
Videz le cache de votre navigateur (Ctrl+Shift+Delete) et rechargez la page.
