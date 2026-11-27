# AGENTS.md — Règles du projet BlaBlaNoSQL

Règles communes à **tous les contributeurs : membres de l'équipe et agents IA**.
Elles s'appliquent dès la première ligne de code. Ce qui n'est pas encore décidé est signalé « à décider » :
ne pas trancher seul, ouvrir la discussion (issue ou message au rôle concerné).

Documents liés :

- [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md) — checklist à valider avant de demander une relecture.
- [CONTRIBUTING.md](CONTRIBUTING.md) — installation et workflow au quotidien.
- [docs/](docs/) — architecture, API, modèles de données, sécurité, organisation Git.

---

## 1. Ordre d'autorité

1. La consigne de l'issue ou de la personne responsable de la tâche.
2. Ce fichier et [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md).
3. La documentation de `docs/` (contrat d'API, tables Cassandra, rôles JWT).
4. Le code voisin : reprendre ses patterns plutôt qu'en inventer.

Si le code et la doc divergent, **le signaler** plutôt que de choisir silencieusement.

---

## 2. Stack

| Élément         | Choix                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Runtime         | Node.js LTS (≥ 22), gestionnaire **npm** — pas de yarn / pnpm / bun   |
| Langage         | **JavaScript** (ES modules, `"type": "module"`), typage par JSDoc     |
| API             | Express 5 (API REST, préfixe `/api`)                                  |
| Front           | React + Vite                                                          |
| Base principale | Apache Cassandra, driver officiel `cassandra-driver`                  |
| Seconde base    | À décider — voir [docs/bdd-secondaire.md](docs/bdd-secondaire.md)     |
| Sécurité        | JWT (`jsonwebtoken`), mots de passe hachés (bcrypt ou argon2)         |
| Tests back      | Runner natif `node:test` + `node:assert/strict`                       |
| Formatage       | Prettier 3                                                            |
| Lint            | ESLint 9 (flat config)                                                |

- Le lockfile committé est `package-lock.json` (un par dossier `backend/` et `frontend/`). Installer avec `npm ci`
  quand le lockfile existe, `npm install <paquet>` uniquement pour ajouter une dépendance.
- **Nouvelle dépendance = justification** dans la PR (besoin, taille, maintenance, alternatives natives).
  Préférer ce que Node fait déjà (`node:test`, `node:crypto`, `fetch`, `--watch`, `--env-file`).

### Scripts attendus

À créer avec les squelettes (issues #9 et #17). Ne pas documenter ni appeler un script qui n'existe pas encore.

| Dossier     | Scripts                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------- |
| `backend/`  | `dev`, `start`, `test`, `test:coverage`, `lint`, `lint:fix`, `format`, `format:check`     |
| `frontend/` | `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`                   |

---

## 3. Architecture back (`backend/`)

```
backend/
  app.js          point d'entrée : middlewares globaux, montage des routes, gestionnaire d'erreurs
  config/         lecture de l'environnement, clients Cassandra et seconde base
  routes/         xxx.routes.js      — déclaration des endpoints et chaînage des middlewares
  middlewares/    authenticate, authorize, isOwner, validate, errorHandler
  controllers/    xxx.controller.js  — lit la requête, appelle le service, met en forme la réponse HTTP
  services/       xxx.service.js     — logique métier
  models/         xxx.model.js       — requêtes CQL / seconde base pour une table ou collection
  utils/          helpers techniques (AppError, mapping de lignes…)
tests/            miroir de controllers/, services/, models/, middlewares/
```

| Couche       | Responsabilité                                                    | Ce qu'elle ne fait **jamais**                      |
| ------------ | ----------------------------------------------------------------- | -------------------------------------------------- |
| `routes`     | Associer méthode + chemin à une chaîne de middlewares + controller | Contenir de la logique                             |
| `middlewares`| Authentifier, vérifier le rôle / la propriété, valider l'entrée   | Logique métier                                     |
| `controller` | Extraire `params` / `query` / `body` / `req.user`, appeler le service, répondre | Calcul métier, requête en base     |
| `service`    | Règles métier (places restantes, droit de noter, progression…)    | Lire `req` / `res`, écrire du CQL                  |
| `model`      | Requêtes préparées, mapping `snake_case` (base) ↔ `camelCase` (JS) | Logique métier, contrôle de droits                 |

- **Sens de dépendance :** `routes → middlewares → controller → service → model → config`. Jamais l'inverse,
  jamais de saut de couche (un controller n'importe jamais un model ni un client de base).
- **Un fichier = une classe ou un module = une ressource.** Controllers, services et models exportent une instance
  unique (`export const tripService = new TripService();`) : c'est ce qui permet de les mocker dans les tests.
- **Ordre dans une méthode de controller :** 1) récupérer les données de la requête → 2) appeler le service avec des
  données déjà validées → 3) répondre (`res.status(201).json(...)`). Les contrôles d'accès et de format ont déjà été
  faits par les middlewares de la route.
- **Erreurs :** lever une `AppError(status, code, message)` ; Express 5 propage les promesses rejetées vers
  `errorHandler`, qui seul formate la réponse `{ "error": { "code": "...", "message": "..." } }`.
  Pas de `try/catch` qui renvoie lui-même une réponse dans un controller.
- **Une fonction = une chose.** Au-delà de ~40 lignes, découper en fonctions privées. Une méthode publique se lit de
  haut en bas.

### Contrat d'API

- [docs/api-rest.md](docs/api-rest.md) est le contrat entre le back et le front. **Toute route ajoutée, modifiée ou
  supprimée est mise à jour dans ce fichier dans la même PR.**
- JSON en `camelCase`, codes HTTP et format d'erreur tels que définis dans le contrat.
- Les listes sont paginées (`limit` borné côté serveur).

---

## 4. Bases de données

### Cassandra (base principale)

- **Une table par requête.** La clé de partition se déduit de la requête ; la dénormalisation est assumée.
- Toute nouvelle table ou requête est ajoutée à [docs/bdd-cassandra.md](docs/bdd-cassandra.md) (tableau des
  requêtes Q1…Qn et tableau des tables) **avant** d'être codée.
- **Interdits :** `ALLOW FILTERING`, index secondaire sans justification écrite dans la doc, partition non bornée
  (penser au découpage par jour comme `positions_by_trip`).
- **Requêtes préparées uniquement** : `client.execute(query, params, { prepare: true })`. Jamais de concaténation
  ni de template string contenant une valeur.
- Écriture d'une même donnée dans plusieurs tables dénormalisées : `BATCH` logué, dans le model concerné.
- Niveaux de cohérence explicites, conformes à [docs/architecture.md](docs/architecture.md) : `LOCAL_QUORUM` pour
  utilisateurs et réservations, `ONE` pour les positions. Gestion des places : LWT (`IF seats_left > ...`) ou
  solution décidée et documentée.
- Le schéma vit dans `database/` (fichiers `.cql` rejouables), les scripts d'import et le simulateur GPS dans
  `scripts/`. Pas de création de table depuis le code applicatif.

### Seconde base

- Tant que [docs/bdd-secondaire.md](docs/bdd-secondaire.md) n'a pas de décision, **ne rien coder qui en dépende**.
- Une fois choisie : même règles (accès uniquement dans `models/`, requêtes paramétrées, connexion dans `config/`),
  et la stratégie de synchronisation avec Cassandra documentée avant le code.

### Données de démo

- Jamais de donnée personnelle réelle. Jeux open data ou générés ; source et licence notées dans `database/`.
- Les mots de passe du seed sont hachés comme en production.

---

## 5. Architecture front (`frontend/`)

```
src/
  pages/       un écran par fichier (PascalCase.jsx)
  components/  composants réutilisables (PascalCase.jsx)
  services/    appels à l'API : seul endroit qui fait des requêtes HTTP
  hooks/       hooks personnalisés (useAuth.js, useTrips.js…)
  contexts/    contexte d'authentification (jeton, rôle)
  layouts/     mises en page publique / connectée
  assets/      images, styles
```

- **Composants fonctionnels et hooks uniquement.** Pas de composant classe.
- Un composant ne fait jamais `fetch` lui-même : il passe par un hook ou par `src/services/`.
- L'URL de l'API vient de `import.meta.env.VITE_API_URL`, jamais en dur.
- Le jeton est ajouté à l'en-tête `Authorization: Bearer` par `src/services/` uniquement. Stockage : à décider
  (voir [docs/jwt-securite.md](docs/jwt-securite.md)).
- Les routes protégées vérifient le rôle côté front **pour l'affichage seulement** : la vraie vérification est
  toujours faite par l'API.
- Gérer les trois états de chaque appel : chargement, erreur (message lisible), succès (y compris liste vide).
- **Aucun test front n'est exigé.**

---

## 6. Conventions de code

- **Langue :** identifiants, commentaires et JSDoc **en anglais** ; documentation, issues, commits et PR **en
  français**.
- **JSDoc** sur les fonctions exportées (paramètres, retour, erreurs levées) et sur la logique non évidente.
  Les commentaires expliquent le _pourquoi_, pas le _quoi_.
- `const` par défaut, `let` seulement si réassignation, jamais `var`.
- Toutes les promesses sont `await`ées ; pas de `.then()` mélangé avec `async/await`.
- **Pas d'échec silencieux :** aucun `catch` vide ; on journalise et on propage, ou on transforme en `AppError`.
- Vérifier `null` / `undefined` avant usage ; early returns plutôt qu'imbrications.
- Pas de `console.log` de debug laissé dans le code livré.

### Nommage des fichiers

| Élément             | Format                     | Exemple                                  |
| ------------------- | -------------------------- | ---------------------------------------- |
| Route back          | `ressource.routes.js`      | `trip.routes.js`                         |
| Controller / service / model | `ressource.<couche>.js` | `booking.service.js`                 |
| Middleware          | `camelCase.js`             | `authorize.js`                           |
| Test back           | `ressource.<couche>.test.js` | `tests/services/booking.service.test.js` |
| Composant / page    | `PascalCase.jsx`           | `TripCard.jsx`, `SearchPage.jsx`         |
| Hook                | `useXxx.js`                | `useTracking.js`                         |
| Service front       | `ressourceApi.js`          | `tripApi.js`                             |

Les noms de fichiers back sont **au singulier** ; les URL restent au pluriel (`/api/trips`).
Colonnes et tables Cassandra en `snake_case`.

### Formatage et lint

Prettier fait autorité, ce n'est pas un sujet de relecture : **4 espaces** (2 pour `.json`, `.yml`, `.md`),
**128 colonnes**, guillemets doubles, point-virgule, virgule finale, fin de ligne `lf`.
Activer le format-on-save dans l'éditeur.

- Pas de `// eslint-disable` sans commentaire qui justifie.
- **Ne jamais reformater un fichier sans rapport avec la tâche** : le diff doit rester relisible.

---

## 7. Tests (back obligatoire)

- Runner natif : `import { describe, it, beforeEach, afterEach, mock } from "node:test";` et
  `import assert from "node:assert/strict";`.
- Emplacement `backend/tests/`, en miroir des dossiers testés. Un `describe` par module, un `describe` imbriqué par
  méthode.
- À tester : **services**, **middlewares** (JWT, rôles, propriété, validation) et **models** (requête et paramètres
  envoyés au driver). Les controllers sont testés si leur mise en forme n'est pas triviale.
- **Toujours mocker la couche du dessous** : `mock.method(tripModel, "findById", async () => ...)`, puis
  `mock.restoreAll()` en `afterEach`. **Aucun test ne touche une vraie base.**
- Couvrir : le cas nominal, au moins un cas d'erreur, les cas limites (liste vide, valeur absente, 0 place restante,
  bornes de pagination).
- Cas de sécurité obligatoires (voir [docs/jwt-securite.md](docs/jwt-securite.md)) : sans jeton, jeton expiré, jeton
  falsifié → 401 ; mauvais rôle → 403 ; ressource d'un autre utilisateur → 403.
- Objectif : **80 % de couverture** (lignes, branches) sur le code back touché par la PR.

---

## 8. Sécurité

- **Toute entrée externe est non fiable** (`body`, `params`, `query`, en-têtes) : validée par un middleware avant
  d'atteindre le controller (type, format, longueur, bornes).
- **Contrôle des droits dans la chaîne de middlewares** de chaque route (`authenticate`, `authorize(...roles)`,
  `isOwner`). Ne jamais retirer, contourner ou affaiblir une vérification existante.
- Mots de passe hachés, **jamais** renvoyés par l'API ni journalisés. Idem pour les jetons.
- **Aucun secret dans le dépôt.** Tout passe par `.env` (ignoré par Git). Chaque nouvelle variable est ajoutée à
  [.env.example](.env.example) avec une valeur factice, dans la même PR.
- CORS limité à l'origine du front ; limitation des tentatives de connexion.
- Front : pas de `dangerouslySetInnerHTML` avec du contenu utilisateur ; liens externes limités à `https:` et
  `mailto:`.
- Pas d'`eval`, `new Function` ni d'exécution de commande construite depuis une entrée.

---

## 9. Git et collaboration

Les règles complètes sont dans [docs/organisation-git.md](docs/organisation-git.md). L'essentiel :

- `main` et `develop` protégées, jamais de commit direct. Une branche `feature/<domaine>-<sujet>` par issue, depuis `develop`.
- Commits `type(portée): résumé à l'impératif` (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`), petits et
  fréquents, un sujet par commit.
- **Une intention par PR** : ne pas mélanger une fonctionnalité et un refactor sans rapport.
- Le format des PR et leur processus de relecture sont gérés par la personne responsable ; suivre ses consignes.
- Ne pas modifier le code d'une issue attribuée à quelqu'un d'autre sans s'être coordonné avec cette personne.
- Jamais committer : `.env`, `node_modules/`, builds, fichiers de couverture, secrets.

### Discipline de changement

- Le plus petit changement qui résout l'issue.
- Mettre à jour la doc (`docs/`, `.env.example`, README) **dans la même PR** que le changement de comportement.
- Préserver le nommage, les imports et la structure des fichiers modifiés.
- Ne pas dupliquer un utilitaire, un composant ou une validation qui existe déjà : le réutiliser ou l'étendre.
- Un choix structurant (bibliothèque, modèle de données, convention) se documente dans `docs/` avant ou avec le code.

---

## 10. Règles spécifiques aux agents IA

En plus de tout ce qui précède :

1. **Lire ce fichier et [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md) avant de coder**, puis la doc de `docs/`
   liée à la tâche.
2. Partir de l'issue ou du fichier concerné ; ne pas explorer ni modifier des zones sans rapport.
3. **Aucun `git commit`, `git push`, création de branche distante ou de PR sans demande explicite** de la personne
   qui pilote l'agent.
4. Ne pas inventer de commande, de script, de route ou de table : vérifier qu'elle existe dans le code ou la doc.
   Si elle manque, le dire.
5. Ne prendre aucune décision marquée « à décider » (seconde base, stockage du jeton, refresh token, WebSocket…) :
   proposer des options et laisser l'équipe trancher.
6. Ne jamais lire, afficher ou recopier le contenu de `.env` ; ne jamais écrire de secret réel dans un fichier.
7. Ne pas ajouter de dépendance sans l'annoncer et la justifier.
8. Lancer les contrôles de la [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md) et **rapporter leur résultat
   réel**, y compris les échecs. Ne pas présenter comme terminé un travail non vérifié.
9. Signaler explicitement ce qui a été laissé de côté, et pourquoi.
10. Le code produit par un agent est relu par un humain comme n'importe quel autre code : l'auteur de la PR en
    reste responsable.
