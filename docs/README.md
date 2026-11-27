# Documentation du projet

Sommaire de `docs/`. Un tiroir par pôle : chaque pôle tient le sien à jour, dans la même PR que le changement qu'il décrit.
Les règles de travail, elles, sont dans [AGENTS.md](../AGENTS.md) et dans le `AGENTS.md` de chaque dossier de code.

## Les tiroirs

| Tiroir                          | Ce qu'on y trouve                                                                  | Tenu par                              |
| ------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| [architecture/](architecture/)  | [architecture.md](architecture/architecture.md) : schéma global, répartition des données, CAP, réplication | Architecte NoSQL        |
| [bases/](bases/)                | [cassandra.md](bases/cassandra.md) : requêtes et tables · [seconde-base.md](bases/seconde-base.md) : choix et justification | Pôles base principale et base secondaire |
| [api/](api/)                    | [api-rest.md](api/api-rest.md) : le contrat entre le back et le front              | Pôle API                              |
| [securite/](securite/)          | [jwt.md](securite/jwt.md) : rôles, jeton, middlewares, cas à tester                | Pôle Sécurité JWT                     |
| [front/](front/)                | [accessibilite.md](front/accessibilite.md) : règles d'accessibilité et vérifications | Pôle React                          |
| [equipe/](equipe/)              | [organisation-git.md](equipe/organisation-git.md) : branches, commits, PR, CI · [issues-a-creer.md](equipe/issues-a-creer.md) | Pôle Qualité et documentation |
| [assets/](assets/)              | Logo et bannière                                                                   | Pôle Qualité et documentation         |

[decisions.md](decisions.md) : le journal des décisions de l'équipe, une ligne par décision, la plus récente en haut.

## Où ranger un nouveau document

- **Dans le tiroir du pôle qui le tient**, pas à la racine de `docs/`. Seuls ce sommaire et `decisions.md` restent à la racine.
- **Un fichier par sujet**, nommé en minuscules avec des tirets : `jeu-de-donnees.md`, `maquettes.md`.
- **Le plan d'un pôle** (ce qu'il va faire et comment) : `plan.md` dans son tiroir.
- **Une image ou un schéma** d'un document : dans le même tiroir que lui. `assets/` ne sert qu'à l'identité du projet.
- **Un nouveau fichier s'ajoute à ce sommaire** dans la même PR.

## Ce qui est attendu au rendu

| Livrable du sujet        | Où il se trouve                                                              |
| ------------------------ | ---------------------------------------------------------------------------- |
| README                   | [README.md](../README.md) à la racine                                        |
| Documentation de l'API   | [api/api-rest.md](api/api-rest.md)                                           |
| Schéma des bases         | [bases/cassandra.md](bases/cassandra.md), [bases/seconde-base.md](bases/seconde-base.md), fichiers `.cql` de `database/` |
| Justification de la seconde base | [bases/seconde-base.md](bases/seconde-base.md)                       |
| Jeu de données de démo   | `database/` et `scripts/` ; sa source et sa licence y sont notées            |

## Tenir la documentation à jour

- La doc change **dans la même PR** que le code : une route livrée sans sa ligne dans le contrat d'API n'est pas finie.
- Une décision prise en réunion ou dans une PR s'ajoute à [decisions.md](decisions.md), et sort de la liste « À décider »
  d'[AGENTS.md](../AGENTS.md).
- Un document qui ne correspond plus au code se corrige ou se supprime : une doc fausse est pire que pas de doc.
