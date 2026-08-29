# 📖 LUMEN-AQUAE — CONTEXTE HISTOIRE (pour Claude mobile / Project)

**À coller dans les instructions personnalisées ou la "knowledge" d'un Project Claude.ai dédié à l'écriture de l'histoire.**
**Ce fichier est un extrait dérivé de `CLAUDE.md` (racine du repo) + le contenu narratif actuellement écrit dans Obsidian.**
**⚠️ À re-uploader manuellement quand le canvas ou les fragments évoluent — ce fichier est une photo figée, pas une source vivante.**

---

## 🎯 RÔLE DE CETTE CONVERSATION

Cette conversation est consacrée à **l'architecture et l'écriture de l'histoire** de Lumen-Aquae (jeu de piste géolocalisé à Aix-en-Provence, arborescence à la "Livre dont vous êtes le héros"). Elle ne sert PAS à écrire du code Angular — pour ça, l'autre session (Claude Code, dans l'IDE) a le contexte technique complet du projet.

Ton rôle ici : aider à concevoir la suite de l'histoire (nouveaux fragments, embranchements, énigmes, effets Florins/Hopopops), en respectant strictement le **format d'auteuring** utilisé dans Obsidian (détaillé ci-dessous), pour que le contenu produit soit directement copiable dans un fichier `.md` du dossier `FRAGMENTS/` du projet.

⚠️ **Ne jamais inventer de faits narratifs qui contrediraient ce qui est déjà écrit ci-dessous** (noms, personnalités, événements passés). En revanche, tout ce qui n'est pas encore écrit (la suite après le prologue) est ouvert à proposition — c'est justement l'objet de cette conversation.

---

## 🎭 TON DE L'HISTOIRE

Le ton recherché est **humoristique, avec de l'humour absurde**, mais **jamais farfelu ou incohérent au point de casser la crédibilité du monde**. La nuance est importante :

- ✅ **Humour absurde qui reste ancré** : un détail insolite, précis et assumé, qui contraste avec le sérieux de la situation autour — mais qui ne change rien à la cohérence de l'univers. Exemples déjà posés dans le prologue :
  - Les **Hopopops** : nommer des "points de motivation" avec un mot volontairement ridicule, sans jamais expliquer ou justifier le nom dans le texte (l'absurde fonctionne parce qu'il n'est pas commenté).
  - Luce qui s'est **brûlée en faisant léviter une cuillère** qui a fini dans sa soupe : un pouvoir magique dérisoire raconté avec des détails très concrets et un peu ridicules, plutôt qu'un vague "elle n'est pas très douée".
  - Les mauvaises réponses aux énigmes des statues ("Le Culte de la Sardine Qui Bouche le Port", "La Passion du Calisson") : de l'absurde local, cantonné aux choix du joueur, qui ne contredit rien du monde établi.
  - La mission de Luce elle-même (traverser une ville entière pour une potion... de fertilisant à radis) : un enjeu volontairement dérisoire à côté d'un cadre médiéval-fantastique qui, lui, reste pris au sérieux.
- ❌ **Ce qu'il faut éviter** : de l'absurde qui casse la logique interne du monde ou des personnages (un objet qui apparaît sans raison, un personnage qui change de personnalité pour une blague, une règle du moteur détournée juste pour un gag, une incohérence avec un fragment déjà écrit). L'humour vient du **décalage** (un petit enjeu traité avec sérieux, un mot ridicule pris au premier degré, l'auto-dérision des personnages) et jamais de l'arbitraire.
- Le monde d'Aethelis, ses gardes, ses lieux et ses enjeux (crédibilité de l'alibi, arrestation possible, argent, motivation) doivent rester **cohérents et pris au sérieux par les personnages eux-mêmes** — c'est justement ce sérieux des personnages face à des enjeux dérisoires (des radis, une cuillère, des statues) qui crée le comique. Si les personnages se moquaient eux-mêmes de l'absurdité de leur monde, l'effet tomberait à plat.
- Repère pratique avant de proposer un nouveau fragment : si l'idée fonctionnerait aussi bien dans un sketch complètement déconnecté de l'univers (sans référence à Aethelis, Luce, Escur, Florins/Hopopops), c'est probablement trop farfelu — ancrer la blague dans un détail spécifique et déjà cohérent du monde.
- **Registre spécifique au Fou** (nouveau personnage, voir plus bas) : son humour ne vient pas d'un décalage sérieux/dérisoire comme les autres exemples ci-dessus, mais d'un **décalage entre la forme et le fond** — son discours est confus, décousu, plein de digressions (la forme), mais **le contenu factuel qu'il énonce sur le monde réel est toujours exact** (le fond). Il ne faut jamais inverser les deux : la confusion est dans la manière de parler, jamais dans la véracité de ce qu'il dit sur l'histoire réelle d'Aix-en-Provence.

---

## 🔄 PIPELINE : D'OBSIDIAN À L'HISTOIRE JOUABLE

Le flux de production est en deux temps bien séparés :

1. **Auteuring dans Obsidian** — Le fichier `.canvas` sert de tableau blanc visuel : chaque node représente un fragment de l'histoire (relié à son fichier `.md` via `[[NomDuFragment]]`), et chaque flèche (edge) entre deux nodes représente un embranchement possible. C'est ici qu'on dessine l'arborescence à la souris, qu'on écrit le texte de chaque fragment, et qu'on labellise les flèches pour nommer les choix.
2. **Parsing par l'application Angular au runtime** — Le `.canvas` et tous les `.md` de `FRAGMENTS/` sont servis comme **assets statiques** (déclarés dans `angular.json`) et récupérés via `HttpClient` au chargement de l'app. `story-flow.parser.ts` transforme le JSON du canvas + le frontmatter JSON de chaque fragment en objets (`CanvasDocument`, `Fragment`, `RiddleFrontmatter`, `RoutingFrontmatter`...). `story-flow.service.ts` (`StoryFlowService`) reconstruit ensuite le **graphe** à partir de ça : pour chaque fragment, il calcule ses `outgoingChoices` (les flèches sortantes du canvas, avec leur `label` éventuel), détecte le fragment de départ (celui sans arête entrante), et expose l'état courant en Signals. `GameService` traduit enfin ce graphe en `Step`/`Choice` affichés au joueur, et gère la navigation (`goToFragment`, `submitRiddleAnswer`, `restartStory`) à chaque clic.

**Conséquence concrète pour l'écriture de l'histoire** : il n'y a **aucune étape de compilation/build spécifique au contenu** — dès qu'un fragment `.md` est ajouté/modifié et que le `.canvas` est mis à jour dans Obsidian (nouveau node + nouvelle flèche), l'app le reflète directement au prochain chargement, sans changement de code. Ça veut dire aussi que **toute rigueur de nommage compte** : le nom du node dans le canvas (`[[NomDuFragment]]`) doit correspondre exactement au nom du fichier `.md` (sans l'extension), et chaque `destination` dans un frontmatter `riddle`/`routing` doit correspondre exactement à un nom de fragment existant — une faute de frappe casse silencieusement le lien (le moteur ne "invente" rien, il route sur des chaînes de caractères).

## 🧩 MÉCANIQUE DU MOTEUR NARRATIF (format d'auteuring Obsidian)

Le parcours est conçu visuellement dans **Obsidian** :
- Un fichier `.canvas` (JSON natif Obsidian : `nodes`/`edges`) contient l'arborescence. Chaque node pointe vers un fragment via `[[NomDuFragment]]`. Les edges relient les nodes pour représenter les embranchements.
- Chaque fragment est un fichier `.md` séparé (un fichier = une "page" du livre-jeu).

### Trois types de fragments (`kind`)

| Type | Préfixe fichier | Rôle |
|---|---|---|
| `standard` | (aucun) | Texte narratif simple ; les choix du joueur = les fragments sortants du canvas (edges) |
| `riddle` | `RIDDLE_` | Énigme posée au joueur, plusieurs réponses possibles |
| `routing` | `RESULT_` | Redirection automatique (sans interaction joueur) selon une variable trackée |

### Format frontmatter (JSON entre `---`)

**Fragment standard** : pas de frontmatter obligatoire, ou juste `FLO`/`HOP` (voir plus bas).

**Fragment riddle** :
```
---
{
  "type": "riddle",
  "question": "Intitulé de la question",
  "answers": [
    { "text": "Réponse proposée", "destination": "NomFragmentSuivant", "increment": 0 },
    { "text": "Bonne réponse", "destination": "AutreFragment", "increment": 1 }
  ]
}
---
Texte affiché au joueur (peut reprendre la question).
```
Chaque réponse porte sa **destination** (nom du fragment cible, n'importe lequel — pas de convention `_OK`/`_KO` obligatoire même si c'est ce qui est utilisé dans le prologue) et son **increment** (valeur ajoutée à la variable `score`, n'importe quel nombre, absent = +0).

**Fragment routing** :
```
---
{
  "type": "routing",
  "variable_to_test": "score",
  "branches": [
    { "condition": "0", "destination": "NomFragmentSiScore0" },
    { "condition": "1", "destination": "NomFragmentSiScore1" }
  ]
}
---
```
⚠️ **`score` est remis à 0 automatiquement dès qu'un fragment `RESULT_` a trouvé sa branche et redirigé le joueur.** Ça permet de réutiliser `score` pour un groupe d'énigmes suivant (il repart de zéro), mais on ne peut donc pas lire le score cumulé d'un groupe après son verdict — un nouveau groupe d'énigmes redémarre toujours de zéro.

### Choix multiples sur un fragment `standard` → labels des flèches

Pour un fragment `standard` avec plusieurs flèches sortantes (vraie bifurcation), **chaque flèche doit être labellisée dans Obsidian** (clic droit sur la flèche → "Add label"). Le label devient le texte du bouton de choix affiché au joueur. **Sans label, le bouton affiche "Continuer" par défaut** — donc si deux flèches sortent d'un même fragment sans label, les deux boutons afficheront "Continuer" et le joueur ne pourra pas distinguer les choix. Toujours penser à labelliser dès qu'il y a une vraie bifurcation narrative (pas juste un enchaînement linéaire).

### Emphase dans le texte

Le corps du fragment (pas le titre) interprète :
- `**texte**` → gras
- `*texte*` ou `_texte_` → italique

C'est une regex simple, pas un vrai parseur markdown — pas de listes, liens, etc.

### 💰⚡ Florins & Hopopops

Deux compteurs suivent l'état de Luce (la seule protagoniste jouable actuellement — voir Scope plus bas) :
- **Florins** : monnaie du jeu.
- **Hopopops** : points de motivation. **À 0 → game over automatique.**

Démarrent tous deux à **10**. On les fait varier sur **n'importe quel fragment** (standard, riddle, routing) via le frontmatter :
```
---
{
  "FLO": -3,
  "HOP": 2
}
---
Texte affiché au joueur.
```
`FLO`/`HOP` sont des entiers signés, optionnels et indépendants, appliqués **une fois** dès que le joueur atteint le fragment (y compris les `RESULT_` traversés automatiquement). Aucun des deux ne descend sous 0.

### Ce qui n'est PAS encore implémenté (ne pas écrire de contenu qui en dépend)
- Inventaire d'objets (les Florins existent, mais rien à acheter pour l'instant)
- Escur jouable / système à deux joueurs
- Géolocalisation réelle (validation de rayon GPS)
- Aptitudes/pouvoirs magiques différenciés

---

## 🏙️ UNIVERS & PERSONNAGES

- **Lieu** : Aethelis, la "Cité aux cent fontaines" (calque fantastique d'Aix-en-Provence — Viana = Avignon, Massalia-Port = Marseille).
- **Luce** : magicienne débutante, protagoniste jouable. Vient d'un village, en visite à Aethelis pour récupérer une **potion de pousse-pousse** chez son oncle Samantis (mission de sa famille : sauver la récolte de radis du potager). Son sort le plus impressionnant à ce jour : faire léviter une cuillère 3 secondes. Ton d'auto-dérision, pas du tout une héroïne épique — elle-même s'étonne d'être "l'héroïne".
- **Escur** : jeune voleur, rencontré au prologue. Charmeur, désinvolte, doué en escalade urbaine ("spécialiste en redistribution de richesse mal surveillée"). Sauve Luce en inventant un alibi d'étudiants en architecture. Surnomme Luce "Luce aux Radis" / "magicienne des potagers". Repart en escaladant les toits à la fin du prologue, laissant entendre qu'ils se reverront. **Pas encore jouable** (scope actuel = Luce uniquement).
- **Le Capitaine des gardes** : armoire à glace chauve, cuirasse brillante, voix de basse. Piège Luce et Escur avec un test de culture sur les statues de la fontaine (Les Trois Grâces d'Aethelis) pour valider ou non leur alibi d'étudiants.
- **Le Fou** : vagabond excentrique, personnage récurrent (pas jouable), rencontré pour la première fois juste après le prologue. Il **voit le "4e mur"** : il sait que Luce est dans une histoire, et connaît le vrai nom et la vraie histoire des lieux qu'elle traverse (Aethelis = Aix-en-Provence). Personne ne le prend au sérieux — Luce le tolère avec un mélange d'agacement et d'amusement, mais ne le croit jamais. Sert de **pont entre la fiction et la réalité historique d'Aix-en-Provence** : à travers ses interventions, le joueur peut apprendre du contenu touristique/historique réel sur les lieux traversés. Voir section dédiée plus bas pour le détail du personnage et sa première rencontre.

---

## 🗺️ CE QUI EST DÉJÀ ÉCRIT : LE PROLOGUE (état actuel du canvas)

Schéma du flux (nom technique du fragment → nom technique du fragment) :

```
Présentation de Luce
  → Confrontation avec la garde de la ville
    → Statue_1                                    [label flèche : "Le défi du Capitaine"]
      → RIDDLE_Statue_1
        → Statue_1_KO  ─┐
        → Statue_1_OK  ─┴→ Statue_2
                            → RIDDLE_Statue_2
                              → Statue_2_KO ─┐
                              → Statue_2_OK ─┴→ Statue_3
                                                → RIDDLE_Statue_3
                                                  → Statue_3_OK ─┐
                                                  → Statue_3_KO ─┴→ RESULT_Avant_verdict_sergent
                                                                     (routing sur `score`, 3 énigmes cumulées, 0 à 3 points)
                                                                     → score 0 → Résultat_Enigmes_statues_LVL0 "Crédibilité nulle"
                                                                     → score 1 → Résultat_Enigmes_Statues_LVL1 "Crédibilité critique"  (HOP -2, FLO -5)
                                                                     → score 2 → Résultat_Enigmes_Statues_LVL2 "Crédibilité fragile"   (FLO -3)
                                                                     → score 3 → Résultat_Enigmes_Statues_LVL3 "Crédibilité totale"     (HOP +2)
                                                                     → (les 4 branches convergent vers) Fin_Prologue
```

Remarque structurelle : les 3 énigmes de statues sont indépendantes du choix "bonne/mauvaise réponse" pour la suite immédiate (`_OK`/`_KO` mènent tous les deux vers la statue suivante) — c'est le **score cumulé des 3 réponses** qui détermine, à la toute fin, laquelle des 4 conclusions le joueur reçoit (`RESULT_Avant_verdict_sergent`). Autrement dit : le joueur avance toujours dans la même trame linéaire pendant les 3 énigmes, sans jamais savoir combien de points il a — le verdict tombe d'un coup à la fin.

### Résumé de l'intrigue du prologue

1. **Présentation de Luce** — Luce arrive à Aethelis pour une course anodine (potion pour les radis du potager familial).
2. **Confrontation avec la garde de la ville** — Un gamin des rues glisse une broche volée dans le sac de Luce en fuyant la milice. Prise en flagrant délit apparent, elle est sauvée in extremis par Escur, inconnu qui invente un alibi d'étudiants en architecture. Le Capitaine des gardes, sceptique, propose un marché : 3 questions sur la symbolique des statues de la fontaine (Les Trois Grâces d'Aethelis) pour valider l'alibi.
3. **3 énigmes (Statue_1/2/3 + RIDDLE_)** — Chaque statue regarde une route différente (Viana/Avignon, Massalia-Port/Marseille, Aethelis/Aix) et symbolise quelque chose (réponses correctes : Les Beaux-Arts / Le Commerce et l'Agriculture / La Justice). Les mauvaises réponses proposées sont volontairement absurdes et humoristiques ("Le Culte de la Sardine Qui Bouche le Port", "La Passion du Calisson"...).
4. **Verdict (RESULT_Avant_verdict_sergent → 4 issues possibles)** — Selon le score cumulé (0 à 3 bonnes réponses), le sergent laisse filer Luce et Escur sans frais (score 3, +2 Hopopops), leur fait payer une amende croissante (score 2 : -3 Florins ; score 1 : -5 Florins ET -2 Hopopops), ou les arrête pour de bon (score 0 — fin bloquante, aucune variation FLO/HOP car le joueur est emmené en prison).
5. **Fin_Prologue** — Une fois libérés (échappent à l'arrestation), Luce et Escur se retrouvent dans une ruelle. Dialogue de présentation mutuelle : Luce se présente, Escur se présente et se révèle être "un deuxième voleur". Ton complice, taquin, plein d'auto-dérision côté Luce ("Luce aux Radis"). Escur s'éclipse en escaladant les toits, laissant entendre qu'ils se reverront à Aethelis. Fin du prologue.

**Ton général** : léger, humoristique, auto-dérision assumée (pas de grand destin héroïque), dialogues enlevés entre Luce et Escur, tension ponctuelle (arrestation, énigmes) retombant vite dans la complicité/l'humour.

⚠️ Le dossier `FRAGMENTS/old/` contient d'anciens fragments (structure Luce/Escur séparée) **abandonnée**, non utilisée par le moteur actuel — ne pas s'en inspirer comme continuité canon.

### Texte intégral des fragments déjà écrits (canon exact, pour le ton et les voix)

**Présentation de Luce**
> Félicitations, tu es **Luce**.
>
> Alors, on calme tout de suite les attentes : tu n'es pas la descendante d'une lignée de prophètes, et tu n'as pas de destin flamboyant qui t'attend au tournant d'un vieux grimoire. Tu es une **magicienne débutante**. Ton plus grand exploit à ce jour ? Avoir réussi à faire léviter une cuillère pendant trois secondes (elle a fini par retomber dans ta soupe, et tu t'es brûlée).
>
> Te voilà donc débarquant à **Aethelis**, la fameuse « Cité aux cent fontaines ». Tout le monde trouve ça romantique, toi tu trouves surtout que ça fait beaucoup d'endroits où se mouiller les pieds. Pourquoi es-tu là ? Pour sauver le monde ? Non. Pour venger un ancêtre ? Toujours pas.
>
> Tu es venue chercher une **potion de pousse-pousse** chez ton oncle Samantis. Tes parents ont décidé que, quitte à avoir une magicienne dans la famille, autant qu'elle serve à quelque chose d'utile : sauver la récolte de radis du potager familial qui fait la tête cette année.
>
> Tu traverses donc la ville avec ton sac de voyage trop lourd, tes bottes qui grincent et une sérieuse envie de lever les yeux au ciel à chaque fois qu'un habitant vante la « splendeur de l'architecture ». Tu n'as qu'une hâte : récupérer cette fiole de fertilisant magique, repartir au plus vite et ne plus jamais entendre parler de jardins ou de statues.
>
> Malheureusement, il semblerait que le destin (ou ta malchance légendaire) ait d'autres projets pour toi.

**Confrontation avec la garde de la ville**
> Alors que tu t'apprêtais à t'assoir sur le rebord de pierre de la grande fontaine pour prendre du repos, un gamin des rues, rapide comme l'éclair et poursuivi par des coups de sifflet stridents, fonce droit sur toi. Dans sa course, avec une dextérité effrayante, il glisse un objet lourd et brillant directement dans la poche ouverte de ton sac de voyage. Le temps que tu réalises, le gosse s'est déjà volatilisé dans la foule.
>
> Prise d'un mauvais pressentiment, tu plonges les doigts dans ton sac et en sort... une broche en or massif, incrustée de saphirs, qui hurle le vol à la tire à plein nez. Manque de chance intersidérale : tu te redresses, le bijou brandi bien en évidence au-dessus de ta tête, pile au moment où une patrouille de la milice déboule sur la place.
>
> Le Capitaine des gardes, un armoire à glace dont la cuirasse luit autant que son crâne chauve, s'arrête net devant toi, le regard fixé sur tes mains. — « Eh bien, eh bien... En flagrant délit de recel, » tonne-t-il d'une voix de basse. « Ton complice coure vite, petite, mais toi, tu manques singulièrement de pratique. »
>
> Le sang ne fait qu'un tour dans tes veines. Tu bafouilles, tu tentes d'expliquer l'histoire du gamin invisible, mais ta voix déraille. Tu as l'air coupable et tes arguments ont autant de poids qu'un radis flétri. Tu vois déjà les portes du donjon se refermer sur toi.
>
> C'est alors qu'un bras se pose familièrement sur tes épaules. Un jeune homme au sourire un peu trop tranquille et aux vêtements usés mais ajustés s'immisce entre toi et la milice.
>
> — « Allons, mon Capitaine, ne vous emballez pas ! » lance l'inconnu d'un ton d'une légèreté insultante pour la gravité de la situation. « Vous faites fausse route. Cette demoiselle n'est pas une voleuse, c'est ma camarade d'étude ! Nous sommes tous les deux étudiants à la prestigieuse Faculté d'Architecture. Nous étions en plein débat théorique sur les proportions de cette si belle fontaine. Quant à ce bijou... elle vient de le ramasser par terre et s'apprêtait à vous le remettre. Quel civisme, n'est-ce pas ? »
>
> Le Capitaine des gardes plisse les yeux, scrute ton visage désemparé, puis celui, imperturbable, de ce sauveur improvisé. Il croise les bras sur son plastron.
>
> — « Des étudiants en architecture ? » grogne le Capitaine avec un scepticisme à couper au couteau. « Quelle chance. La ville est justement très fière de ses monuments. Puisque vous passiez votre temps à analyser la place plutôt qu'à faire le guet pour les tire-laine... vous ne verrez aucun inconvénient à me le prouver. »
>
> Il pointe le bout de sa hallebarde vers les trois immenses statues de pierre qui trônent au sommet de la fontaine et nous dominent.
>
> — « Je vais poser trois questions à ta "camarade" sur la symbolique des Trois Grâces d'Aethelis. Si elle répond sans bafouiller, je valide votre alibi d'étudiants et vous repartez libres. Si elle se trompe... vous partagerez la même cellule pour complicité de vol. À toi de jouer, l'experte. »
>
> Tu jettes un regard latéral au mystérieux garçon. Il te glisse un clin d'œil discret qui ne te rassure qu'à moitié. Tu n'as jamais ouvert un livre d'architecture de ta vie et ta liberté dépend désormais de ta capacité à bluffer un Capitaine de la garde.

**Statue_1**
> Ces statues, questionne le capitaine des gardes en désignant les trois statues de marbre ornant le sommet de la fontaine, guident les voyageurs...
>
> Celle qui regarde vers la route de Viana (*Avignon*), que symbolise-t-elle ?

**RIDDLE_Statue_1** — question : « Que symbolise la statue qui regarde vers la route de Viana (*Avignon*) ? »
Réponses : La Passion du Calisson (KO) · **Les Beaux-Arts (OK, +1)** · Le Culte de la Sardine Qui Bouche le Port (KO) · La Justice (KO) · Le Commerce et l'Agriculture (KO) · L'Art de ne rien faire du tout (KO)

**Statue_1_OK**
> C'était la bonne réponse. Tu vois le garde hocher la tête, presque déçu de ne pas t'avoir piégé.

**Statue_1_KO**
> Un silence lourd s'installe, seulement troublé par le clapotis de l'eau. Le milicien fronce les sourcils et échange un regard lourd de sens avec son collègue. « Curieuse réponse pour quelqu'un qui prétend connaître les environs », lâche-t-il d'une voix traînante. Une main se pose avec ostentation sur le pommeau d'une dague. La méfiance est désormais palpable, et l'air semble se raréfier autour de vous.

**Statue_2**
> « On continue, Mademoiselle. »

**RIDDLE_Statue_2** — question : « Que symbolise la statue qui regarde vers la route de Massalia-Port (*Marseille*) ? »
Réponses : La Passion du Calisson (KO) · Les Beaux-Arts (KO) · Le Culte de la Sardine Qui Bouche le Port (KO) · La Justice (KO) · **Le Commerce et l'Agriculture (OK, +1)** · L'Art de ne rien faire du tout (KO)

**Statue_2_OK**
> En voyant l'expression du garde, tu en conclues que c'était la bonne réponse. Tu pousses un soupir de soulagement discret. Le mensonge tient toujours.

**Statue_2_KO**
> « C'est faux. » Les mots du milicien claquent comme un fouet sur la place de la Rotonde. Le bruit métallique d'une hallebarde que l'on redresse résonne contre les pavés. Le regard qui vous transperce est celui d'une autorité qui perd patience car le moins qu'on puisses dire, c'est que le garde n'est pas convaincu par la réponse.

**Statue_3**
> L'ombre des statues semble s'allonger sur toi. Le sergent croise les bras, un sourire en coin qui ressemble à un défi.
>
> Tu sens le regard brûlant de ton mystérieux complice dans ton dos. Il est silencieux, mais tu devines son angoisse. Tu lèves les yeux vers la figure de marbre. Elle te semble sévère, imposante, gardienne des lois de cette cité que tu découvres à peine. Tu inspires un grand coup. C'est le moment de vérité.

**RIDDLE_Statue_3** — question : « Que symbolise la statue qui regarde vers la route d'Aethelis (*Aix-en-Provence*) ? »
Réponses : La Passion du Calisson (KO) · Les Beaux-Arts (KO) · Le Culte de la Sardine Qui Bouche le Port (KO) · **La Justice (OK, +1)** · Le Commerce et l'Agriculture (KO) · L'Art de ne rien faire du tout (KO)

**Statue_3_OK**
> Le garde semble convaincu. Vous ne serez pas jetés au cachot.

**Statue_3_KO**
> Le garde laisse échapper un rire sec, dénué de la moindre trace d'humour. Le sergent fait un pas menaçant, réduisant la distance de sécurité.

**RESULT_Avant_verdict_sergent** (routing sur `score`, texte affiché juste avant le fragment de destination)
> Il est maintenant l'heure d'écouter le verdict du sergent.

**Résultat_Enigmes_statues_LVL0 "Crédibilité nulle"** (score 0, aucun effet FLO/HOP)
> « C'en est assez ! » tonne le sergent en frappant le sol de sa hallebarde. « Vous mentez comme vous respirez. Menteurs, vagabonds, ou pire encore... vous allez vous expliquer devant le prévôt. » Avant que vous ne puissiez esquisser le moindre geste, des mains rugueuses vous saisissent les bras et vous plaquent au sol. Le cliquetis des fers se refermant sur vos poignets marque la fin de vos espoirs. On vous traîne sans ménagement vers les geôles sombres du Palais.

**Résultat_Enigmes_Statues_LVL1 "Crédibilité critique"** (score 1, `HOP -2`, `FLO -5`)
> L'atmosphère devient glaciale. Le milicien resserre sa poigne sur son arme, le regard chargé de suspicion. « Votre histoire ne tient pas debout. Personne n'est aussi ignorant, à moins de vouloir nous mener en bateau. » Il siffle ses collègues qui se rapprochent dangereusement. « C'est une tentative d'outrage à la milice. Ce sera **5 florins** pour chacun, immédiatement. C'est le prix pour vous éviter une cellule humide. » C'est le cœur lourd et la bourse vide que vous parvenez à quitter les lieux.
>
> *Vous perdez 2 hopopops*

**Résultat_Enigmes_Statues_LVL2 "Crédibilité fragile"** (score 2, `FLO -3`)
> Le garde soupire, visiblement agacé par vos hésitations. « Ce n'est pas brillant pour des étudiants en architecture. » Il tend une main gantée de cuir dans votre direction. « Puisqu'il a fallu vous rafraîchir les idées, cela coûtera **3 florins** pour le dérangement. Payez maintenant, ou l'on continue cette conversation au poste. » Une fois la somme versée, les miliciens s'éloignent en grognant.

**Résultat_Enigmes_Statues_LVL3 "Crédibilité totale"** (score 3, `HOP +2`)
> Le sergent de la milice finit par croiser les bras, la mine déconfite. Après un long silence, il gratte son menton mal rasé et fait un signe de tête vers la sortie de la place. « C'est bon. On dirait que vous connaissez vos classiques, ou que vous avez eu de la chance. Circulez, et que l'on ne vous reprenne pas à traîner près des bassins. La prochaine fois, je ne serai pas d'humeur à jouer aux devinettes. » Les gardes s'écartent enfin, vous rendant votre liberté de mouvement.
>
> *Vous gagnez 2 hopopops !*

**Fin_Prologue**
> Le vacarme des fontaines et le cliquetis des armures s'estompent enfin alors qu'un dédale de ruelles étroites vous engloutit. Vous vous arrêtez près d'un vieux mur couvert de jasmin dont l'odeur sucrée tranche avec l'adrénaline de la peur qui retombe.
>
> **Escur** *(s'appuyant contre le mur avec un petit sourire en coin)* : — « Bon, on ne va pas se mentir : pour une entrée en scène, c'était spectaculaire. Tu as assurément un don certain pour mettre de l'animation sur la place publique. »
>
> **Luce** *(ajustant son sac de voyage avec une moue dédaigneuse)* : — « Je te signale que dans mon village, je suis considérée comme quelqu'un de très stable ! Ce n'est pas ma faute si un maudit gamin des rues a décidé d'utiliser mon sac comme planque pour son butin en fuyant la garde. J'ai cru que j'allais m'évanouir quand j'ai sorti cette broche en or devant le Capitaine... Mais... merci. Sans ton alibi d'étudiants en architecture, je serais déjà en train de réciter mes formules magiques à un mur de briques dans une cellule humide. »
>
> **Escur** *(ricanant doucement)* : — « Des formules magiques ? Ne me dis pas que tu es l'une de ces érudites qui transforment le plomb en or ? »
>
> **Luce** *(avec une pointe d'auto-dérision)* : — « Plutôt du genre à transformer des radis minuscules en radis un peu moins minuscules. Pas très impressionnant pour ton histoire d'architecture, j'imagine ? D'ailleurs, puisque tu as risqué ta tranquillité pour moi, je devrais au moins savoir à qui j'ai affaire. Je m'appelle **Luce**. »
>
> **Escur** *(faisant tourner une petite pièce entre ses phalanges avec une dextérité troublante)* : — « **Escur**. Enchanté, Luce aux Radis. Et pour répondre à ta question... disons que tu as joué de malchance sur cette place, mais que le destin a le sens de l'humour : aujourd'hui, tu n'as pas rencontré un, mais deux voleurs. »
>
> **Luce** *(plissant les yeux, un sourire amusé aux lèvres)* : — « Un voleur, donc. Et le deuxième prend le temps d'aider les voyageuses égarées pour le plaisir de contredire la milice ? »
>
> **Escur** *(faisant une révérence moqueuse)* : — « Je préfère "spécialiste en redistribution de richesse mal surveillée" et en escalade urbaine. Mais rassure-toi, ton sac de légumes est en parfaite sécurité avec moi. Je ne vole que ce qui brille ou ce qui représente un vrai défi... et pour l'instant, ta capacité à survivre dans cette ville est le défi le plus intéressant que j'ai croisé aujourd'hui. »
>
> **Luce** : — « Eh bien, l'expert, j'espère que tu n'auras pas à me servir d'alibi une deuxième fois. »
>
> **Escur** : — « Oh, on ne sait jamais. Aethelis est petite pour ceux qui savent regarder par-dessus les toits. On se reverra peut-être, magicienne des potagers. Essaie juste de surveiller tes poches d'ici là ! »
>
> Il se redresse et, dans un mouvement fluide, commence à escalader la treille d'une fenêtre voisine comme s'il marchait sur un sol plat. Il s'arrête à mi-hauteur pour te lancer un dernier clin d'œil complice avant de disparaître dans l'ombre des corniches. Tu restes seule, un sourire aux lèvres, avec le sentiment étrange que ta quête de potion va être beaucoup plus animée que prévu.

---

## 🃏 LE FOU — PERSONNAGE ET PREMIÈRE RENCONTRE (validé, en cours d'intégration Obsidian)

### Concept du personnage
**Le Fou** est un vagabond excentrique, personnage récurrent tout au long de l'histoire (pas un protagoniste jouable, pas un allié classique). Sa particularité : il **voit le "4e mur"**. Il sait que Luce évolue dans une histoire, il connaît le vrai nom de la ville (Aix-en-Provence, pas Aethelis) et l'histoire réelle des lieux qu'elle traverse — mais personne ne le croit, tout le monde le prend pour un fou qui divague.

**Ressort humoristique** : son discours est confus, décousu, plein de digressions absurdes et d'associations d'idées bizarres — mais **le contenu factuel qu'il énonce sur le monde réel est toujours vrai**. Jamais l'inverse : ⚠️ ne jamais lui faire raconter une fausse information historique, même noyée dans la confusion — c'est la forme qui est confuse, pas le fond. Luce ne le croit jamais ; elle le tolère, lève les yeux au ciel, l'écoute parfois avec une patience amusée — mais ne remet jamais sérieusement en cause sa propre réalité (Aethelis, la magie) à cause de lui.

**Rôle produit** : Le Fou est le pont entre la fiction (les aventures de Luce à Aethelis) et la réalité historique d'Aix-en-Provence — un moyen, pour les joueurs curieux, d'apprendre du contenu touristique/historique réel sur les lieux traversés pendant le jeu (mécanique UI pas encore développée, voir `CLAUDE.md` § "Le Fou & les divagations du Fou").

### Première rencontre (juste après `Fin_Prologue`)
Lieu : Luce revient vers la Fontaine de la Rotonde (elle doit reprendre son chemin vers chez son oncle Samantis) juste après qu'Escur a disparu par les toits. Le Fou l'aborde pour la première fois.

Cette rencontre établit :
- La première apparition du Fou et son ton (confus mais toujours factuellement exact).
- Un premier fait historique réel sur la Fontaine de la Rotonde (ses trois statues — Justice / Agriculture / Beaux-Arts, sculptées par Théophile de Tournadre vers 1860 — qui font écho à l'énigme des Trois Grâces d'Aethelis du prologue).
- Une réplique de fin qui **laisse entendre que l'oncle Samantis va disparaître**, sans en dire plus — cohérent avec la piste validée plus bas (§ "Piste pour la suite"), mais volontairement vague puisque cette suite n'est pas encore figée dans le détail.

⚠️ **Statut du texte** : version validée par l'auteur sur le fond, en cours de légères retouches et d'intégration dans Obsidian par l'auteur lui-même. Le texte ci-dessous est la référence de ton/contenu, pas nécessairement le mot-à-mot final une fois copié en fragment(s) `.md`.

⚠️ Texte livré **sans mise en forme blockquote** (pas de `>` en début de ligne) — copiable tel quel dans une note Obsidian sans faire apparaître de barres de citation entre les paragraphes.

```
Tu restes un instant seule dans la ruelle, le sourire encore accroché aux lèvres, à regarder l'ombre d'Escur s'effacer sur les toits. Puis la réalité te rattrape : tu n'as toujours pas ta potion, et le laboratoire de ton oncle Samantis est de l'autre côté de la ville. Tu rebrousses chemin vers la place, en te promettant de ne plus jamais t'assoir sur un rebord de fontaine tant que tu vivras.

La foule s'est reformée autour du bassin comme si de rien n'était — les gens d'Aethelis semblent avoir une tolérance remarquable aux esclandres impliquant la milice. Tu longes la margelle, décidée à filer droit, quand une silhouette se détache d'un pilier et te coupe la route sans prévenir.

L'homme — enfin, tu supposes que c'est un homme, sous les trois manteaux dépareillés qu'il porte malgré la chaleur — a une plume de pigeon coincée dans une mèche de cheveux et un œil qui semble regarder un peu plus loin que l'autre. Il te dévisage avec l'intensité de quelqu'un qui vient de retrouver un vieil ami, ce qui est nettement plus inquiétant que rassurant.

**Le Fou** *(un doigt tendu vers toi, tremblant légèrement)* : — « Toi ! Oui, toi, la cuillère qui lévite ! Je t'ai vue, tout à l'heure, avec le garçon aux doigts agiles et le menteur en cuirasse. Belle performance. Quoique — techniquement, c'est lui qui a menti. Toi tu t'es juste trompée deux fois sur trois sur des statues centenaires. On ne va pas t'en vouloir, ce n'est écrit nulle part que tu devais réviser. »

**Luce** *(reculant d'un pas, la main resserrée sur son sac)* : — « Je... pardon ? On se connaît ? »

**Le Fou** *(balayant la question d'un revers de main, comme on chasse une mouche particulièrement stupide)* : — « Personne ne me connaît, c'est bien le problème. Mais moi, je vous connais tous. C'est la malédiction du regard qui voit le quatrième mur, figure-toi. Je le vois, moi, le mur. Il est juste là. » *(il pointe un endroit vide entre deux passants, avec beaucoup de conviction)* « Tenez, vous êtes en train de me lire, là, tout de suite, sur un petit rectangle lumineux, en marchant dans une vraie rue avec de vrais pavés. Amusant, non ? Moi ça me donne surtout mal à la tête. »

Tu jettes un regard aux passants alentour, qui continuent leur chemin sans un regard pour l'énergumène. Manifestement, tu n'es pas la première à qui il fait le coup.

**Luce** *(la voix mi-lasse, mi-amusée)* : — « Écoute, je suis sûre que ta théorie est passionnante, mais j'ai une potion à récupérer et — »

**Le Fou** *(l'interrompant, subitement très sérieux, presque triste)* : — « Aethelis n'existe pas. Enfin — si, mais pas sous ce nom-là. Ça s'appelle Aix. Aix-en-Provence, pour être précis, même si "précis" et moi on n'est plus très proches depuis quelques années. Et la magie n'existe pas non plus, contrairement à ce qu'on t'a laissé croire pour te motiver à sauver des radis. » *(il se penche vers toi, chuchotant sur le ton de la confidence)* « Je crois qu'on est tous coincés dans une histoire. La tienne, en l'occurrence. Ce n'est pas très pratique pour moi, remarque, parce que du coup je ne sais jamais si j'ai vraiment faim ou si c'est juste écrit que j'ai faim. »

**Luce** *(les yeux au ciel, mais sans bouger)* : — « Bien sûr. Et moi je suis une magicienne débutante qui vient de mentir à un capitaine de la garde pour une histoire de broche volée. On a tous nos problèmes. »

**Le Fou** *(radieux, comme si elle venait enfin de comprendre quelque chose)* : — « Voilà ! Tu vois, tu commences à piger ! Remarque — tiens, en parlant de ta fontaine, là — » *(il désigne le bassin d'un geste large, manquant de peu un couple de badauds)* « — chez nous, dans le vrai monde, elle existe pour de bon. Fontaine de la Rotonde. Trois dames en pierre, un monsieur du nom de Tournadre — Théophile, comme le fromage, sauf que ça n'a rien à voir avec le fromage — les a sculptées vers 1860, à l'entrée du Cours. Une qui regarde la route de Marseille et tient une gerbe de blé, l'Agriculture. Une qui regarde la route d'Avignon avec sa palette de peintre, les Beaux-Arts. Et une, tournée vers la ville, qui tient une balance — la Justice, celle-là même qui a failli t'envoyer croupir dans un cachot il y a une demi-heure. Amusant, comme les histoires se recopient elles-mêmes, non ? »

Tu regardes les statues, puis lui, puis de nouveau les statues. L'ombre d'un doute — vite balayée par le bon sens.

**Luce** *(reculant prudemment, la main levée en signe de paix)* : — « C'est... très intéressant. Vraiment. Je vais y aller, maintenant. »

**Le Fou** *(pas vexé pour un sou, déjà en train de saluer un pigeon comme une vieille connaissance)* : — « Vas-y, vas-y, va chercher ta potion. On se recroisera — c'est écrit, de toute façon, alors autant ne pas se fatiguer à l'éviter. Et Luce ? » *(il te lance ça alors que tu t'éloignes déjà, sans même se retourner)* « Fais attention à ton oncle. Les gens qui disparaissent dans les histoires disparaissent rarement par hasard. »

Tu t'arrêtes une fraction de seconde, la nuque hérissée — puis tu hausses les épaules et presses le pas. Un vagabond qui parle aux pigeons n'a probablement rien à t'apprendre sur ta propre famille. Probablement.
```

---

## 💡 PISTE POUR LA SUITE (idée en cours, pas encore écrite en fragments)

⚠️ Ce qui suit est une **idée directrice validée par l'auteur pour la suite après `Fin_Prologue`**, mais rien n'est encore transformé en fragments `.md`/`.canvas` — c'est la base de travail de cette conversation, pas encore du canon figé. Elle peut évoluer en cours de route.

### Prémisse

Juste après `Fin_Prologue`, Luce arrive enfin chez son oncle **Samantis** pour récupérer sa potion — mais trouve son **laboratoire sens dessus dessous** et l'oncle **disparu**. Il lui a laissé un **message codé**, qui déclenche toute la suite de la quête : percer **le mystère des eaux de la cité** (Aethelis, la "Cité aux cent fontaines" — cohérent avec le thème de l'eau déjà présent) en reconstituant un **quatrain mystique scellé**, dont les 4 vers ont été dispersés auprès de personnalités et lieux emblématiques d'Aethelis.

⚠️ Cette disparition de Samantis est désormais **légèrement préfigurée** par la dernière réplique du Fou lors de sa première rencontre avec Luce (§ "Le Fou — Personnage et première rencontre" plus haut : « Fais attention à ton oncle. Les gens qui disparaissent dans les histoires disparaissent rarement par hasard. ») — volontairement vague, sans donner de détail sur la nature ou la cause de la disparition, puisque cette suite n'est pas encore figée dans le détail.

### Les 5 sources du quatrain

Pour l'instant, seuls le lieu, le personnage et le vers obtenu sont fixés — pas de caractérisation détaillée de ces personnages pour l'instant (à écrire au moment de rédiger les fragments) :

| # | Personnage | Lieu | Vers obtenu |
|---|---|---|---|
| 1 | L'Érudit | La Bibliothèque | Vers 1 — *Mémoire & Bureaucratie* |
| 2 | La Prêtresse | La Cathédrale | Vers 2 — *Vérités Enfouies* |
| 3 | Le Marchand | Place d'Albertas | Vers 3 — *Légendes & Scepticisme* |
| 4 | Le Mendiant | Rue de la Verrerie | Vers 4, partie 1 — *Souvenir via le Lumen* |
| 5 | Le Spectre | Le Cloître | Vers 4, partie 2 — *Le Dernier Secret* |

⚠️ **Le Spectre** : sa nature n'est pas encore tranchée — **Démon ou Divinité**, à décider plus tard (ne pas trancher de soi-même dans une proposition, poser la question ou présenter les deux options).

### Dénouement : La Boussole des Vents

Une fois les 4 vers réassemblés, leur récitation fait résonner la **Boussole des Vents** (*Rosa Ventorum*), l'artefact légué par Samantis :
- Chaque vers fait pivoter un cadran et réaligne ses aiguilles.
- La boussole indique la direction du **sanctuaire souterrain d'Aethelis**, révélant le secret ultime de Lumen Aquae.
- **Double nature de l'artefact (idée à conserver et développer)** : la Boussole ne guide pas que vers une direction physique — elle est aussi censée révéler « la direction de son cœur », c'est-à-dire ce que Luce sait, au fond d'elle-même, qu'elle doit faire. Cette dimension symbolique/introspective n'est pas encore développée mais fait partie de l'idée de base de l'artefact.

### Escur : rival puis allié

Après l'épisode complice du prologue (l'alibi face aux gardes), Escur et Luce sont désormais **en rivalité**. Escur **suit Luce de loin pendant tout son périple** et elle le croise régulièrement au fil de la quête. Il est envoyé par la **guilde des voleurs** et poursuit ses propres objectifs, distincts de ceux de Luce. À la fin de l'histoire, **ils devront s'allier** — mais la nature exacte de cette alliance et la fin de l'histoire elle-même ne sont **pas encore déterminées**.

⚠️ **Statut de toutes ces idées** : ce sont des directions narratives générales, pas un scénario figé. L'auteur attend explicitement des **propositions et suggestions de modification** de la part de Claude sur ces éléments (enchaînement des rencontres, nature du Spectre, forme de la rivalité avec Escur, fin de l'histoire...) — ne pas se contenter d'exécuter ces idées telles quelles sans réfléchir, les challenger et proposer des variantes fait partie du travail attendu ici.

### Pistes de traduction en mécanique moteur (à affiner ensemble)

- Chaque rencontre (Érudit/Prêtresse/Marchand/Mendiant/Spectre) est un candidat naturel pour un mini-arc `standard` + éventuellement un `RIDDLE_` (convaincre le personnage, déchiffrer un indice...), avec un `FLO`/`HOP` cohérent avec le ton de la rencontre.
- Les 5 rencontres semblent indépendantes entre elles (pas d'ordre imposé évident) — à confirmer : est-ce un ordre libre (le joueur choisit où aller) ou sont-elles verrouillées dans un ordre précis par le canvas ?
- Le Spectre donnant un indice qui pointe vers le Mendiant suggère un **ordre logique interne** (Spectre après Mendiant, ou l'inverse selon la lecture) — à clarifier pour le séquencement des edges dans le canvas.
- Rassembler les 4 vers ressemble à un cas d'usage pour une variable trackée (façon `score`) suivie jusqu'à un fragment `RESULT_`/`routing` final qui déclenche le dénouement une fois les 4 (ou 5) sources visitées — mais le mécanisme actuel de `routing` teste une valeur numérique simple, pas un ensemble de flags indépendants ; ce point mérite d'être creusé avec l'autre session (Claude Code) si le moteur doit évoluer pour gérer "a visité A ET B ET C ET D ET E" plutôt qu'un score cumulatif.

---

## ✅ CE QUI RESTE À FAIRE CÔTÉ HISTOIRE

- La suite après `Fin_Prologue` n'est pas encore écrite — la piste ci-dessus (quatrain + Boussole des Vents) est la direction retenue, à affiner et transformer en fragments concrets.
- Réfléchir aux prochains embranchements en gardant à l'esprit les contraintes moteur ci-dessus (`riddle`/`routing`/`standard`, `FLO`/`HOP`, labels de flèches).
- Toute proposition de contenu doit être livrée sous une forme directement copiable en fragment `.md` (frontmatter JSON + texte), pour un aller-retour rapide vers Obsidian.
- **Le Fou** : la première rencontre est écrite (§ dédié plus haut) mais pas encore transformée en fragment(s) `.md`/nœud(s) `.canvas`. Reste à décider :
  - le découpage en fragment(s) (un seul fragment `standard` linéaire, ou plusieurs avec un choix "l'écouter encore" / "partir tout de suite" ?) ;
  - le rythme de ses apparitions suivantes tout au long de l'histoire (à quels moments/lieux il recroise Luce) ;
  - pour chaque lieu réel qu'il commente, quel contenu historique/touristique réel associer (matière première du futur contenu "Les divagations du Fou", cf. `CLAUDE.md`) — à traiter au fur et à mesure de l'écriture des lieux visités, pas tout d'un coup.