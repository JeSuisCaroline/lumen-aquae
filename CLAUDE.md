# 🎮 LUMEN-AQUAE - CONTEXTE POUR ASSISTANTS IA

**Chargé automatiquement par Claude Code en début de session.**

---

## 📌 IDENTITÉ DU PROJET

**Nom** : Lumen-Aquae  
**Type** : WebApp interactive de jeu de piste géolocalisé
**Framework** : Angular 21.1.0 standalone  
**Lieu** : Aix-en-Provence  
**Loc du code** : `C:\Users\fabri\WebstormProjects\lumen-aquae`

---

## 🧰 ENVIRONNEMENT DE DÉVELOPPEMENT (IMPORTANT)

- **OS** : Windows
- **Terminal** : **Cmder** (usage de commandes de type **Linux/Bash**)
- **IDE** : **WebStorm (JetBrains)**

### Règle pour les commandes

Quand tu proposes des commandes, **donne-les au format Linux/Bash** (bloc de code ```bash```), afin qu'elles soient directement exécutables dans Cmder.

- ✅ Exemple attendu :
  ```bash
  npm install
  npm run build
  ```
- ❌ À éviter : commandes PowerShell/Command Prompt spécifiques Windows.

Si une commande diffère réellement selon l'OS, donne d'abord la version Bash, puis (optionnellement) une note courte indiquant l'équivalent Windows.

### Règle pour les tests (IMPORTANT)

Quand tu agis en tant qu'agent Copilot sur ce projet :

- ❌ **Ne crée pas de nouveaux fichiers de tests** (`*.spec.ts`) automatiquement.
- ❌ **Ne lance pas** de commandes de test / couverture (`npm test`, `vitest`, `ng test`, etc.) automatiquement.
- ✅ **Fais-le uniquement si je te le demande explicitement** (ex: "lance les tests" / "corrige les tests").


## 🎮 CONCEPT CORE

### Vision
Webapp interactive pour un **jeu de piste géolocalisé à 2 joueurs** de type "Vous êtes le héros" avec :
- **Deux protagonistes** : Luce (magicienne) et Escur (voleur)
- **Arborescences d'histoires entrecroisées** : chemins parallèles et points de convergence possibles
- **Énigmes** : prototypes d'énigmes prévus (le système narratif est en cours de construction)
- **Système de jeu** : Inventaire, Florins (monnaie), aptitudes par classe
- **Technologie clé** : Geolocalisation

### Structure narrative
Le scénario est encore en développement : évitez d'inventer des détails factuels (intrigue, lieux, PNJ) tant que le contenu n'est pas stabilisé dans les données. Le **mécanisme** de narration (format des fichiers, moteur de parsing), en revanche, est stable et documenté ci-dessous.

---

## 🗺️ MOTEUR NARRATIF — CANVAS & FRAGMENTS

### Principe d'auteuring (Obsidian)
Le parcours est conçu visuellement dans **Obsidian** :
- Le fichier `.canvas` (`src/app/data/Canvas from 12 07 26/L'histoire.canvas`, JSON natif Obsidian : `nodes`/`edges`) contient toute l'arborescence. Chaque node pointe vers un fichier `.md` via un lien `[[NomDuFragment]]` (pas de texte de titre séparé dans le node). Les edges relient les nodes pour représenter les embranchements/choix.
- Chaque fichier `.md` dans `src/app/data/FRAGMENTS/` (⚠️ dossier en MAJUSCULES) est un **Fragment** : l'unité de base du parcours. Un sous-dossier `FRAGMENTS/old/` contient d'anciens fragments (structure Luce/Escur séparée) non utilisés par le moteur actuel.

### Trois types de Fragments (`kind`)

| Type | Préfixe fichier | Rôle |
|---|---|---|
| `standard` | (aucun) | Texte narratif simple ; les choix du joueur = les fragments sortants du canvas (edges) |
| `riddle` | `RIDDLE_` | Énigme posée au joueur |
| `routing` | `RESULT_` | Redirection automatique (sans interaction joueur) selon une variable trackée |

### Format des fragments (frontmatter **JSON** entre `---`)
```
---
{
  "type": "riddle",
  "question": "Intitulé de la question",
  "answers": [
    { "text": "Réponse proposée", "destination": "X_KO", "increment": 0 },
    { "text": "Bonne réponse", "destination": "X_OK", "increment": 1 }
  ]
}
---
Texte affiché au joueur.
```
Chaque réponse porte directement sa **destination** (nom du fragment vers lequel router) et son **increment** (valeur ajoutée à `score`, facultatif — absent = +0). Plus aucune dépendance aux flèches du canvas, à un booléen `valid`, ou à une convention de suffixe `_OK`/`_KO` : `destination` peut pointer vers n'importe quel fragment, et `increment` peut valoir n'importe quel nombre (pas limité à 0/1).

⚠️ **`score` est remis à 0 automatiquement dès qu'un fragment `RESULT_` a trouvé sa branche et redirigé le joueur.** Ça permet de réutiliser `variable_to_test: "score"` pour un groupe d'énigmes suivant (il repart de zéro) — mais ça veut aussi dire qu'on ne peut pas lire le score cumulé d'un groupe après son verdict.

```
---
{
  "type": "routing",
  "variable_to_test": "score",
  "branches": [
    { "condition": "0", "destination": "NomFragmentSiScore0" }
  ]
}
---
```

### Architecture technique actuelle
- `src/app/shared/models/story-flow.model.ts` : modèles (`CanvasDocument`, `CanvasNode`/`CanvasEdge`, `RiddleFrontmatter`, `RoutingFrontmatter`, `StoryFragment`).
- `src/app/core/services/story-flow/story-flow.parser.ts` : fonctions pures de parsing (canvas JSON + frontmatter JSON des fragments).
- `src/app/core/services/story-flow/story-flow.service.ts` (`StoryFlowService`) : charge canvas + fragments (RxJS pour le chargement HTTP initial uniquement), expose l'état en **Signals** (`score`, `currentFragment`, `canvasLoaded`), et offre une navigation **synchrone** une fois le graphe chargé (`goToFragment(name)`, `submitRiddleAnswer(text)`).
- Pas de fichier de test pour ce service pour l'instant (demandé explicitement).
- `angular.json` expose désormais `src/app/data/Canvas from 12 07 26` et `src/app/data/FRAGMENTS` comme assets statiques (`/data/...`), sans quoi `HttpClient` recevrait des 404.

⚠️ **`GameService` (`core/services/game/game.service.ts`) n'est PAS branché sur `StoryFlowService`** : il utilise encore l'ancien prototype statique à 2 joueurs (`SCENARIO`, `players.luce`/`players.escur`, `sharedFlags`). Le raccordement est une étape future distincte, pas encore demandée.

⚠️ Ne jamais inventer une "bonne réponse" (`valid: true`) dans un fragment `RIDDLE_` sans confirmation explicite de l'utilisateur.

## 🎨 CONVENTIONS DE CODE

### Composants
- **Standalone** : `standalone: true` obligatoire
- **Selector prefix** : `lumen-` (ex: `lumen-step`, `lumen-button`, `lumen-inventory`)
- **Chaque composant** : 4 fichiers (ts, html, scss, spec.ts)

### Services
- **Injectables** : `providedIn: 'root'`
- **GameService** : État global du jeu (currentStep, gold)
- **PlayerService** : Données du joueur actuel

## 🎯 FONCTIONNALITÉS À IMPLÉMENTER

### ✅ Déjà Existents
- API Angular 21 standalone
- Structure de base (services, composants)
- Service Worker PWA configuré

### 🔲 À Développer
- **Énigmes** : Saisie réponses + validation
- **Inventaire UI** : Affichage items + Florins
- **Conséquences dynamiques** : Crédibilité impact story
- **Persistance** : localStorage pour sauvegarde partie

### 🔮 Reporté à plus tard
⚠️ Le scope actuel est volontairement réduit : le joueur incarne uniquement **Luce**. Ne pas implémenter ou anticiper les points suivants sans demande explicite :
- **Système à deux joueurs** : Escur (voleur) n'est pas encore jouable
- **Geolocalisation** : Intégration GPS + validation rayon
- **Aptitudes par classe** : Différenciation Luce/Escur
- **Pouvoirs magiques** : Sorts/capacités de Luce (magicienne)

---

## 📊 DONNEES CLÉS

### Monnaie
- **Florins** : Unité de valeur du jeu
- **Variable GameService** : `gold: number`
- **Bonus par choix** : Certains offrent des Florins


## 🛠️ WORKFLOW RECOMMANDÉ

### Pour créer une feature
1. Créer le modèle dans `shared/models/`
2. Créer/mettre à jour le service dans `core/services/`
3. Créer le composant dans `features/`
4. Écrire les tests (`.spec.ts`)


---

## 📞 RÉINITIALISER LE CONTEXTE

Si je perds le contexte (session très longue, résumé automatique...) :
```
Je dois relire mon CLAUDE.md, réapplis-le svp au complet.
```

## ✏️ MISE À JOUR DU CLAUDE.md

Si le contexte du projet évolue (nouvelle règle, changement d'architecture, décision structurante, etc.), ce fichier doit être tenu à jour.

- ❌ **Ne modifie jamais ce fichier de ta propre initiative.**
- ✅ **Demande-moi confirmation avant** de proposer une modification à `CLAUDE.md`.

**CLAUDE.md v1.3 | Maj: 2026-07-25**

