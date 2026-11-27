# Bases secondaires NoSQL : justification

Choix libre, justification obligatoire (2 points au barème). L'analyse complète (besoins, limites de Cassandra,
modèles, flux, optimisations) est dans [analyse-bdd.md](analyse-bdd.md).
Responsables : Responsable base secondaire et Architecte NoSQL.

## Candidats

| Candidat | Usage envisagé |
|---|---|
| Redis | Suivi temps réel (position courante, expiration, pub/sub) |
| MongoDB | Profils utilisateurs, recherche multicritère |
| Neo4j | Relations conducteurs / passagers, recommandations |

## Grille de justification

Notes de 1 à 5 : adéquation au besoin que la base porterait dans BlaBlaNoSQL.

| Critère | Redis | MongoDB | Neo4j | Justification / mesures |
|---|:-:|:-:|:-:|---|
| Volumétrie | 4 | 4 | 3 | Redis ne garde que l'état courant (1 entrée par trajet actif) ; MongoDB tient le disque ; Neo4j suit la croissance des relations |
| Performance (latence, débit) | 5 | 4 | 3 | RAM et O(1) / O(log N) ; index B-Tree ; graphe rapide en lecture, pas en écriture massive |
| Temps réel | 5 | 3 | 1 | Pub/Sub, Streams, TTL, `GEO` ; *change streams* ; rien |
| Modèle de données | 4 | 4 | 3 | `HASH` / `GEO` / `ZSET` pour la géolocalisation ; documents pour la recherche ; graphe pour une fonction non demandée |
| Cohérence | 4 | 4 | 4 | Positions tolérantes à un léger retard ; `w: majority` possible ; ACID |
| Disponibilité | 4 | 4 | 2 | Sentinel / Cluster ; replica set avec élection ; un seul nœud en édition Community |
| Complexité des requêtes | 3 | 5 | 5 | Accès par clé et `GEOSEARCH` ; agrégations et `2dsphere` ; traversées |
| **Total** | **29** | **28** | **21** | |

Rappel CAP :

| Base | Position | Comportement lors d'une partition réseau |
|---|---|---|
| Redis | AP | Réplication asynchrone : le service continue, quelques écritures peuvent être perdues lors d'une bascule |
| MongoDB | CP | Un seul primaire : sans majorité, plus d'écriture jusqu'à l'élection d'un nouveau primaire |
| Neo4j | CP | Transactions ACID ; en cluster (Enterprise), écritures refusées sans majorité |

## Décision

Validée par l'enseignant le 27/11/2026.

- **Bases retenues : Redis et MongoDB**, en plus de Cassandra. Neo4j est écarté : aucune fonctionnalité demandée ne
  repose sur des relations entre utilisateurs.
- **Données qu'elles portent :**
  - Redis : position courante des trajets, véhicules en circulation (`GEO`), diffusion en direct, cache des
    recherches, tentatives de connexion, jetons révoqués, Streams d'événements.
  - MongoDB : copie des trajets dédiée à la recherche multicritère et géographique (`trips_search`), statistiques.
- **Pourquoi Cassandra ne suffit pas :**
  - Temps réel : Cassandra ne prévient pas le front d'un changement ; le suivi en direct imposerait des milliers de
    lectures par seconde en boucle. Redis les remplace par une diffusion (Pub/Sub + Server-Sent Events).
  - Recherche : Cassandra ne filtre que sur sa clé primaire ; les filtres prix, places, note, rayon autour d'un point
    exigeraient `ALLOW FILTERING` ou une table par combinaison. MongoDB les sert avec des index composés et
    `2dsphere`.
- **Risques et limites :**
  - Trois bases à installer, alimenter et documenter en 16 h : ordre de livraison Cassandra, puis Redis, puis MongoDB ;
    MongoDB peut être retiré sans casser l'application.
  - Redis est limité par la RAM : il ne stocke jamais l'historique.
  - MongoDB est en retard de quelques millisecondes à quelques secondes sur Cassandra (cohérence à terme) : les places
    sont toujours revérifiées dans Cassandra au moment de réserver.
- **Requêtes complexes illustrant le choix :**
  - Redis : `GEOSEARCH` des véhicules dans un rayon, classement des conducteurs par `ZSET`, lecture des Streams en
    groupe de consommateurs.
  - MongoDB : recherche `$geoNear` + filtres prix, places, note, options, tri par heure ; agrégation des axes les plus
    demandés (nombre de trajets, prix moyen, taux de remplissage).

## Synchronisation avec Cassandra

- **Cassandra est la seule référence.** Aucune donnée métier n'est écrite d'abord dans Redis ou MongoDB.
- **Positions :** l'API écrit dans Cassandra (`ONE`), puis met à jour Redis en *pipeline*. Une écriture Redis manquée est
  corrigée par la position suivante.
- **Trajets, réservations, avis :** après l'écriture Cassandra, l'API publie un événement dans un Stream Redis
  (`events:trips`). Un consommateur met à jour MongoDB par *upsert* idempotent sur `trip_id`.
- **Si une base est indisponible :**
  - Redis : suivi en mode dégradé (dernière position lue dans Cassandra), aucune donnée métier perdue.
  - MongoDB : la recherche simple retombe sur `trips_by_route_date` dans Cassandra.
  - Dans les deux cas, `scripts/reindex-mongo` reconstruit MongoDB depuis Cassandra au retour.
