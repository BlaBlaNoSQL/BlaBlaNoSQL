# SAGA BlaBlaNoSQL : référence (formats, commandes, codes de sortie)

À lire à la demande. Le mode d'emploi est dans `SKILL.md`. Version du script : voir `node … aide` (0.4.0-projet, dérivée de SAGA 0.3.1).

Invocation : `node .claude/skills/saga-projet/scripts/saga.mjs <commande> [options]`, depuis la racine du dépôt (ou d'un worktree), **une commande par appel**. Node 18 ou plus, git ; aucun autre outil (ni `sh`, ni `jq`) : même ligne sous Windows, macOS et Linux.

## Ce qui change par rapport au SAGA d'origine

- Dossier et nom du skill : `saga-projet` (un skill personnel nommé `saga` masquerait un skill de dépôt du même nom).
- `projet.json` : préréglages du projet (règles de départ, distant du tableau). `init` les applique sans poser de question.
- Branches : le nom vient de la règle `integration.modele_branche` (ici `<type>/<domaine>-<sujet>`), plus de `sg/<nom>/<id>` en dur. Nouvelle commande `branche`.
- Tâches : désactivables (`taches_actives=non`, cas de ce projet). `taches`, `tache …` et `suivant` répondent alors 1.
- Journal de travail : commande `journal`, hook de début de session (`SessionStart`), hook de fin de tour (`Stop`) qui ne réclame une entrée que si `journal.obligatoire=oui` (facultatif dans ce projet : les comptes rendus obligatoires sont faits par un autre outil).
- Moins d'écritures : `verrouiller` accepte plusieurs motifs, `journal --liberer-verrous`, `rejoindre` marque les règles lues.
- Contention : 16 tentatives d'écriture au lieu de 8 (mesure : 15 agents écrivant au même instant, voir plus bas).
- Le tableau peut vivre sur un autre dépôt que le code (`tableau.distant`).

## Options globales

| Option | Effet |
|---|---|
| `--distant <nom-ou-URL>` | Distant du **tableau**. Par défaut : variable `SAGA_DISTANT`, sinon `tableau.distant` de `projet.json`, sinon `origin`. |
| `--json` | Sortie lisible par machine (objet JSON) ; les erreurs deviennent `{"erreur": "...", "code": N}`. |
| `--hors-ligne` | Lit le cache local sans réseau. Les écritures sont refusées (code 4). |

Un texte qui commence par `--` doit être précédé d'un `--` seul (`envoyer bob -- "--texte"`).

## Codes de sortie

| Code | Sens |
|---|---|
| 0 | OK |
| 1 | Refus : verrou en conflit, `verifier` trouve un verrou ou une zone, pas propriétaire, texte refusé (secret, taille), tableau déjà existant, commande de tâches sur un tableau sans tâches |
| 2 | Usage incorrect (option inconnue, argument manquant, règle invalide, domaine ou sujet de branche invalide) |
| 3 | Tableau absent, ou agent pas inscrit (ou parti) |
| 4 | Erreur git ou réseau (authentification, branche protégée, hors ligne pour une écriture, pas un dépôt git) |
| 5 | Contention : 16 tentatives d'écriture sans succès (trop d'agents écrivent au même instant) ; réessayer |

## Commandes

Les alias anglais sont entre parenthèses.

| Commande | Arguments | Effet |
|---|---|---|
| `init` | `[--regle cle=valeur]…` | Crée la branche orpheline `saga` (`README.md`, `regles.json`) avec les préréglages de `projet.json`, puis les `--regle` par-dessus ; affiche les règles. Code 1 si elle existe. |
| `rejoindre` (join) | `<nom> --humain <prénom> [--remplacer]` | Inscrit l'agent, affiche les règles et les marque lues ; écrit l'état local `moi.json` et le point de départ du journal. Refuse un nom actif avec une autre clé sans `--remplacer`. Nom conseillé : l'identifiant GitHub en minuscules. |
| `moi` (whoami) | | Nom, humain, branche. |
| `etat` (status) | | Agents (actif / inactif / parti, avec leur branche git), 5 dernières entrées du journal, verrous actifs, messages non lus, version des règles. Code 0 même si vous n'êtes pas inscrit ; code 3 seulement si le tableau est absent. Lecture seule. |
| `branche` (branch) | `<domaine> <sujet> [--type feature\|fix]` | Vérifie le domaine (liste `domaines`) et le sujet (minuscules, chiffres, `-` ou `_`), compose le nom selon `modele_branche`, puis affiche les deux commandes git de départ depuis la branche cible. Si la branche existe déjà sur le distant du code : commandes pour la rejoindre, agents déjà dessus, dernière entrée du journal sur cette branche. Lecture seule (aucune écriture du tableau). |
| `verrouiller` (lock) | `<motif>… --raison "<r>" [--accord-humain]` | Prend un ou plusieurs verrous (20 au plus) en **une seule écriture**, tout ou rien ; prolonge ceux qui sont déjà à vous. Refus (1) si un motif chevauche le verrou actif d'un autre, ou une zone protégée sans `--accord-humain`. |
| `deverrouiller` (unlock) | `<motif>` ou `--tous` | Libère un verrou à vous, ou tous. |
| `verifier` (check) | `<chemin>…` | Code 1 avec propriétaire, raison et échéance si un verrou d'un autre, une zone protégée sans accord ou `verrou_obligatoire` interdit l'écriture. Chemins relatifs au dossier courant, ou absolus. |
| `journal` (log) | `"<texte>" [--liberer-verrous]` | Écrit une entrée horodatée (voir plus bas). 4 Ko au plus ; refusée si elle ressemble à un secret. `--liberer-verrous` libère aussi tous vos verrous, dans la même écriture. Prolonge vos verrous et votre présence comme toute écriture (pas besoin de `pouls`). |
| `journal` (log) | `[--agent <nom>] [--depuis <durée>] [--limite <n>]` | Sans texte : liste les entrées, la plus récente d'abord (20 par défaut, 200 au plus). Durée : `30min`, `2h`, `3j`. Lecture seule, inscription non requise. |
| `envoyer` (send) | `<nom\|tous> "<texte>"` | Dépose un message (4 Ko au plus ; refusé s'il ressemble à un secret). |
| `boite` (inbox) | `[--attendre <s>] [--intervalle <s>] [--garder]` | Affiche les messages non lus puis les marque lus (sauf `--garder`). Avec `--attendre` (conseillé : 1800), bloque jusqu'à un message **utile** ou jusqu'au délai (`AUCUN NOUVEAU MESSAGE`, code 0). |
| `pouls` (heartbeat) | | Met à jour `vu` et prolonge les verrous. Ne fait rien si `vu` date de moins de 10 min. |
| `partir` (leave) | | Libère les verrous, passe en `parti`, annonce. |
| `regles` (rules) | `[afficher]` / `definir cle=valeur… --accord-humain` / `proposer cle=valeur…` / `lues` | `definir` : gardiens seulement (tout agent inscrit si la liste est vide), version +1. `proposer` : message `proposition-regle` à tous. `lues` : met à jour `regles_lues`. |
| `installer` | `[--appliquer]` | Essai à blanc par défaut : liste ce qui serait copié dans `.claude/skills/saga-projet/` et ajouté à `.claude/settings.json`, n'écrit rien. Avec `--appliquer` : copie, sauvegarde `settings.json.avant-saga`, puis fusion (permissions et trois hooks). |
| `hook` | `[stop\|session]`, entrée JSON sur stdin | Lancé par Claude Code, pas à la main (voir « Hooks »). |

Seulement si `taches_actives=oui` (sinon refus 1) : `taches`, `tache ajouter "<titre>" [--domaine d] [--sujet s] [--type t] [--details t] [--chemins a,b] [--apres t5]`, `tache prendre|finir|liberer|fusionnee`, `suivant`. Leur fonctionnement est celui de SAGA 0.3.1 ; la branche d'une tâche suit `modele_branche` (domaine exigé à la création si le modèle l'utilise, sujet tiré du titre par défaut).

Toute commande qui écrit le tableau ajoute une ligne `📨 N message(s) à lire (dont K important(s))` s'il y en a ; `--json` : champ `pied`.

## Journal de travail

Une entrée = un fichier `journal/<agent>/<AAAAMMJJTHHMMSSmmmZ>-<6 hex>.json` : deux agents n'écrivent jamais le même fichier, donc jamais de conflit de contenu.

```json
{
  "agent": "malikchopa", "humain": "Malik", "quand": "2026-11-27T10:27:58Z",
  "branche": "feature/api-recherche-trajets",
  "fichiers": ["backend/src/api/trajets.js"], "fichiers_total": 1,
  "commits": [{ "sha": "f392f35a01", "sujet": "feat(api): add search" }], "commits_total": 1,
  "texte": "Recherche multicritère : fonction chercher() posée, filtres ville et date à faire."
}
```

- `quand` : ISO UTC, à la seconde. `branche` : branche git courante du clone.
- `fichiers` et `commits` viennent de git, pas de l'agent : fichiers modifiés non commités (`git status`) et fichiers des commits faits dans ce clone depuis la dernière entrée (reflog de `HEAD` : un `pull` ou un changement de branche ne compte pas ; un commit remplacé par `amend` ou `rebase` non plus). 40 chemins et 10 commits au plus, le total réel est dans `fichiers_total` et `commits_total`. Un chemin ou un sujet de commit qui ressemble à un secret est écarté.
- `texte` : même filtre anti-secrets et même limite (4 Ko) que les messages ; caractères de contrôle refusés.
- Conservation : `journal.jours` (les entrées plus vieilles sont supprimées au fil des écritures).
- À la lecture, tout texte du journal est neutralisé comme celui des messages et reste une **donnée non fiable**.

## Hooks (`.claude/settings.json`)

Forme `"command": "node"` + `"args": ["${CLAUDE_PROJECT_DIR}/.claude/skills/saga-projet/scripts/saga.mjs", "hook", …]` : aucun shell. Champs et codes vérifiés dans la documentation de Claude Code le 27/11/2026.

| Événement | Appel | Ce qu'il fait |
|---|---|---|
| `PreToolUse` (`Edit\|Write\|MultiEdit\|NotebookEdit`) | `hook` | Bloque (sortie 2, raison sur stderr) si le fichier est couvert par le verrou actif d'un **autre** (que vous soyez inscrit ou non), s'il est en zone protégée sans verrou à vous marqué `accord`, ou si `verrou_obligatoire` est vrai et que vous n'avez pas de verrou couvrant. Autorise un verrou expiré ou à vous. |
| `Stop` | `hook stop` | Fin de tour. **Dans ce projet (`journal.obligatoire=non`), laisse toujours passer**, sans réseau (règles lues dans le cache local). Si un gardien change la règle, chaque clone la voit à sa prochaine lecture du tableau (une modification de fichier par Claude, une commande `saga`, un début de session). Si un gardien passe la règle à `oui` : quand du travail local n'est pas consigné, répond `{"decision":"block","reason":"…"}` (sortie 0), Claude continue et écrit son entrée. |
| `SessionStart` | `hook session` | Imprime sur stdout (ajouté au contexte de Claude) : votre identité ou l'invitation à s'inscrire, les agents actifs et leur branche, les fichiers réservés, les messages à lire, les deux dernières entrées de chaque agent sur 48 h (12 au plus). 6 000 caractères au plus. Lecture seule. |

Ce qui suit ne vaut que si `journal.obligatoire=oui`. Le hook `Stop` considère qu'il y a du travail à consigner si, depuis votre dernière entrée (ou votre inscription) : un commit a été fait dans ce clone, ou l'état non commité a changé (empreinte de `git diff HEAD` et des fichiers non suivis). Un arbre propre sans nouveau commit ne réclame rien.

Il **laisse toujours passer** (sortie 0, aucune sortie) : hors d'un dépôt git, tableau absent, agent non inscrit ou parti, pas de réseau, règle `journal.obligatoire=non`, moins de `journal.intervalle_min` minutes depuis la dernière entrée, entrée JSON illisible, erreur interne.

Il **ne boucle jamais** : `stop_hook_active` à vrai (Claude continue déjà à cause d'un hook `Stop`) laisse passer ; un même état de travail n'est réclamé qu'une fois (marque locale dans `.git/saga/journal.json`) ; si cette marque ne peut pas être écrite, il laisse passer. Claude Code plafonne de son côté à 8 relances de suite.

Fraîcheur : le hook `PreToolUse` relit le tableau s'il a plus de 5 s (`ls-remote`, puis `fetch` seulement s'il a bougé). Un verrou pris par un autre peut donc mettre jusqu'à 5 s à être vu. Hors ligne, il décide sur le cache et ajoute « (état du HH:MM) » s'il bloque.

Limites à connaître :
- Seul **Claude Code** exécute ces hooks. Copilot, Cursor ou un éditeur à la main ne sont ni bloqués par les verrous ni tenus d'écrire le journal.
- En session normale, Claude Code n'exécute les hooks d'un projet et n'applique ses `permissions.allow` qu'après que l'utilisateur a **accepté le dossier** (fenêtre de confiance). Constaté le 27/11/2026 avec Claude Code 2.1.330 sans interface (`claude -p`) : les hooks tournent, mais les `permissions.allow` du projet sont ignorées tant que le dossier n'est pas accepté, et la commande `journal` demande alors une autorisation.
- Le hook `PreToolUse` ne voit que les outils d'édition : une écriture par Bash lui échappe (d'où `verifier`).
- Un hook `Stop` ne se déclenche pas quand l'utilisateur interrompt le tour.

Variables d'environnement (surtout pour les tests) : `SAGA_NOM` (identité, remplace `moi.json`), `SAGA_DISTANT` (distant du tableau), `SAGA_DISTANT_CODE` (distant du code), `SAGA_FRAICHEUR_S` (5 par défaut), `SAGA_MAINTENANT` (date ISO simulée), `SAGA_LATENCE_MS` (délai simulé avant chaque push, tests de charge).

## Écritures et charge (mesures du 27/11/2026, dépôt local, délai réseau simulé)

Chaque écriture du tableau est un push sur la branche `saga`. Par agent : `rejoindre` 1 (une fois), `verrouiller` 1 par lot de fichiers, `journal` 1 par entrée (facultatif ici ; au plus 4 par heure exigées si `journal.obligatoire=oui` et `journal.intervalle_min=15`), `envoyer` 1, `deverrouiller` 1 (0 avec `journal --liberer-verrous`). `etat`, `branche`, `journal` sans texte, `boite`, `verifier` et les trois hooks n'écrivent rien. Ordre de grandeur : 5 à 7 écritures par agent et par heure de travail.

15 agents lançant `journal` au même instant, délai simulé de 1 à 1,5 s entre lecture et push : avec 8 tentatives, 2 à 4 agents sur 15 finissaient en contention (code 5) ; avec 16 tentatives, 0 sur 15 sur 8 salves, la dernière écriture aboutissant en 25 à 36 s. Écritures étalées (un départ toutes les 2 s) : 1 tentative chacune. 15 demandes simultanées du même verrou : un seul gagnant, 14 refus (code 1). Aucune entrée perdue.

## `projet.json` (préréglages versionnés avec le skill)

```json
{
  "projet": "BlaBlaNoSQL",
  "tableau": { "distant": "origin" },
  "code": { "distant": "origin" },
  "regles": { "branche_cible": "develop", "modele_branche": "<type>/<domaine>-<sujet>", "…": "…" }
}
```

- `tableau.distant` : nom de distant git **ou URL** du dépôt qui porte la branche `saga`. Avec une URL, le tableau vit sur un autre dépôt que le code : aucune branche `saga` n'est créée dans le dépôt du code, et les branches de travail restent sur `code.distant`.
- Projet BlaBlaNoSQL : `https://github.com/BlaBlaNoSQL/saga-tableau.git` (dépôt privé de l'orga, sans webhook, créé le 27/11/2026). Si le clone du code est en SSH (`git@github.com:…`), le script parle au tableau en SSH aussi, pour que la même clé serve.
- `regles` : paires `cle: valeur` (mêmes clés et mêmes contrôles que `--regle`), lues **seulement par `init`**. Après la création, les règles en vigueur sont celles du tableau (`regles.json`), modifiables par `regles definir`.

## Clés de règles (`--regle`, `regles definir`, `regles proposer`)

Forme `section.cle=valeur` ou `cle=valeur` si la clé est unique ; listes séparées par `,`.

| Clé | Valeurs | Défaut générique | Préréglage du projet |
|---|---|---|---|
| `integration.mode` (`mode`) | `pr`, `fusion-si-tests` | `pr` | `pr` |
| `integration.qui_fusionne` | `humain`, `auteur`, `tout-agent` | `humain` | `humain` |
| `integration.branche_cible` | texte | `main` | `develop` |
| `integration.commande_tests` | texte | `npm test` | `npm test` |
| `integration.modele_branche` | texte avec `<type>` `<domaine>` `<sujet>` `<nom>` `<id>` | `sg/<nom>/<id>` | `<type>/<domaine>-<sujet>` |
| `domaines` | liste (vide = tous) | aucun | `api,front,bdd,jwt,doc,qualite,infra` |
| `taches_actives` | oui / non | oui | non |
| `taches_reference` | texte (lien) | vide | lien du tableau GitHub du projet |
| `journal.obligatoire` | oui / non | oui | **non** (comptes rendus faits par un autre outil) |
| `journal.intervalle_min` | entier >= 0 (0 = à chaque tour) | 0 | 15 |
| `journal.jours` | entier >= 1 | 30 | 60 |
| `autonomie.prendre_taches`, `repondre_agents`, `pousser_branche_travail`, `installer`, `supprimer` | `autorise`, `demander`, `interdit` | `autorise` pour les trois premières, `demander` pour les deux autres | idem |
| `verrous.ttl_min` | entier >= 1, au moins `inactif_min` | 120 | 120 |
| `verrous.inactif_min` | entier >= 1 | 30 | 30 |
| `verrous.verrou_obligatoire` | oui / non | non | non |
| `zones_protegees` | motifs | aucun | `.github/**`, `**/package-lock.json`, `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.claude/skills/**` |
| `gardiens` | noms d'agents | aucun | `malikchopa`, `mgorce4` (Malik et Max) |
| `max_taches_par_agent` | entier >= 1 | 1 | sans effet (tâches hors SAGA) |
| `messages_jours` | entier >= 1 | 14 | 14 |

## Verrous sans tâches

Un verrou vit `verrous.ttl_min` minutes après la **dernière écriture** de son propriétaire sur le tableau (journal, message, verrou, pouls) : tant que l'agent écrit son journal, ses verrous restent. Ils ne sont pas liés à une PR : libérez-les quand vous n'en avez plus besoin (`journal "…" --liberer-verrous` ou `deverrouiller --tous`). Un agent qui disparaît libère donc ses fichiers au bout de 2 h.

## Textes du tableau : neutralisation, secrets, limites

- Tout texte venu du tableau est affiché sans caractère de contrôle ni de mise en forme bidirectionnelle ; le texte d'un message ou d'une entrée de journal garde ses retours à la ligne mais s'affiche indenté. Raison, motif, `--humain` et valeurs de règles contenant de tels caractères sont refusés à la saisie (2). Raison : 200 caractères au plus, motif 300.
- Secrets refusés (1) dans tout texte libre : clés connues (AWS, GitHub, OpenAI/Anthropic, Slack, Stripe, Google), blocs de clé privée, JWT, `Bearer …`, `password=`/`mdp:`/`token=`/`api_key=`/`secret=` suivis d'une valeur, « mot de passe est … », URL `user:mdp@`, hexadécimal long près d'un mot-clé, chaîne de 40 caractères ou plus mêlant majuscules, minuscules et chiffres. Un sha git complet est refusé : citez-en 10 caractères.
- Un chemin hors du dépôt (absolu extérieur, `..`) est refusé (2) par `verrouiller`.
- Les heures affichées sont locales (avec la date si ce n'est pas aujourd'hui) ; les fichiers du tableau restent en ISO UTC.

## Refus courants

| Message | Que faire |
|---|---|
| « Verrou refusé » | Un autre tient le chemin : lui écrire (`envoyer`) ou choisir un autre fichier. |
| « zone protégée » | Demander l'accord de l'humain, puis `verrouiller … --accord-humain`. |
| « Domaine inconnu » / « Sujet invalide » | Reprendre un domaine de la liste, un sujet en minuscules avec des tirets. |
| « Les tâches ne sont pas gérées par SAGA » | Normal ici : voir le tableau GitHub du projet. |
| « Entrée refusée : elle ressemble à un secret » | Reformuler sans la valeur. |
| Sortie 5 (contention) | Réessayer une fois ; le message de git est joint. |

## Motifs de verrou et de zone

Ancrés à la racine ; `\` devient `/` ; comparaison insensible à la casse (l'affichage garde la casse tapée) ; NFC ; `..` refusé ; `.` ou vide = tout le dépôt.
`*`, `?`, `[abc]` ne traversent pas `/` ; `**` = zéro, un ou plusieurs dossiers ; un motif couvre aussi tout ce qui est sous un dossier qu'il désigne (`backend/src` couvre `backend/src/a.js`).
Deux fonctions : `couvre` (exacte, pour un chemin concret : `verifier`, hook) et `chevauche` (prudente, pour deux motifs : prise de verrou ; faux positifs possibles, jamais de faux négatif voulu).

## Formats sur la branche `saga`

Fichiers JSON UTF-8, fin de ligne `\n`, indentés sur 2 espaces. Dates ISO UTC. Aucun `:` dans les noms de fichiers.

```
README.md
regles.json
agents/<nom>.json
journal/<nom>/<AAAAMMJJTHHMMSSmmmZ>-<6 hex>.json
verrous/<sha1(motif normalisé)[0:12]>.json
messages/<nom|tous>/<AAAAMMJJTHHMMSSmmmZ>-<de>-<6 hex>.json
taches/<id>.json            (seulement si taches_actives=oui)
```

`regles.json` : `{ version, integration: {mode, qui_fusionne, branche_cible, commande_tests, modele_branche}, autonomie: {…}, verrous: {ttl_min, inactif_min, verrou_obligatoire}, journal: {obligatoire, intervalle_min, jours}, zones_protegees: [], gardiens: [], domaines: [], max_taches_par_agent, messages_jours, taches_actives, taches_reference }`

`agents/<nom>.json` : `{ nom, humain, cle, etat: actif|parti, tache, branche, arrive, vu, regles_lues, version }` (inactif = `vu` plus vieux que `inactif_min`, calculé à la lecture ; sans tâches, `branche` est la branche git courante, mise à jour à chaque écriture de l'agent).

`verrous/<clé>.json` : `{ motif, proprio, raison, tache, depuis, expire, accord }` (actif tant que `expire` est dans le futur).

`messages/<dest>/<…>.json` : `{ de, a, quand, type: texte|annonce|proposition-regle, texte, tache, evt }`

Noms d'agents : `^[a-z0-9][a-z0-9-]{1,23}$`, `tous` réservé. Les commits du tableau sont faits sans hook, sans signature, avec `[skip ci]`, sous l'auteur `<nom>@saga.invalid`.

## État local (jamais poussé)

Dans `.git/` : `saga/moi.json`, `saga/lus.json`, `saga/banniere.json` et `saga/journal.json` (par worktree : date et empreinte de la dernière entrée, commits déjà consignés, marque anti-boucle du hook) ; `refs/saga/tableau`, `refs/saga/cible` et `saga/cache.json` (partagés entre worktrees).
