---
name: add-divagation-image
description: Trouve, propose, télécharge et associe une image (avec crédit) à une divagation du Fou par son id — sans jamais toucher au contenu Obsidian.
---

Ce skill guide l'ajout d'une image à une divagation existante du mécanisme "Le Fou" de Lumen-Aquae. Contexte complet dans `CLAUDE.md` (section "Le Fou & les divagations du Fou") et dans les mémoires `feedback_divagation_images` / `feedback_narrative_scratch_file`.

⚠️ Règle absolue : ne jamais éditer `src/app/data/DIVAGATIONS/*.md` ni `src/app/data/FRAGMENTS/*.md`. Obsidian reste l'unique source de vérité pour le contenu narratif — l'image et son crédit sont gérés entièrement côté code via `public/divagations/manifest.json`.

## Étapes à suivre

1. **Identifier l'id de la divagation.** Si `args` fourni au skill, l'utiliser directement. Sinon, demander à l'utilisateur (ex. `fontaine-rotonde`). Vérifier que l'entrée existe déjà quelque part (ex. `RAMBLING` dans un fragment, ou déjà présente/absente de `public/divagations/manifest.json`) pour comprendre le sujet réel de la divagation — si le sujet n'est pas évident depuis l'id seul, lire le fichier `DIVAGATIONS/<id>.md` correspondant (titre/texte) pour savoir quoi chercher, sans le modifier.

2. **Rechercher des images libres de droits**, en priorité sur Wikimedia Commons (`WebSearch` + `WebFetch` sur `commons.wikimedia.org`). Écarter tout ce qui n'a pas une licence claire (CC0, CC BY, CC BY-SA, domaine public). Présenter 2 à 4 candidats à l'utilisateur avec pour chacun : description rapide, résolution, licence exacte, et l'URL de la page Commons (pas l'URL de téléchargement direct, pour qu'il puisse vérifier lui-même s'il le souhaite).

3. **Attendre la validation explicite** de l'utilisateur sur le candidat choisi. Ne rien télécharger avant.

4. **Demander s'il veut créditer**, et sous quelle forme — sauf si la licence choisie ne l'exige pas (ex. CC0/domaine public), auquel cas ne pas demander. Proposer toujours 3 options : format par défaut cohérent avec l'existant (`"Photo : <auteur> (Wikimedia Commons, <licence>)"`), une formulation différente, ou **ne pas créditer pour l'instant** (à ajouter plus tard) — même sous une licence qui l'exige (CC BY/CC BY-SA), c'est un choix assumé de l'utilisateur, pas une erreur à signaler. Dans ce dernier cas, omettre simplement le champ `credit` de l'entrée du manifest (`RamblingImageManifestEntry.credit` est optionnel) plutôt que d'y mettre une valeur vide ou un placeholder.

5. **Télécharger l'image** (annoncer nom de fichier, source, taille avant de le faire — règle standard de téléchargement de fichier) dans `public/divagations/<id>.jpg` (toujours en `.jpg` sauf raison contraire — le manifest supporte un champ `ext` si un autre format est un jour nécessaire).

6. **Mettre à jour `public/divagations/manifest.json`** : ajouter/modifier l'entrée `"<id>": { "credit": "..." }` (garder les entrées existantes intactes, JSON valide).

7. **Vérifier** : `npx ng build --configuration development` doit passer sans erreur. Si un serveur dev tourne déjà et que le nouveau fichier `public/` renvoie 404, redémarrer le serveur (le scan des assets statiques peut être resté périmé — déjà observé une fois avec `manifest.json`).

8. **Confirmer à l'utilisateur** que c'est fait, avec un résumé court (fichier ajouté, poids, crédit choisi) — pas besoin de test navigateur systématique à chaque fois, seulement si un doute existe sur le rendu.

## Ce que ce skill ne fait jamais
- Ne propose ni ne choisit une image sans validation explicite de l'utilisateur à l'étape 3.
- Ne télécharge jamais depuis une source dont la licence n'est pas claire.
- Ne touche à aucun fichier sous `src/app/data/FRAGMENTS/` ou `src/app/data/DIVAGATIONS/`.
- Ne réécrit jamais `docs/NARRATIF_A_COPIER.txt` dans le cadre de ce skill (rien à copier dans Obsidian pour une image).