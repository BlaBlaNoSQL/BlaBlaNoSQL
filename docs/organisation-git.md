# Organisation Git

## Branches

| Branche | Rôle | Règle |
|---|---|---|
| `main` | Version stable livrable | Protégée, jamais de commit direct, fusion depuis `dev` uniquement |
| `dev` | Intégration | Protégée, fusion par PR depuis les `feature/*` |
| `feature/*` | Une branche par fonctionnalité | Créée depuis `dev`, supprimée après fusion |

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

- Obligatoires : aucune fusion dans `dev` ou `main` sans PR.
- Au moins une relecture approuvée par un autre membre (relecteur de l'autre pôle si possible).
- PR liée à une issue (`Closes #n`), description courte de ce qui change et comment le tester.
- Pas de conflit, application qui démarre, avant la fusion.
- Fusion par le Chef de projet ou l'auteur après approbation.
- `main` : mise à jour uniquement aux jalons (backend opérationnel, front connecté, release candidate, livraison).

## Au quotidien

```bash
git switch dev && git pull
git switch -c feature/<domaine>-<sujet>
# ... travail, commits ...
git push -u origin feature/<domaine>-<sujet>   # puis ouvrir la PR vers dev
```

Issues : voir [issues-a-creer.md](issues-a-creer.md). Une issue = un responsable.
