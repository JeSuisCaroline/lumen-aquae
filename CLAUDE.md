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
- `src/app/shared/models/story-flow.model.ts` : modèles (`CanvasDocument`, `CanvasNode`/`CanvasEdge` avec `label?`, `RiddleFrontmatter`, `RoutingFrontmatter`, `Fragment` avec `outgoingChoices: OutgoingChoice[]` (`{ name, label? }`, un par flèche sortante du canvas)).
- `src/app/core/services/story-flow/story-flow.parser.ts` : fonctions pures de parsing (canvas JSON + frontmatter JSON des fragments).
- `src/app/core/services/story-flow/story-flow.service.ts` (`StoryFlowService`) : charge canvas + fragments (RxJS pour le chargement HTTP initial uniquement), construit le graphe (`fragmentsByName`, `outgoingChoices` par fragment, détection du fragment de départ via absence d'arête entrante), expose l'état en **Signals** (`currentFragment`, `canvasLoaded`), et offre une navigation **synchrone** une fois le graphe chargé (`goToFragment(name)`, `submitRiddleAnswer(text)`, `restartStory()` → revient au fragment de départ). Il délègue tout l'état du joueur (Florins, Hophophops, score) à `PlayerStateService` (injecté), sans en connaître le détail.
- `src/app/core/services/player-state/player-state.service.ts` (`PlayerStateService`, anciennement `LuceStateService`) : possède exclusivement l'état du joueur — Signals `florins`/`hophophops`/`score`, `applyEffects(effects)` (Florins/Hophophops, appliqué par `StoryFlowService.goToFragment()` à chaque fragment atteint), `incrementScore(amount)`/`resetScore()` (score des énigmes, appelés par `submitRiddleAnswer`/`readTrackedVariable`/`resetTrackedVariable`), et `reset()` (remet les trois à leurs valeurs initiales, appelé par `restartStory()`). Voir section Florins & Hophophops ci-dessous.
- `src/app/core/services/game/game.service.ts` (`GameService`) : couche de présentation au-dessus de `StoryFlowService` **et** `PlayerStateService` — mappe `Fragment` → `Step` (`mapFragmentToStep`) et `outgoingChoices`/`answers` → `Choice[]` (`mapFragmentChoices`, c'est ici que le fallback "Continuer" est appliqué).
- Pas de fichier de test pour ces services pour l'instant (demandé explicitement).
- `angular.json` expose désormais `src/app/data/Canvas from 12 07 26` et `src/app/data/FRAGMENTS` comme assets statiques (`/data/...`), sans quoi `HttpClient` recevrait des 404.

✅ **`GameService` (`core/services/game/game.service.ts`) est branché sur `StoryFlowService`/`PlayerStateService`** : il expose `isReady`/`florins`/`hophophops`/`currentStep`, et délègue la navigation (`goToStep`, `restart`) à `goToFragment`/`submitRiddleAnswer`/`restartStory`. L'ancien prototype statique (`SCENARIO`, `players.luce`/`players.escur`, `sharedFlags`) n'est plus utilisé (fichier `data/scenario.ts` supprimé).

⚠️ Ne jamais inventer une "bonne réponse" (`valid: true`) dans un fragment `RIDDLE_` sans confirmation explicite de l'utilisateur.

### Labels des flèches → texte des boutons de choix
Pour un fragment `standard`, chaque flèche (edge) sortante du canvas devient un bouton de choix pour le joueur. Le **texte affiché sur le bouton** vient du label de la flèche dans Obsidian (clic droit sur la flèche → "Add label", ou double-clic dessus selon la version) : champ `CanvasEdge.label`, optionnel.

⚠️ **Sans label sur la flèche, le bouton affiche "Continuer" par défaut.** Dès qu'un fragment a plusieurs flèches sortantes (vraie bifurcation), il faut labelliser explicitement chacune dans Obsidian — sinon tous les boutons afficheront "Continuer" et le joueur ne pourra pas distinguer les choix.

Les fragments `riddle` (`RIDDLE_`) ne sont pas concernés par ce mécanisme : le texte des boutons de réponse vient directement de `answers[].text` dans le frontmatter (cf. format ci-dessus).

### Interprétation du gras/italique dans le texte affiché
Le corps (`content`) d'un fragment passe par le pipe `MarkdownEmphasisPipe` (`src/app/shared/pipes/markdown-emphasis.pipe.ts`), appliqué uniquement à la `description` dans `title.component.html`. Ce n'est **pas** un vrai parseur markdown, juste des regex successives :
- `**texte**` → gras (`<strong>`)
- `*texte*` → italique (`<em>`)
- `_texte_` → italique (`<em>`)

Le **titre** du fragment (`text` du composant `lumen-title`) ne passe pas par ce pipe et n'interprète donc aucune emphase.

### 💰⚡ Florins & Hophophops (ressources de Luce)

Deux compteurs suivent l'état de Luce tout au long du parcours :
- **Florins** : monnaie du jeu (sert à acheter des objets — inventaire pas encore implémenté).
- **Hophophops** : points de motivation. **À 0, c'est le game over** (redirection automatique, cf. plus bas).

Les deux démarrent à **10** (`INITIAL_FLORINS`/`INITIAL_HOPHOPHOPS` dans `player-state.service.ts`) et sont remis à 10 par `PlayerStateService.reset()` (appelé depuis `restartStory()`, qui remet aussi `score` à 0). Tout l'état du joueur vit dans **`PlayerStateService`** (Florins, Hophophops, **et** `score` — la variable de tracking des énigmes) — `StoryFlowService` se contente d'appeler `playerState.applyEffects(fragment.frontmatter)` à chaque fragment atteint, sans connaître `FLO`/`HOP` autrement que via ce passage.

**Comment les faire varier dans Obsidian** : ajoute (ou complète) le frontmatter JSON d'un fragment avec `FLO` (Florins) et/ou `HOP` (Hophophops) — des **entiers signés** (positif = gain, négatif = perte) :

Exemple (perd 3 Florins et gagne 2 Hophophops en arrivant sur ce fragment) :
```
---
{
  "FLO": -3,
  "HOP": 2
}
---
Texte affiché au joueur.
```
`FLO` et `HOP` sont optionnels et indépendants — mets uniquement celui dont tu as besoin sur un fragment donné.

⚠️ Ça marche sur **n'importe quel fragment**, y compris `standard` (auparavant les fragments `standard` n'avaient jamais de frontmatter — `parseFragmentMarkdown` le garde désormais au lieu de le jeter). Ça fonctionne aussi sur les `RIDDLE_`/`RESULT_` en ajoutant `FLO`/`HOP` à côté de `question`/`answers` ou `variable_to_test`/`branches`.

L'effet s'applique **une fois, dès que le joueur atteint le fragment** (y compris les `RESULT_` traversés automatiquement lors d'une redirection) — cf. `PlayerStateService.applyEffects()`, appelée par `StoryFlowService.goToFragment()` en tout début de méthode. **Ni les Florins ni les Hophophops ne descendent sous 0** (`Math.max(0, ...)`), même avec une valeur `FLO`/`HOP` très négative.

**Game over automatique** : `GameService` observe `playerState.hophophops` via un `effect()` dans son constructeur — dès que la valeur atteint 0, navigation automatique vers `/game-over` (`GameOverComponent`), qui affiche un texte humoristique et un bouton "Retour à l'accueil" (`gameService.restart()` puis navigation vers `/welcome`, pour repartir sur des compteurs propres).

**Affichage** : `PlayerStatusComponent` (`lumen-player-status`, `src/app/features/player-status/`, anciennement `LuceStatusComponent`/`lumen-luce-status`) montre les deux compteurs (icône + chiffre + libellé "Florins"/"Hophophops"), fond doré (`colors.$lumen-gold`). Il est intégré au **centre du header** (`header.component.html`, grille 3 colonnes `1fr auto 1fr` pour un centrage indépendant des largeurs du titre et du bouton retour) — donc visible **uniquement sur `/game`** (là où `lumen-header` est rendu), pas sur `/welcome`/`/tuto`/`/game-over`. Le badge Hophophops pulse en rouge quand il reste ≤ 3 points.

---

## 🧪 MODE DEV vs PROD (outils de debug)

Certains éléments de l'UI sont conditionnés par `isDevMode()` (natif Angular, importé de `@angular/core`) : ils n'existent **que** quand l'app tourne en configuration `development`, jamais en `production`.

### Comment `isDevMode()` est déterminé
`isDevMode()` reflète le flag `ngDevMode`, lui-même fixé par le flag `optimization` du build (`angular.json`) :
- Configuration **`development`** (`angular.json` → `architect.build.configurations.development`) : `optimization: false` → `isDevMode() === true`.
- Configuration **`production`** (`architect.build.configurations.production`, c'est le `defaultConfiguration` du build) : `optimization` reste à sa valeur par défaut (`true`) → `isDevMode() === false`.

### Ce que ça change concrètement
| | Dev mode | Prod (ou preview) |
|---|---|---|
| Barre de recherche de fragments (`lumen-dev-fragment-search`, coin bas-droit) | Visible | Absente (le `@if (isDevMode)` ne rend rien) |
| Titre affiché sur une step (`GameService.mapFragmentToStep`) | Nom technique du fragment (ex: `Fin_Prologue`) | Chaîne vide `''` |

⚠️ Avant d'ajouter un nouvel outil de debug/QA à l'UI, réutiliser ce même pattern (`isDevMode()`) plutôt que d'inventer un autre mécanisme de gating.

### Correspondance avec les scripts `package.json`
| Script | Commande réelle | Configuration Angular | `isDevMode()` |
|---|---|---|---|
| `npm start` | `ng serve` | `development` (défaut du `serve`) | `true` |
| `npm run watch` | `ng build --watch --configuration development` | `development` (explicite) | `true` |
| `npm run build` | `ng build` | `production` (défaut du `build`) | `false` |
| `npm run preview` | `ng build && npx http-server dist/lumen-aquae/browser -p 8080` | `production` (build) + serveur statique local sur `:8080` | `false` |

`npm run preview` est le moyen le plus rapide de vérifier en local qu'un comportement dev-only (barre de recherche, titre technique...) disparaît bien avant de pousser en prod — pas besoin de déployer pour tester.

## 🧭 ÉCRANS & ROUTES

Routing dans `src/app/core/routing/app.routes.ts` (lazy-loadées via `loadComponent`) :

| Route | Composant | Rôle |
|---|---|---|
| `/welcome` (défaut : `''` y redirige) | `WelcomeComponent` | Écran d'accueil : titre, texte d'intro, boutons "commencer" / "tuto" |
| `/tuto` | `TutoComponent` | Vide pour l'instant, juste un bouton retour vers `/welcome` |
| `/game` | `GameComponent` | Le jeu à proprement parler (header + inventaire + step) |
| `/game-over` | `GameOverComponent` | Affiché automatiquement quand `hophophops` atteint 0 |
| `**` | — | Redirige vers `/welcome` |

## 🎨 DESIGN GÉNÉRAL DE L'APP

Charte graphique : **bleu et or**, sur fond médiéval-fantastique. Toutes les couleurs viennent d'une source unique, `src/app/shared/styles/_colors.scss` :
- `$lumen-blue` (bleu principal), `$lumen-gold` (or), `$abyss-teal` (bordures/texte sombre), `$lumen-violet` et `$lumen-danger` (accents secondaires, ex. cartes du tuto, écran game-over).
- ⚠️ **Ne jamais coder une couleur en dur dans un composant** — toujours `@use '.../shared/styles/colors' as colors;` puis `colors.$lumen-blue` etc. Pour des variations (plus clair/foncé), utiliser `color.scale(colors.$xxx, $lightness: ...)`, jamais une nouvelle valeur hexa ad hoc.
- Motifs visuels établis à réutiliser (ne pas réinventer) : boutons/badges en pilule avec dégradé bleu/or, cartes "parchemin" à bordure colorée (`tuto-card`), fioritures dorées autour d'un titre (`lumen-flourish-heading`), fond de page en dégradé + motif SVG décoratif discret en arrière-plan (fontaine sur `/welcome`, éclair éteint sur `/game-over`).

## 🎨 CONVENTIONS DE CODE

### Philosophie (IMPORTANT)
- **Composants génériques** : privilégier un composant réutilisable et paramétrable (via `@Input()`) plutôt qu'un composant figé pour un seul écran. Exemples : `ButtonComponent` (icône en paramètre), `TutoCardComponent` (icône/couleur/titre/description en paramètre), `IconComponent` (registre d'icônes central).
- **Factorisation** : dès qu'un motif (style, markup, logique) est utilisé à 2 endroits, l'extraire en composant/fonction partagé plutôt que de dupliquer (ex. `FlourishHeadingComponent` factorisé entre `/tuto` et `/game` dès la 2ᵉ utilisation).
- **Variabilisation** : éviter le texte/les couleurs/les valeurs "en dur" dans les templates. Titres, descriptions, couleurs de carte, etc. doivent être des `@Input()` ou des données du composant (ex. le tableau `cards` de `TutoComponent`), pas des chaînes écrites directement dans le HTML.
- **Imbrication de petits composants** : préférer plusieurs petits composants ciblés (icône, carte, bouton, en-tête à fioritures...) composés ensemble, plutôt qu'un gros composant monolithique qui fait tout.

### Composants
- **Standalone** : `standalone: true` obligatoire
- **Selector prefix** : `lumen-` (ex: `lumen-step`, `lumen-button`, `lumen-inventory`)
- **Chaque composant** : 4 fichiers (ts, html, scss, spec.ts)

### Services
- **Injectables** : `providedIn: 'root'`
- **GameService** : État global du jeu (currentStep, florins, hophophops)
- **PlayerService** : Données du joueur actuel

## 🎯 FONCTIONNALITÉS À IMPLÉMENTER

### ✅ Déjà Existents
- API Angular 21 standalone
- Structure de base (services, composants)
- Service Worker PWA configuré

### 🔲 À Développer
- **Énigmes** : Saisie réponses + validation
- **Inventaire UI** : Affichage/achat d'objets (les Florins existent déjà, l'inventaire d'objets reste à faire)
- **Conséquences dynamiques** : Crédibilité impact story
- **Persistance** : localStorage pour sauvegarde partie
- **Contenu du tuto** : `TutoComponent` est vide pour l'instant

### 🔮 Reporté à plus tard
⚠️ Le scope actuel est volontairement réduit : le joueur incarne uniquement **Luce**. Ne pas implémenter ou anticiper les points suivants sans demande explicite :
- **Système à deux joueurs** : Escur (voleur) n'est pas encore jouable
- **Geolocalisation** : Intégration GPS + validation rayon
- **Aptitudes par classe** : Différenciation Luce/Escur
- **Pouvoirs magiques** : Sorts/capacités de Luce (magicienne)

---

## 📊 DONNEES CLÉS

### Monnaie
- **Florins** : Unité de valeur du jeu, démarre à 10
- **Signal** : `GameService.florins` (dérivé de `PlayerStateService.florins`)
- **Variation** : champ `FLO` dans le frontmatter d'un fragment (cf. section Florins & Hophophops)

### Motivation
- **Hophophops** : Points de motivation de Luce, démarre à 10, plancher à 0
- **Signal** : `GameService.hophophops` (dérivé de `PlayerStateService.hophophops`)
- **Variation** : champ `HOP` dans le frontmatter d'un fragment
- **À 0** : redirection automatique vers `/game-over`


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

**CLAUDE.md v2.3 | Maj: 2026-07-26**

