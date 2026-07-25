# 🎮 Lumen-Aquae
**POC - Jeu de Piste Géolocalisé à Deux Joueurs en Angular**
Lumen-Aquae est une webapp interactive proposant une aventure dont vous êtes le héros, inspirée des jeux de rôle français. Deux joueurs (Luce et Escur) vivent des histoires parallèles mais entrecroisées à Aix-en-Provence, avec énigmes, inventaire, système de monnaie et geolocalisation.
---
## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Installation](#installation)
- [Architecture](#architecture)
- [Développement](#développement)
- [Pour les Assistants IA](#pour-les-assistants-ia)
---
## 👀 Vue d'ensemble
### Concept
- **Deux joueurs** : Luce (magicienne) et Escur (voleur)
- **Arborescence narrative** : Chaque joueur a sa propre progression ; la structure initiale est dans le canvas (en cours de développement)
- **Énigmes** : prototypes prévus (le design narratif est encore à définir)
- **Système d'inventaire** : Objets, argent (Florins), aptitudes par classe
- **Geolocalisation** : Intégration possible pour valider la position des joueurs
### Structure narrative
Voir le canvas complet : `src/app/data/Toute l'histoire.canvas`
Le scénario est en cours de construction ; la documentation évite pour l'instant d'énumérer des points narratifs détaillés.
---
## 💻 Installation
@bash
# Cloner le projet
git clone <url-du-repo>
cd lumen-aquae
# Installer les dépendances
npm install
# Lancer en développement
npm start
# Tests
npm test
npm test:ui
# Build
npm run build
@
### Prérequis
- Node.js 20.17.19+
- npm 10.9.0+
- TypeScript 5.9.2+
---
## 🏗️ Architecture
### Stack technique
- **Framework** : Angular 21.1.0 (standalone components)
- **Language** : TypeScript 5.9.2
- **Testing** : Vitest 4.0.8
- **PWA** : Angular Service Worker + manifest
- **Styling** : SCSS
### Structure des fichiers
@bash
src/app/
├── core/
│   ├── guards/          # Route guards
│   ├── routing/         # Configuration routage
│   └── services/
│       ├── game/        # Gestion état du jeu
│       ├── game-engine/ # Logique énigmes
│       ├── player/      # Données joueur
│       └── storage/     # Persistance
├── features/            # Pages/écrans du jeu
│   ├── inventory/       # Inventaire
│   ├── map/            # Carte + geolocation
│   ├── player/         # Profil joueur
│   └── step/           # Étape actuelle (UI principale)
├── shared/
│   ├── models/         # Interfaces TypeScript
│   ├── pipes/          # Pipes personnalisés
│   └── ui/             # Composants réutilisables
├── data/
│   └── scenario.ts     # Arborescence du jeu
└── app.component.ts    # Root component
@
### Convention de nommage
- **Sélecteurs de composants** : préfixe lumen- (ex: \lumen-button\, \lumen-step\)
- **Composants** : Tous standalone (\standalone: true\)
- **Services** : Injectables providedIn 'root'
---
## 🚀 Développement
### Scripts disponibles
@bash
npm start                # Serveur dev (http://localhost:4200)
npm run build            # Build production
npm run watch            # Build en mode watch
npm test                 # Lancer les tests
npm test:ui              # Tests avec interface UI
npm test:coverage        # Rapport de couverture
npm run serve:ssr:lumen-aquae  # SSR local
@
### Commandes utiles
@bash
ng serve                 # Dev server
ng build                 # Production build
ng generate component features/nom  # Genérer un composant
@
---
## 🤖 Pour les Assistants IA
⚠️ **IMPORTANT** : Le fichier `CLAUDE.md` à la racine contient le contexte du projet et est chargé automatiquement par Claude Code en début de session (aucun copier-coller manuel nécessaire).
### Informations clés à retenir
- 🎮 **POC** : Jeu 2 joueurs (Luce & Escur)
- 🏛️ **Lieu** : Aix-en-Provence
- 📜 **Structure narrative** : Voir canvas "Toute l'histoire.canvas"
- 🔑 **Monnaie** : Florins
- 📍 **Technologie clé** : Geolocalisation
- 🎨 **Prefix components** : `lumen-`
---
## 📞 Contact & Contribution
Pour contacter l'équipe ou contribuer, reportez-vous aux directives du projet.
---
**Dernière mise à jour** : Mai 2026  
**Version** : 0.0.0 (POC)
