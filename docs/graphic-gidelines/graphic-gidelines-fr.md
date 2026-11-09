# DokKodi — Charte graphique

> Univers **Cinematic Dark Mode** : une interface minimaliste et immersive, conçue pour mettre en valeur les affiches de films et les pochettes d’albums sans fatiguer les yeux dans une pièce sombre.

## 1. Identité

- **Nom de marque :** DokKodi
- **Concept visuel :** interface sombre, minimaliste et immersive.
- **Ambiance :** éléments légèrement arrondis et effets de profondeur subtils pour identifier immédiatement l’élément sélectionné (*focus*), même à 3 mètres de distance.

## 2. Palette de couleurs

Les contrastes sont indiqués dans la charte comme devant respecter un ratio minimal de **4,5:1 pour le texte courant**.

| Rôle | Aperçu | Nom | Code hexadécimal | Usage |
|---|:---:|---|---|---|
| Fond principal | <span style="display:inline-block;width:3em;height:1.4em;background:#0F1117;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Noir profond / Nuit | `#0F1117` | Fond principal, adapté aux écrans OLED/LCD et à une utilisation dans une pièce sombre. |
| Fond secondaire | <span style="display:inline-block;width:3em;height:1.4em;background:#1E222D;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Gris anthracite | `#1E222D` | Cartes, conteneurs, barres latérales et modales. |
| Couleur d’accent | <span style="display:inline-block;width:3em;height:1.4em;background:#3B82F6;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Bleu électrique | `#3B82F6` | Liens, indicateurs de progression et badges d’état. |
| Couleur de focus | <span style="display:inline-block;width:3em;height:1.4em;background:#F59E0B;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Ambre lumineux | `#F59E0B` | Sélection active, contour ou surbrillance très visible. |
| Texte principal | <span style="display:inline-block;width:3em;height:1.4em;background:#FFFFFF;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Blanc pur | `#FFFFFF` | Titres et textes d’interface. |
| Texte secondaire | <span style="display:inline-block;width:3em;height:1.4em;background:#9CA3AF;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Gris clair | `#9CA3AF` | Métadonnées : durée, année, casting et genres. |
| Erreur / alerte | <span style="display:inline-block;width:3em;height:1.4em;background:#EF4444;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | Rouge corail | `#EF4444` | Suppressions, messages d’erreur et restrictions (profil enfant). |

**Accessibilité — mode contraste élevé**

| Rôle | Aperçu | Code hexadécimal | Usage |
|---|:---:|---|---|
| Fond contraste élevé | <span style="display:inline-block;width:3em;height:1.4em;background:#000000;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | `#000000` | Remplace le fond par du noir pur. |
| Focus contraste élevé | <span style="display:inline-block;width:3em;height:1.4em;background:#FFFF00;border:1px solid #777;border-radius:4px;vertical-align:middle"></span> | `#FFFF00` | Contours de focus jaune vif. |

> **Note d’accessibilité :** l’information ne doit jamais être portée uniquement par la couleur.

## 3. Typographie

La charte recommande une police sans-serif moderne et lisible sur grand écran : **Inter** ou **SF Pro Display**.

### Aperçu des polices

> Les aperçus ci-dessous utilisent la police disponible dans l’environnement d’affichage. Pour voir le rendu exact d’Inter ou de SF Pro Display, il faut que la police soit installée ou chargée dans le logiciel qui affiche ce fichier Markdown.

**Inter — police recommandée**

<div style="font-family:Inter, sans-serif">
  <div style="font-size:2em;font-weight:700">DokKodi — Titres en Bold</div>
  <div style="font-size:1.5em;font-weight:600">Reprise de lecture — Semi-Bold</div>
  <div style="font-size:1.2em;font-weight:500">Derniers ajouts — Medium</div>
  <div style="font-size:1em;font-weight:400;line-height:1.5">Découvrez vos films, séries, albums et podcasts dans une interface immersive.</div>
</div>

**SF Pro Display — alternative recommandée**

<div style="font-family:'SF Pro Display', sans-serif">
  <div style="font-size:2em;font-weight:700">DokKodi — Titres en Bold</div>
  <div style="font-size:1.5em;font-weight:600">Reprise de lecture — Semi-Bold</div>
  <div style="font-size:1.2em;font-weight:500">Derniers ajouts — Medium</div>
  <div style="font-size:1em;font-weight:400;line-height:1.5">Découvrez vos films, séries, albums et podcasts dans une interface immersive.</div>
</div>

### Échelle typographique TV (1080p / 4K)

| Élément | Taille | Graisse | Exemple / usage |
|---|---:|---|---|
| Titre principal (H1) | 48 px | Bold (700) | Nom du film ou de la série dans la fiche détaillée. |
| Titre de section (H2) | 32 px | Semi-Bold (600) | « Reprise de lecture », « Derniers ajouts ». |
| Titre de carte (H3) | 24 px | Medium (500) | Nom du média dans les grilles. |
| Texte courant / résumé | 20 px | Regular (400) | Interligne minimum de 1,5. |
| Légendes / métadonnées | 16 px | Medium (500) | Année, genre, durée. |

## 4. UI/UX — Focus et composants « 10 pieds »

L’interface est entièrement navigable avec les flèches du clavier ou d’une télécommande.

### Carte de média (affiche / film)

- **État normal :** bordure transparente et opacité à 90 %.
- **État focalisé (sélectionné) :**
  - Bordure extérieure de `3px solid #F59E0B` (ambre).
  - Agrandissement : `transform: scale(1.08)`, avec une animation fluide désactivable dans les options d’accessibilité.
  - Ombre portée : `box-shadow: 0 10px 25px rgba(0,0,0,0.8)`.

### Boutons d’action (Lire, Reprendre, Options)

- Coins arrondis : `border-radius: 12px`.
- État sélectionné : fond lumineux (`#3B82F6` ou `#F59E0B`) et texte noir, pour un contraste maximal.

### Lecteur vidéo (OSD — On Screen Display)

- Interface épurée qui disparaît après 3 secondes d’inactivité.
- Barre de progression de 8 px de haut.
- Taille des sous-titres et fonds personnalisables dans les réglages.

## 5. Disposition de l’écran d’accueil

### Zone principale

- **Bannière « À la une / En cours » :** occupe le tiers supérieur et permet de reprendre directement le dernier média lu, avec sa barre de progression.
- **Carrousels horizontaux :** listes défilantes pour les derniers ajouts, les séries populaires et les podcasts récents.

## 6. Accessibilité intégrée (WCAG 2.2 AA)

- **Mode contraste élevé :** option dans les paramètres pour utiliser le fond noir pur (`#000000`) et des contours de focus jaune vif (`#FFFF00`).
- **Animations :** option globale pour désactiver les effets de zoom et les transitions du focus.
- **Taille de texte dynamique :** possibilité d’augmenter la taille globale de la police de **+20 %** ou **+40 %**.
