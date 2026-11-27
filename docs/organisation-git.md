# Organisation Git

## Branches

| Branche | Rôle | Règle |
|---|---|---|
| `main` | Version stable livrable | Protégée, jamais de commit direct, fusion depuis `develop` uniquement |
| `develop` | Intégration | Protégée, fusion par PR depuis les `feature/*` |
| `feature/*` | Une branche par fonctionnalité | Créée depuis `develop`, supprimée après fusion |

Nommage : `feature/<domaine>-<sujet>`, par exemple `feature/api-reservations`, `feature/front-recherche`, `feature/bdd-schema-cassandra`.

## Commits

Format : `type(portée): résumé à l'impératif, sans point final`

| Type | Usage |
|---|---|
| feat | Nouvelle fonctionnalité |
| fix | Correction de bug |
| docs | Documentation |
| refactor | Refactorisation sans changement de comportement |
| test | Ajout ou modification de tests |
| chore | Outillage, configuration, dépendances |

Exemples : `feat(api): ajoute la réservation d'une place`, `docs(bdd): décrit la table positions_by_trip`.
Commits fréquents, petits, un sujet par commit.

## Pull requests

- Obligatoires : aucune fusion dans `develop` ou `main` sans PR.
- Au moins une relecture approuvée par un autre membre (relecteur de l'autre pôle si possible).
- PR liée à une issue (`Closes #n`, ou `Refs #n` si le travail n'est pas terminé), description courte de ce qui change et comment le tester. Le [modèle de PR](../.github/pull_request_template.md) donne la trame.
- Pas de conflit, application qui démarre, avant la fusion.
- Fusion par le Chef de projet ou l'auteur après approbation.
- `main` : mise à jour uniquement aux jalons (backend opérationnel, front connecté, release candidate, livraison).

## Intégration continue

GitHub Actions vérifie chaque PR, ainsi que chaque push sur `main` et `develop`.

| Check | Vérifie |
|---|---|
| `CI OK` | Résumé de la CI : aucun `.env` ni `node_modules` versionné, `backend/` et `frontend/` (seulement s'ils sont modifiés), syntaxe des workflows |
| `Règles PR` | Titre au format des commits ; une PR vers `main` vient de `develop` ; les autres PR citent une issue (sauf Dependabot) |

Un `backend/` ou `frontend/` est testé dès qu'il contient un `package.json`. Il doit alors respecter ces règles :

- Gestionnaire de paquets : npm, avec `package-lock.json` versionné.
- Version de Node : celle de [`.nvmrc`](../.nvmrc).
- Scripts lancés s'ils existent : `lint`, `format:check`, `typecheck`, `test`, `build`. Un avertissement signale l'absence de `lint` ou `test` (et de `build` côté front).
- `test` doit se terminer seul (pas de mode watch).

Avant de pousser, dans le dossier modifié : `npm ci && npm run lint && npm test`.

## Issues et tableau du projet

Le suivi se fait dans le [tableau du projet](https://github.com/orgs/BlaBlaNoSQL/projects/1).

1. Créer l'issue avec un des modèles (*Tâche ou fonctionnalité*, *Bug*). Elle est ajoutée au tableau si son auteur a le droit d'écriture sur le projet.
2. S'assigner l'issue et la passer en cours sur le tableau.
3. Ouvrir la PR avec `Closes #n` dans la description.
4. À la fusion, l'issue est fermée, y compris quand la PR vise `develop` (workflow [`tickets.yml`](../.github/workflows/tickets.yml)). Pour une PR venant d'un fork, la fermer à la main tant que `develop` n'est pas la branche par défaut.

Les modèles d'issue et de PR ne sont proposés par GitHub qu'une fois présents sur la **branche par défaut**.

## Réglages GitHub (à faire une fois, par un administrateur)

### Branche par défaut

Dans *Settings > General*, choisir `develop`. Les PR la visent alors d'office, les modèles s'activent dès la fusion dans `develop` et GitHub lie lui-même les PR aux issues citées.

### Protection des branches

Dans *Settings > Rules > Rulesets*, pour `main` et la branche d'intégration :

- Exiger une PR avec au moins une approbation.
- Exiger les checks `CI OK` et `Règles PR` (ils n'apparaissent dans la liste qu'après un premier passage).
- Interdire les push forcés et la suppression de la branche.

### Tableau du projet

Dans le projet, menu en haut à droite > *Workflows*, activer :

| Workflow | Réglage |
|---|---|
| Auto-add to project | Dépôt `BlaBlaNoSQL`, filtre `is:issue,pr` (un seul workflow de ce type en offre gratuite) |
| Item added to project | Statut de départ |
| Item reopened | Statut « en cours » |
| Item closed | Statut « terminé » |
| Pull request merged | Statut « terminé » |

Vérifier aussi que les membres de l'équipe ont le droit d'écriture sur le projet et sur le dépôt.

### Labels

```bash
gh label create back     --color 1d76db --description "API Express"
gh label create front    --color 5319e7 --description "Application React"
gh label create bdd      --color 0e8a16 --description "Bases de données"
gh label create securite --color b60205 --description "JWT et sécurité"
gh label create doc      --color 0075ca --description "Documentation"
```

Les modèles d'issue demandent le domaine mais ne posent pas ces labels : les ajouter au moment du tri.

## Au quotidien

```bash
git switch develop && git pull
git switch -c feature/<domaine>-<sujet>
# ... travail, commits ...
git push -u origin feature/<domaine>-<sujet>   # puis ouvrir la PR vers develop
```

Issues : voir [issues-a-creer.md](issues-a-creer.md). Une issue = un responsable.
