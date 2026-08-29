# 🎮 LUMEN-AQUAE - CONTEXTE POUR ASSISTANTS IA

**Chargé automatiquement par Claude Code en début de session.**

---

## 📌 IDENTITÉ DU PROJET

**Nom** : Lumen-Aquae  
**Type** : WebApp interactive de jeu de piste géolocalisé
**Framework** : Angular 21.1.0 standalone  
**Lieu** : Aix-en-Provence  
**Loc du code** : `C:\Users\fabri\WebstormProjects\lumen-aquae`
**Hébergement** : Vercel — ⚠️ **contrainte produit importante** : l'app doit pouvoir être lancée simplement par un **lien** ou un **QR code** (les joueurs y accèdent depuis leur téléphone, dans la rue). Le lien/QR code renvoie vers **la racine (`/`), qui redirige vers `/welcome`** — jamais directement vers `/game`. Toute évolution (routing, assets, PWA) doit rester compatible avec un accès direct à cette URL racine.

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
- **Personnage récurrent (4e mur)** : Le Fou, un vagabond qui fait le lien entre la fiction (Aethelis) et la réalité historique d'Aix-en-Provence — voir section dédiée plus bas
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
- `src/app/core/services/story-flow/story-flow.service.ts` (`StoryFlowService`) : charge canvas + fragments (RxJS pour le chargement HTTP initial uniquement), construit le graphe (`fragmentsByName`, `outgoingChoices` par fragment, détection du fragment de départ via absence d'arête entrante), expose l'état en **Signals** (`currentFragment`, `canvasLoaded`), et offre une navigation **synchrone** une fois le graphe chargé (`goToFragment(name)`, `submitRiddleAnswer(text)`, `restartStory()` → revient au fragment de départ). Il délègue tout l'état du joueur (Florins, Hopopops, score) à `PlayerStateService` (injecté), sans en connaître le détail.
- `src/app/core/services/player-state/player-state.service.ts` (`PlayerStateService`, anciennement `LuceStateService`) : possède exclusivement l'état du joueur — Signals `florins`/`Hopopops`/`score`, `applyEffects(effects)` (Florins/Hopopops, appliqué par `StoryFlowService.goToFragment()` à chaque fragment atteint), `incrementScore(amount)`/`resetScore()` (score des énigmes, appelés par `submitRiddleAnswer`/`readTrackedVariable`/`resetTrackedVariable`), et `reset()` (remet les trois à leurs valeurs initiales, appelé par `restartStory()`). Voir section Florins & Hopopops ci-dessous.
- `src/app/core/services/game/game.service.ts` (`GameService`) : couche de présentation au-dessus de `StoryFlowService` **et** `PlayerStateService` — mappe `Fragment` → `Step` (`mapFragmentToStep`) et `outgoingChoices`/`answers` → `Choice[]` (`mapFragmentChoices`, c'est ici que le fallback "Continuer" est appliqué).
- Pas de fichier de test pour ces services pour l'instant (demandé explicitement).
- `angular.json` expose désormais `src/app/data/Canvas from 12 07 26`, `src/app/data/FRAGMENTS` et `src/app/data/DIVAGATIONS` comme assets statiques (`/data/...`), sans quoi `HttpClient` recevrait des 404.
- `npm run sync-data` (`scripts/sync-obsidian-data.js`) recopie ces trois dossiers depuis le vault Obsidian (`LUMEN_OBSIDIAN_VAULT`, ou le chemin par défaut codé en dur dans le script) vers `src/app/data/` — à relancer après toute modification côté Obsidian pour que le repo (et donc l'app) reflète le contenu à jour.

✅ **`GameService` (`core/services/game/game.service.ts`) est branché sur `StoryFlowService`/`PlayerStateService`** : il expose `isReady`/`florins`/`Hopopops`/`currentStep`, et délègue la navigation (`goToStep`, `restart`) à `goToFragment`/`submitRiddleAnswer`/`restartStory`. L'ancien prototype statique (`SCENARIO`, `players.luce`/`players.escur`, `sharedFlags`) n'est plus utilisé (fichier `data/scenario.ts` supprimé).

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

### 💰⚡ Florins & Hopopops (ressources de Luce)

Deux compteurs suivent l'état de Luce tout au long du parcours :
- **Florins** : monnaie du jeu (sert à acheter des objets — inventaire pas encore implémenté).
- **Hopopops** : points de motivation. **À 0, c'est le game over** (redirection automatique, cf. plus bas).

Les deux démarrent à **10** (`INITIAL_FLORINS`/`INITIAL_HOPOPOPS` dans `player-state.service.ts`) et sont remis à 10 par `PlayerStateService.reset()` (appelé depuis `restartStory()`, qui remet aussi `score` à 0). Tout l'état du joueur vit dans **`PlayerStateService`** (Florins, Hopopops, **et** `score` — la variable de tracking des énigmes) — `StoryFlowService` se contente d'appeler `playerState.applyEffects(fragment.frontmatter)` à chaque fragment atteint, sans connaître `FLO`/`HOP` autrement que via ce passage.

**Comment les faire varier dans Obsidian** : ajoute (ou complète) le frontmatter JSON d'un fragment avec `FLO` (Florins) et/ou `HOP` (Hopopops) — des **entiers signés** (positif = gain, négatif = perte) :

Exemple (perd 3 Florins et gagne 2 Hopopops en arrivant sur ce fragment) :
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

L'effet s'applique **une fois, dès que le joueur atteint le fragment** (y compris les `RESULT_` traversés automatiquement lors d'une redirection) — cf. `PlayerStateService.applyEffects()`, appelée par `StoryFlowService.goToFragment()` en tout début de méthode. **Ni les Florins ni les Hopopops ne descendent sous 0** (`Math.max(0, ...)`), même avec une valeur `FLO`/`HOP` très négative.

**Game over automatique** : `GameService` observe `playerState.hopopops` via un `effect()` dans son constructeur — dès que la valeur atteint 0, navigation automatique vers `/game-over` (`GameOverComponent`), qui affiche un texte humoristique et un bouton "Retour à l'accueil" (`gameService.restart()` puis navigation vers `/welcome`, pour repartir sur des compteurs propres).

**Affichage** : `PlayerStatusComponent` (`lumen-player-status`, `src/app/features/player-status/`, anciennement `LuceStatusComponent`/`lumen-luce-status`) montre les deux compteurs (icône + chiffre + libellé "Florins"/"Hopopops"), fond doré (`colors.$lumen-gold`). Il est intégré au **centre du header** (`header.component.html`, grille 3 colonnes `1fr auto 1fr` pour un centrage indépendant des largeurs du titre et du bouton retour) — donc visible **uniquement sur `/game`** (là où `lumen-header` est rendu), pas sur `/welcome`/`/tuto`/`/game-over`. Le badge Hopopops pulse en rouge quand il reste ≤ 3 points.

---

## 🃏 LE FOU & LES « DIVAGATIONS DU FOU »

### Concept
**Le Fou** est un vagabond excentrique, personnage récurrent (pas un protagoniste jouable), qui **voit le "4e mur"** : il sait que Luce évolue dans une histoire, et connaît le vrai nom et la vraie histoire des lieux qu'elle traverse (Aethelis = Aix-en-Provence, transposée dans un monde médiéval-fantastique). Personne ne le prend au sérieux — Luce le tolère, lève les yeux au ciel, l'écoute parfois avec une patience amusée, mais ne le croit jamais. Le ressort comique : son discours est **confus, décousu, plein de digressions absurdes**, mais le **contenu factuel qu'il énonce est toujours vrai** (histoire réelle d'Aix-en-Provence) — jamais l'inverse (⚠️ ne jamais lui faire dire quelque chose de faux sur l'histoire réelle de la ville, même noyé dans la confusion).

Son rôle produit : faire le pont entre l'univers imaginaire de Luce et la réalité historique d'Aix-en-Provence, pour donner aux joueurs qui le souhaitent un contenu touristique/historique réel sur les lieux traversés pendant le jeu.

### Première apparition (narrative, validée)
Juste après `Fin_Prologue`, alors que Luce revient vers la Fontaine de la Rotonde (elle doit reprendre son chemin vers chez son oncle Samantis), Le Fou l'aborde pour la première fois. Dialogue encore en cours d'intégration dans Obsidian par l'auteur — cf. `docs/CONTEXTE_HISTOIRE_CLAUDE_MOBILE.md` pour le texte de référence une fois stabilisé, et le dossier `FRAGMENTS/` une fois le(s) fragment(s) créé(s).

### ✅ Mécanique des « Divagations » (implémentée)
Une **Divagation** est un petit contenu historique/touristique réel, associé à un lieu réel croisé dans l'histoire, débloqué quand le joueur atteint un fragment donné.

⚠️ **Convention de nommage** : "Divagation" reste le nom du concept en français (texte narratif, titres de section, UI joueur). Côté technique (noms de classes, fichiers, champs de frontmatter, variables, pseudo-code), on utilise sa traduction anglaise **Rambling** — c'est délibéré, ne pas les faire converger.

**Deux dossiers séparés dans Obsidian, au même niveau que `Canvas from 12 07 26`** :
- `FRAGMENTS/` : comme avant, l'histoire elle-même.
- `DIVAGATIONS/` : une note par divagation, nommée exactement comme son `id` (ex. `fontaine-rotonde.md`). Contenu = un objet JSON `{ "title": "...", "text": "..." }`, avec ou sans les délimiteurs `---` autour (Obsidian a tendance à en rajouter automatiquement via son panneau "Properties" — le parseur gère les deux cas, cf. `splitFrontmatter` réutilisé). Ni `id` (déjà dans le nom de fichier) ni `---{...}---` obligatoire : juste le JSON.

**Frontmatter d'un fragment** : le champ `RAMBLING` (ajouté à `ResourceEffects`, `shared/models/story-flow.model.ts`) est une **chaîne = l'id de la divagation**, pas un objet — disponible sur n'importe quel fragment (`standard`/`riddle`/`routing`), cohabite avec `FLO`/`HOP` dans le même JSON :
```
---
{
  "RAMBLING": "fontaine-rotonde"
}
---
Texte affiché au joueur (inchangé).
```
Et dans `DIVAGATIONS/fontaine-rotonde.md` :
```
{
  "title": "La Fontaine de la Rotonde",
  "text": "Contenu historique réel affiché sur la page « Les divagations du Fou »."
}
```
- L'`id` (nom de fichier) sert de clé de dédoublonnage : si le joueur repasse par un fragment déjà traversé (ou réutilise le même `id` sur un autre fragment), la divagation n'est chargée/ajoutée qu'une seule fois et le compteur n'est pas ré-incrémenté.
- `title` / `text` restent en français, comme tout le texte narratif — seules les clés JSON (`RAMBLING`, `title`, `text`) sont en anglais.

**Architecture** :
- `src/app/core/services/ramblings/ramblings.parser.ts` : `parseRamblingMarkdown(raw, id)` — réutilise `splitFrontmatter` (exporté depuis `story-flow.parser.ts`) pour tolérer un éventuel `---{...}---`, puis `JSON.parse`. Ne lit que `title`/`text` — les images ne passent **jamais** par ce parseur ni par le contenu Obsidian (cf. section dédiée plus bas).
- `src/app/core/services/ramblings/ramblings.service.ts` (`RamblingsService`) : contrairement aux fragments (préchargés via le canvas), les divagations sont chargées **à la demande** — `applyEffects(effects)` lit `effects.RAMBLING` (l'id) et, s'il n'est pas déjà connu ou en cours de chargement (Set `pendingIds`, anti-doublon sur requêtes concurrentes), déclenche un `HttpClient.get` vers `/data/DIVAGATIONS/<id>.md` **en parallèle** (`forkJoin`) d'un fetch du manifest d'images (mis en cache via `shareReplay(1)`, un seul chargement pour toute la session). Une fois les deux résolus : fusion (`withImage()`), ajout à la liste (Signal `ramblings`), incrément du compteur non-lu. Expose aussi `totalCount` (computed), `hasUnread` (computed), `markAllRead()`, `reset()` (vide la liste, le compteur non-lu, **et** `pendingIds`).
- `StoryFlowService.goToFragment()` appelle `ramblings.applyEffects(fragment.frontmatter)` juste après `playerState.applyEffects(...)` — donc une Divagation peut se débloquer sur n'importe quel fragment atteint, y compris un `RESULT_` traversé automatiquement.
- **Reset** : `RamblingsService.reset()` est appelé par `StoryFlowService.restartStory()`, exactement comme `PlayerStateService.reset()` (Florins/Hopopops/score) — donc le bouton **"Retour au début"** (header) et l'écran **Game Over** ("Retour à l'accueil", qui appelle aussi `restart()`) remettent les divagations à zéro (liste vidée, compteur à 0). Naviguer entre routes (ex. ouvrir `/ramblings` puis "Fermer") ne réinitialise rien, les services sont `providedIn: 'root'`. Un rechargement complet de page (F5, URL tapée directement) réinitialise tout l'état par accident, faute de persistance (`localStorage`, toujours pas implémenté — cf. plus bas).
- `GameService` expose `ramblingsCount`, `hasUnreadRambling` et `ramblingsList` (= `RamblingsService.ramblings`, utilisé par la page), et `markRamblingsRead()`.

**UI — icône, compteur, message (dans `HeaderComponent`, visible uniquement sur `/game`)** :
- `FouIconComponent` (`lumen-fou-icon`, `src/app/features/fou-icon/`) : badge circulaire violet avec une icône placeholder (`jester` dans `ICON_REGISTRY` — à remplacer par un vrai portrait du Fou une fois l'asset fourni par l'utilisateur), intégré dans `header-left`. Inputs : `totalCount`, `hasNewRambling`. Cliquer dessus (`onFouIconClick()` dans `header.component.ts`) navigue vers `/ramblings`.
  - Bulle dorée en bas à droite de l'icône = `totalCount` (nombre total de Divagations débloquées depuis le début de la partie ; reste affiché même après lecture).
  - Message « Divagation du Fou disponible ! » à droite de l'icône + halo doré pulsant (`fou-icon-pulse`, masqué sous 400px de large) tant qu'il existe au moins une Divagation **non lue** (`hasNewRambling`).

**UI — page « Les divagations du Fou » (`/ramblings`)** :
- `RamblingsPageComponent` (`lumen-ramblings-page`, `src/app/features/ramblings-page/`) : dans son constructeur, appelle `gameService.markRamblingsRead()` (donc le badge "non lu" s'éteint dès l'ouverture de la page, pas au clic sur l'icône).
- Liste `ramblings()` affichée en **accordéons natifs** (`<details>`/`<summary>`, pas de JS de gestion d'état — un `title`/`text` par item, plus `image`/`imageCredit` si présents : `<img>` avec crédit en `<small>` juste en dessous). Message humoristique si la liste est vide.
- Bouton **"Fermer"** (icône `rewind`, même convention que "Retour" sur `/tuto` ou "Retour à l'accueil" sur `/game-over`) → `router.navigateByUrl('/game')`. L'état du jeu (Florins, Hopopops, position dans l'histoire) est préservé puisque les services sont globaux — ce n'est pas un restart.

### ✅ Images des divagations (implémentée) — jamais via Obsidian

⚠️ **Décision structurante** : l'image et son crédit d'une divagation ne font **jamais** partie du contenu `DIVAGATIONS/<id>.md` sur Obsidian. L'utilisateur a explicitement rejeté cette approche (2026-08-29) — Obsidian doit rester uniquement du texte narratif, sans lui imposer un aller-retour pour chaque image. Tout se passe côté code, par convention de nommage sur l'`id`.

**Mécanisme** :
- `public/divagations/manifest.json` : un seul fichier JSON, maintenu **exclusivement par l'assistant IA** (jamais par sync Obsidian), qui associe un id de divagation à ses métadonnées d'image :
  ```json
  {
    "fontaine-rotonde": {
      "credit": "Photo : Rainbow0413 (Wikimedia Commons, CC BY-SA 3.0)"
    }
  }
  ```
  Type : `RamblingImageManifest` (`shared/models/rambling.model.ts`), entrées `RamblingImageManifestEntry { credit?: string; ext?: string }` — `ext` optionnel, défaut `"jpg"` (permet un format différent si jamais nécessaire).
- Le fichier image lui-même vit dans `public/divagations/<id>.<ext>` (ex. `public/divagations/fontaine-rotonde.jpg`), servi à `/divagations/<id>.<ext>` — même convention que `favicon.ico`/`icons/` dans `public/`.
- `RamblingsService` charge `manifest.json` une seule fois (`imageManifest$`, `shareReplay(1)`) et l'associe automatiquement à chaque divagation débloquée (`withImage()`) : si l'id est présent dans le manifest → `image`/`imageCredit` sont renseignés sur l'objet `Rambling` ; sinon, la divagation s'affiche normalement sans image, aucune erreur.
- ⚠️ **Piège vécu** : si `manifest.json` (ou tout nouveau fichier sous `public/`) est ajouté pendant qu'un `ng serve` tourne déjà, le serveur peut continuer à répondre 404 dessus tant qu'il n'a pas été redémarré — son scan des assets statiques de `public/` peut rester périmé. Redémarrer `npm start` si un fichier fraîchement ajouté à `public/` renvoie 404 en dev.

**Workflow pour ajouter une image** (jamais initié sans validation utilisateur à chaque étape) :
1. Chercher des candidats libres de droits (Wikimedia Commons en priorité — licence claire obligatoire : CC0, CC BY, CC BY-SA, domaine public).
2. Proposer 2-4 candidats à l'utilisateur (description, résolution, licence, lien vers la page Commons) et attendre sa validation explicite avant de télécharger quoi que ce soit.
3. Demander s'il faut créditer et sous quelle forme (sauf licence n'exigeant pas d'attribution).
4. Télécharger dans `public/divagations/<id>.jpg`, mettre à jour `manifest.json`.
5. Vérifier que `npx ng build` passe.

✅ **Skill dédié** : `.claude/skills/add-divagation-image/SKILL.md`, invocable via `/add-divagation-image [id]` — automatise exactement ce protocole en 5 étapes ci-dessus.

### 🔲 Reste à faire (ne pas anticiper sans consigne explicite)
- Le vrai portrait du Fou (asset image à venir côté utilisateur) pour remplacer l'icône SVG placeholder — différent des images de divagations, c'est l'icône du personnage lui-même dans le header.
- Le contenu réel des Divagations (titre/texte) à écrire fragment par fragment au fur et à mesure de l'écriture de l'histoire (cf. `docs/CONTEXTE_HISTOIRE_CLAUDE_MOBILE.md`) — une note dans `DIVAGATIONS/` par lieu réel. Les images, elles, sont gérées séparément via `/add-divagation-image`, pas depuis Obsidian.

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
| `/game` | `GameComponent` | Le jeu à proprement parler (header + step) |
| `/game-over` | `GameOverComponent` | Affiché automatiquement quand `Hopopops` atteint 0 |
| `/ramblings` | `RamblingsPageComponent` | Page "Les divagations du Fou" (accordéons), accessible depuis l'icône du Fou sur `/game`, "Fermer" ramène sur `/game` sans reset |
| `**` | — | Redirige vers `/welcome` |

## 🚀 DÉPLOIEMENT VERCEL

✅ **Le projet est déjà déployé et connecté** : le dashboard Vercel est relié au repo GitHub (`origin` → `JeSuisCaroline/lumen-aquae`), branche `main`. Un simple `git push` sur `main` déclenche automatiquement un build + déploiement en production côté Vercel — pas besoin de la CLI `vercel` au quotidien. Pas de `vercel.json` ni de dossier `.vercel/` dans le repo (config par défaut du preset Angular, suffisante jusqu'ici).

### Procédure (première fois, via le dashboard Vercel)
1. Pousser le repo sur GitHub/GitLab/Bitbucket (Vercel se connecte à un repo Git, pas à un dossier local).
2. Sur [vercel.com](https://vercel.com) → **Add New** → **Project** → importer le repo `lumen-aquae`.
3. Vercel détecte Angular automatiquement (**Framework Preset: Angular**). Vérifier/ajuster si besoin :
   - **Build Command** : `npm run build` (= `ng build`, config `production` par défaut)
   - **Output Directory** : `dist/lumen-aquae/browser` (⚠️ à cause de `outputMode: "static"` dans `angular.json`, il n'y a **pas** de bundle serveur à déployer — seul le contenu statique de `browser/` compte)
   - **Install Command** : `npm install` (défaut)
4. Déployer → Vercel fournit une URL de production stable (`https://lumen-aquae.vercel.app` ou domaine personnalisé).

### Alternative en CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```
Vercel détecte aussi automatiquement le projet Angular dans ce cas.

### Point d'attention : routing côté client
L'app utilise le routing Angular (`/welcome`, `/tuto`, `/game`, `/game-over`, `/ramblings`) — un accès direct ou un rechargement sur une de ces URLs doit renvoyer `index.html` (sinon 404 côté serveur). Le preset Angular de Vercel gère normalement ça nativement ; si ce n'est pas le cas, ajouter un `vercel.json` à la racine :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
**Toujours vérifier ce point après un déploiement** : ouvrir directement l'URL racine (`/`, celle utilisée par le lien/QR code partagé aux joueurs) plutôt que de naviguer depuis une autre page, et confirmer qu'elle charge bien `/welcome` plutôt qu'une 404. Le lien/QR code ne doit **jamais** pointer vers `/game` ou une autre route interne — toujours vers la racine.

### ⚠️ Service Worker (PWA) : pourquoi "j'ai déployé mais je ne vois pas le changement" est normal

L'app enregistre un Service Worker en production (`app.config.ts` → `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() })`, désactivé en dev). Sa config (`ngsw-config.json`) précache **agressivement** (`installMode: "prefetch"`) tout le JS/CSS/`index.html` dès la première visite — donc un navigateur qui a déjà ouvert l'app une fois continue de servir cette version tant que le SW n'a pas basculé sur la nouvelle, même après un rechargement classique.

⚠️ **Piège à connaître pour le debug/QA** : les patterns de `ngsw-config.json` (`svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2` pour le groupe `"assets"`, JS/CSS/HTML pour `"app"`) ne couvrent **pas** les fichiers `.md` de `data/FRAGMENTS/`/`data/DIVAGATIONS/` — ceux-ci sont de simples requêtes `HttpClient`, jamais mis en cache par le SW. Résultat typique observé : après un déploiement, le **contenu narratif** (nouveaux fragments/divagations) apparaît instantanément, alors que le **code applicatif** (nouveaux composants/écrans) reste bloqué sur l'ancienne version. Ce n'est pas un déploiement raté — c'est le Service Worker qui sert encore l'ancien bundle JS depuis son cache.
- Pour vérifier qu'un déploiement est réellement live : ouvrir le site en **navigation privée** (pas de SW préexistant), ou DevTools → Application → Service Workers → *"Update on reload"* + rechargement forcé (Ctrl+Shift+R — dans la plupart des navigateurs, un rechargement forcé contourne le SW actif pour cette navigation-là).

✅ **Mise à jour automatique implémentée** : `AppUpdateService` (`src/app/core/services/app-update/app-update.service.ts`) s'abonne à `SwUpdate.versionUpdates`, filtre l'événement `VERSION_READY`, puis appelle `activateUpdate()` suivi d'un `document.location.reload()`. Câblé une seule fois, dans le constructeur d'`AppComponent` (`appUpdate.listenForUpdates()`). No-op silencieux si `swUpdate.isEnabled` est faux (donc rien ne se passe en dev).

⚠️ **Choix assumé : rechargement 100% silencieux, sans bandeau de confirmation au joueur** — décision explicite de l'utilisateur (2026-08-29), en attendant l'implémentation d'un système de sauvegarde automatique (`localStorage`, cf. "🎯 FONCTIONNALITÉS À IMPLÉMENTER" → "Persistance", toujours pas fait). **Tant que cette sauvegarde n'existe pas, ce reload silencieux peut faire perdre la progression en cours** (Florins, Hopopops, position dans l'histoire, divagations débloquées — tout est en mémoire, rien n'est persisté) si une mise à jour est détectée en pleine partie. Ne pas "corriger" ça de sa propre initiative en ajoutant un bandeau de confirmation sans redemander — c'est un choix conscient, pas un oubli. En revanche, **le jour où la sauvegarde auto est implémentée, s'assurer qu'elle s'écrit avant (ou indépendamment de) ce reload**, pour que le silencieux redevienne réellement sans risque.

## 🎨 DESIGN GÉNÉRAL DE L'APP

Charte graphique : **bleu et or**, sur fond médiéval-fantastique. Toutes les couleurs viennent d'une source unique, `src/app/shared/styles/_colors.scss` :
- `$lumen-blue` (bleu principal), `$lumen-gold` (or), `$abyss-teal` (bordures/texte sombre), `$lumen-violet` et `$lumen-danger` (accents secondaires, ex. cartes du tuto, écran game-over).
- ⚠️ **Ne jamais coder une couleur en dur dans un composant** — toujours `@use '.../shared/styles/colors' as colors;` puis `colors.$lumen-blue` etc. Pour des variations (plus clair/foncé), utiliser `color.scale(colors.$xxx, $lightness: ...)`, jamais une nouvelle valeur hexa ad hoc.
- Motifs visuels établis à réutiliser (ne pas réinventer) : boutons/badges en pilule avec dégradé bleu/or, cartes "parchemin" à bordure colorée (`tuto-card`), fioritures dorées autour d'un titre (`lumen-flourish-heading`), fond de page en dégradé + motif SVG décoratif discret en arrière-plan (fontaine sur `/welcome`, éclair éteint sur `/game-over`).

⚠️ **`FlourishHeadingComponent`/`TitleComponent` sont partagés entre des pages à besoins de hauteur très différents** (`/welcome`, `/tuto`, `/game-over`, `/ramblings` : hauteur naturelle au contenu ; `/game` : doit grandir pour remplir l'espace dispo et laisser le texte défiler en interne, cf. `step.component.scss`). La croissance se fait **uniquement via `flex: 1 1 auto` accordé par le composant consommateur** sur le tag hôte (ex. `lumen-flourish-heading { flex: 1 1 auto; min-height: 0; }` dans `step.component.scss`) — **jamais via un `height: 100%` écrit dans le composant partagé lui-même** : un `height: 100%` sur `:host`/`.flourish-heading` a déjà cassé silencieusement le rendu de `/tuto` (page blanche) la première fois, un contexte flex sans croissance externe le résout de façon imprévisible plutôt que de simplement l'ignorer.

## 🎨 CONVENTIONS DE CODE

### Philosophie (IMPORTANT)
- **Composants génériques** : privilégier un composant réutilisable et paramétrable (via `@Input()`) plutôt qu'un composant figé pour un seul écran. Exemples : `ButtonComponent` (icône en paramètre), `TutoCardComponent` (icône/couleur/titre/description en paramètre), `IconComponent` (registre d'icônes central).
- **Factorisation** : dès qu'un motif (style, markup, logique) est utilisé à 2 endroits, l'extraire en composant/fonction partagé plutôt que de dupliquer (ex. `FlourishHeadingComponent` factorisé entre `/tuto` et `/game` dès la 2ᵉ utilisation).
- **Variabilisation** : éviter le texte/les couleurs/les valeurs "en dur" dans les templates. Titres, descriptions, couleurs de carte, etc. doivent être des `@Input()` ou des données du composant (ex. le tableau `cards` de `TutoComponent`), pas des chaînes écrites directement dans le HTML.
- **Imbrication de petits composants** : préférer plusieurs petits composants ciblés (icône, carte, bouton, en-tête à fioritures...) composés ensemble, plutôt qu'un gros composant monolithique qui fait tout.

### Composants
- **Standalone** : `standalone: true` obligatoire
- **Selector prefix** : `lumen-` (ex: `lumen-step`, `lumen-button`, `lumen-fou-icon`)
- **Chaque composant** : 4 fichiers (ts, html, scss, spec.ts)

### Services
- **Injectables** : `providedIn: 'root'`
- **GameService** : État global du jeu (currentStep, florins, Hopopops)
- **PlayerService** : Données du joueur actuel

## 🎯 FONCTIONNALITÉS À IMPLÉMENTER

### ✅ Déjà Existents
- API Angular 21 standalone
- Structure de base (services, composants)
- Service Worker PWA configuré

### 🔲 À Développer
- **Énigmes** : Saisie réponses + validation
- **Inventaire UI** : Affichage/achat d'objets (les Florins existent déjà, l'inventaire d'objets reste à faire). ⚠️ L'ancien placeholder `InventoryComponent`/`lumen-inventory` (un `<div>` vide affiché entre le header et l'encadré du fragment sur `/game`) a été supprimé — vide visuellement mais toujours stylé, il ressemblait à un bandeau gris parasite. Rien ne réserve donc plus d'emplacement pour l'inventaire dans l'UI actuelle ; son futur emplacement est à décider au moment de l'implémenter, pas forcément à cet endroit-là.
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
- **Variation** : champ `FLO` dans le frontmatter d'un fragment (cf. section Florins & Hopopops)

### Motivation
- **Hopopops** : Points de motivation de Luce, démarre à 10, plancher à 0
- **Signal** : `GameService.hopopops` (dérivé de `PlayerStateService.hopopops`)
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

**CLAUDE.md v3.2 | Maj: 2026-08-29**

