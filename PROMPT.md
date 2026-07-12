# 🎮 LUMEN-AQUAE - CONTEXTE POUR ASSISTANTS IA

**À initialiser une fois par session de travail**

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
La structure narrative initiale est décrite dans `src/app/data/L'histoire.canvas`. Le scénario est encore en développement : évitez les détails factuels dans la documentation tant que le contenu n'est pas stabilisé. Le nom du fichier .canvas peut évoluer.

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
- **Geolocalisation** : Intégration GPS + validation rayon
- **Inventaire UI** : Affichage items + Florins
- **Système classes** : Aptitudes différentes par joueur
- **Conséquences dynamiques** : Crédibilité impact story
- **Persistance** : localStorage pour sauvegarde partie

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

Si je perds le contexte :
```
Je dois relire mon PROMPT.md, réapplis-le svp au complet.
```

**PROMPT v1.0 | Maj: 2026-05-01**

