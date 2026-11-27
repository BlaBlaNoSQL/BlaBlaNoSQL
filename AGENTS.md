# AGENTS.md : règles communes du projet BlaBlaNoSQL

Règles communes à **toute l'équipe et à tous les agents IA** (Claude Code, Copilot, Cursor…).
Ce fichier est chargé à chaque session : il reste court. Les règles propres à un dossier sont dans le `AGENTS.md` de ce
dossier.

| Tu travailles sur       | Lis aussi                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `backend/`              | [backend/AGENTS.md](backend/AGENTS.md) : couches, erreurs, tests, sécurité de l'API       |
| `frontend/`             | [frontend/AGENTS.md](frontend/AGENTS.md) : structure React, responsive, accessibilité     |
| `database/`, `scripts/` | [database/AGENTS.md](database/AGENTS.md) : Cassandra, seconde base, données de démo       |
| une PR à ouvrir         | [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md) : checklist de fin de tâche                |
| ton premier jour        | [CONTRIBUTING.md](CONTRIBUTING.md) : installation et déroulé d'une tâche                  |
| un point de référence   | [docs/README.md](docs/README.md) : sommaire de la documentation, rangée par pôle          |
| une décision passée     | [docs/decisions.md](docs/decisions.md) : journal des décisions de l'équipe                |

## 1. Ordre d'autorité

1. La consigne de la personne responsable de la tâche (carte du [tableau du projet](https://github.com/orgs/BlaBlaNoSQL/projects/1)
   ou issue).
2. Ce fichier, le `AGENTS.md` du dossier concerné et la [Definition of Done](DEFINITION_OF_DONE.md).
3. La documentation de `docs/` (contrat d'API, tables Cassandra, rôles JWT).
4. Le code voisin : reprendre ses patterns plutôt qu'en inventer.

Si deux sources se contredisent, **le signaler** au lieu de choisir en silence.

## 2. Décisions de l'équipe (réunion des responsables du 27/11/2026)

- **Code en anglais** : identifiants, commentaires, JSDoc. **Le texte affiché sur le site est en français.**
  La documentation et les PR sont en français.
- **Nommage en `snake_case`.** Sa portée exacte reste à préciser : voir §7.
- **Branches** : `feature/<domaine>-<sujet>` depuis `develop`, par exemple `feature/api-reservations`.
- **SOLID autant que possible**, sans dogmatisme : une responsabilité par module, du code facile à modifier, aucun design
  pattern imposé.
- **2 approbations par PR** : le responsable de ton pôle + une personne du pôle Qualité.
- **Application web responsive** (téléphone et PC), pas d'application mobile.
- **Accessibilité dès la maquette** : bons contrastes, jamais une information donnée par la couleur seule.
- **Pôles en chaîne** : base de données, puis API, puis React. Quand un pôle livre quelque chose dont le suivant dépend, il
  le lui dit et met `docs/` à jour dans la même PR.
- **Désaccord dans une équipe** : le Chef de projet tranche. Ne pas rester bloqué.

## 3. Stack

Proposition de départ : chaque responsable de pôle la confirme ou l'ajuste avec le plan de son pôle.

| Élément         | Choix                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Runtime         | Node.js, version de [`.nvmrc`](.nvmrc) ; gestionnaire **npm** uniquement   |
| Langage         | JavaScript (ES modules), typage par JSDoc                                  |
| API             | Express (API REST, préfixe `/api`)                                         |
| Front           | React + Vite                                                               |
| Base principale | Apache Cassandra (imposée), driver `cassandra-driver`                      |
| Seconde base    | À décider : [docs/bases/seconde-base.md](docs/bases/seconde-base.md)               |
| Sécurité        | JWT avec rôles, mots de passe hachés                                       |
| Qualité         | ESLint, Prettier, tests back avec le runner natif `node:test`              |

- Un `package-lock.json` versionné par dossier (`backend/`, `frontend/`). `npm ci` pour installer.
- **Nouvelle dépendance = justification dans la PR.** Préférer ce que Node fait déjà (`node:test`, `node:crypto`, `fetch`).
- La CI lance, s'ils existent, les scripts `lint`, `format:check`, `typecheck`, `test` et `build` du dossier modifié.

## 4. Git et PR

Le détail est dans [docs/equipe/organisation-git.md](docs/equipe/organisation-git.md).

- **Aucun push direct** sur `main` ni sur `develop`. Une branche par tâche, depuis `develop` à jour.
- **Commits** : `type(portée): summary`, en anglais, à l'impératif, petits, un sujet par commit.
  Types : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- **PR vers `develop`** : titre `type(portée): résumé` en français (vérifié par le check `Règles PR`), description qui dit
  ce qui change et comment le tester. `main` ne reçoit que les PR de jalon venant de `develop`.
- **Une intention par PR**, et le plus petit changement qui la réalise.
- La doc touchée par le changement (`docs/`, `.env.example`, README) est mise à jour **dans la même PR**.
- Ne pas reformater ni renommer ce qui n'a pas de rapport avec la tâche : le diff doit rester relisible.
- Ne pas modifier le travail en cours de quelqu'un d'autre sans s'être coordonné avec lui.
- Jamais dans un commit : `.env`, `node_modules/`, builds, fichiers de couverture, secrets.

## 5. Sécurité

- **Aucun secret dans le dépôt.** Tout passe par `.env` (ignoré par Git). Chaque nouvelle variable est ajoutée à
  [.env.example](.env.example) avec une valeur factice, dans la même PR.
- Toute entrée externe est non fiable : elle est validée avant d'être utilisée.
- Ne jamais retirer, contourner ou affaiblir une vérification de droits existante.
- Jamais de donnée personnelle réelle dans les jeux de données, les tests ou les captures.

## 6. Règles propres aux agents IA

1. Lire ce fichier et le `AGENTS.md` du dossier concerné avant de coder, puis la doc de `docs/` liée à la tâche.
2. Partir de la tâche ou du fichier concerné ; ne pas explorer ni modifier des zones sans rapport.
3. **Aucun `git commit`, `git push`, création de branche distante ou de PR sans demande explicite** de la personne qui
   pilote l'agent.
4. Ne pas inventer de commande, de script, de route ou de table : vérifier qu'elle existe dans le code ou la doc. Si elle
   manque, le dire.
5. Ne trancher aucun point de la liste « À décider » (§7) : proposer des options et laisser l'équipe choisir.
6. Ne jamais lire, afficher ou recopier le contenu de `.env` ; ne jamais écrire de secret réel dans un fichier.
7. Avant de dire qu'une tâche est finie : lire la [Definition of Done](DEFINITION_OF_DONE.md), lancer ses contrôles et
   **rapporter leur résultat réel**, échecs compris.
8. Dire explicitement ce qui a été laissé de côté, et pourquoi.
9. Le code produit par un agent est relu comme n'importe quel autre : l'auteur de la PR en reste responsable.

## 7. À décider (ne pas trancher seul)

| Sujet                    | État                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Portée du `snake_case`   | Acquis : tables et colonnes Cassandra. Imposé par React : composants en `PascalCase`, hooks en `useXxx`. À décider : variables et fonctions JavaScript, noms de fichiers, champs JSON de l'API. En attendant : suivre le code voisin, ne pas renommer l'existant. |
| Langue des commits       | Anglais, d'après [docs/equipe/organisation-git.md](docs/equipe/organisation-git.md). À confirmer par les responsables. |
| Seconde base NoSQL       | [docs/bases/seconde-base.md](docs/bases/seconde-base.md). Ne rien coder qui en dépende avant la décision.       |
| Stockage du jeton, refresh token | [docs/securite/jwt.md](docs/securite/jwt.md)                                                    |
| Suivi de position        | Interrogation régulière de l'API ou WebSocket                                                           |
| Pagination               | Par page ou par curseur : [docs/api/api-rest.md](docs/api/api-rest.md)                                          |
| Places restantes         | Transaction légère ou compteur séparé : [docs/bases/cassandra.md](docs/bases/cassandra.md)                  |
| Périmètre du cluster     | Deux datacenters simulés ou un seul nœud : [docs/architecture/architecture.md](docs/architecture/architecture.md)                 |

Une fois un point tranché : l'écrire dans le fichier de `docs/` concerné, l'ajouter à
[docs/decisions.md](docs/decisions.md) et le retirer de cette liste, dans la même PR.

## 8. Modifier une règle

- Ce fichier et la Definition of Done : PR dédiée, validée par le Chef de projet et une personne du pôle Qualité.
- Le `AGENTS.md` d'un dossier : PR validée par le responsable du pôle concerné.
- Ne rien écrire dans les fichiers `CLAUDE.md` : ils ne font que charger le `AGENTS.md` voisin.
