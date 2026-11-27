# Base principale : Cassandra

Règle de modélisation : une table par requête, la clé de partition se déduit de la requête. Pas de jointure, la dénormalisation est assumée.
Propositions de départ, à valider par l'Architecte NoSQL et le Responsable base principale.

## Keyspace

```cql
CREATE KEYSPACE blablanosql WITH replication =
  {'class': 'NetworkTopologyStrategy', 'dc1': 3};  -- ajouter dc2 si 2 DC
```

## Requêtes à couvrir

| # | Requête | Table |
|---|---|---|
| Q1 | Connexion par email | users_by_email |
| Q2 | Profil par id | users |
| Q3 | Recherche de trajets par départ, destination, date | trips_by_route_date |
| Q4 | Détail d'un trajet | trips |
| Q5 | Trajets d'un conducteur | trips_by_driver |
| Q6 | Réservations d'un passager | bookings_by_user |
| Q7 | Passagers d'un trajet | bookings_by_trip |
| Q8 | Avis reçus par un utilisateur | reviews_by_user |
| Q9 | Position actuelle d'un trajet | positions_by_trip (dernière ligne) |
| Q10 | Historique des positions pour le rejeu | positions_by_trip |

## Tables proposées

| Table | Clé de partition | Clustering | Colonnes principales |
|---|---|---|---|
| users | user_id | | email, password_hash, role, name, created_at |
| users_by_email | email | | user_id, password_hash, role |
| trips | trip_id | | driver_id, origin, destination, departure_time, price, seats_total, seats_left, status |
| trips_by_route_date | (origin_city, destination_city, day) | departure_time ASC, trip_id | driver_id, price, seats_left, driver_rating |
| trips_by_driver | driver_id | departure_time DESC, trip_id | origin, destination, status |
| bookings_by_trip | trip_id | user_id | seats, status, created_at |
| bookings_by_user | user_id | created_at DESC, booking_id | trip_id, seats, status |
| reviews_by_user | target_user_id | created_at DESC, review_id | author_id, trip_id, rating, comment, author_role |
| positions_by_trip | (trip_id, day) | ts DESC | lat, lon, speed |

## Choix à documenter

- Positions : la partition `(trip_id, day)` borne la taille des partitions ; TTL éventuel pour limiter l'historique.
- Places restantes : `seats_left` mis à jour avec une transaction légère (`IF seats_left > 0`) ou compteur séparé. Décision à prendre.
- Recherche multicritère (prix, note) : filtrage côté API sur la partition (route, jour), ou seconde base. À arbitrer avec [seconde-base.md](seconde-base.md).
- Cohérence : `LOCAL_QUORUM` pour réservations et utilisateurs, `ONE` pour positions.
- Volumétrie cible et jeu de données : à renseigner (source open data / génération), script d'import dans `scripts/`, seed dans `database/`.
