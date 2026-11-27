# database/AGENTS.md : règles des bases de données

S'ajoute aux [règles communes](../AGENTS.md). Vaut pour `database/` et pour `scripts/` (import, simulateur GPS).
Pôles concernés : Architecte NoSQL, base principale, base secondaire.
Base de départ : les responsables de ces pôles la confirment ou l'ajustent avec leur plan (PR validée par eux).

Références : [docs/bases/cassandra.md](../docs/bases/cassandra.md) (requêtes et tables),
[docs/bases/seconde-base.md](../docs/bases/seconde-base.md) (choix et justification), [docs/architecture/architecture.md](../docs/architecture/architecture.md)
(répartition des données, cohérence, réplication).

## 1. Cassandra (base principale)

- **Une table par requête.** La clé de partition se déduit de la requête ; la dénormalisation est assumée.
- **La doc d'abord** : toute nouvelle table ou requête est ajoutée à [docs/bases/cassandra.md](../docs/bases/cassandra.md)
  (tableau des requêtes Q1…Qn et tableau des tables) **avant** d'être codée, et le pôle API est prévenu.
- Tables et colonnes en `snake_case`.
- **Interdits** : `ALLOW FILTERING`, index secondaire sans justification écrite dans la doc, partition non bornée (découper,
  par exemple par jour, comme `positions_by_trip`).
- **Requêtes préparées uniquement.** Jamais de concaténation ni de chaîne construite avec une valeur.
- Une même donnée écrite dans plusieurs tables dénormalisées : un `BATCH` logué, dans le model concerné.
- Niveaux de cohérence explicites, conformes à [docs/architecture/architecture.md](../docs/architecture/architecture.md) : `LOCAL_QUORUM` pour les
  utilisateurs et les réservations, `ONE` pour les positions.
- Le schéma vit dans `database/`, en fichiers `.cql` rejouables sur une base vide. Pas de création de table depuis le code
  applicatif.

## 2. Seconde base

- Tant que [docs/bases/seconde-base.md](../docs/bases/seconde-base.md) n'a pas de décision, **ne rien coder qui en dépende**.
- Le choix se justifie selon les 7 critères du sujet : volumétrie, performance, temps réel, modèle de données, cohérence,
  disponibilité, complexité des requêtes.
- Une fois choisie : mêmes règles (accès dans les models du back uniquement, requêtes paramétrées, connexion dans la
  configuration), et la synchronisation avec Cassandra est documentée avant le code.

## 3. Données de démo

- Jamais de donnée personnelle réelle. Jeux open data ou générés ; la source et la licence sont notées dans `database/`.
- Les mots de passe du jeu de démo sont hachés comme en production.
- Les scripts d'import et le simulateur de positions vivent dans `scripts/`. Ils sont rejouables et ne contiennent aucun
  secret : la connexion vient de `.env`.

## 4. Ce qui compte pour la note

La modélisation NoSQL, le choix de la seconde base et les requêtes complexes pèsent 10 points sur 20. Chaque choix de
modèle (clé de partition, dénormalisation, niveau de cohérence, TTL) est **écrit et justifié dans `docs/`**, pas seulement
dans le code.
