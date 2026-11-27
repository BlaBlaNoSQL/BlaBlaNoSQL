# API REST

Endpoints prévus (préfixe `/api`). Format JSON. Authentification : `Authorization: Bearer <JWT>`.
Rôles : `passager`, `conducteur`, `admin` (voir [jwt-securite.md](jwt-securite.md)).
Statut : tous à implémenter.

## Authentification

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /auth/register | public | Inscription |
| POST | /auth/login | public | Connexion, retourne le JWT |
| GET | /auth/me | connecté | Profil de l'utilisateur courant |

## Trajets

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /trips | conducteur | Publier un trajet |
| GET | /trips/:id | public | Détail d'un trajet |
| PUT | /trips/:id | conducteur (propriétaire) | Modifier un trajet |
| DELETE | /trips/:id | conducteur (propriétaire), admin | Supprimer un trajet |
| GET | /users/me/trips | conducteur | Mes trajets publiés |

## Réservations

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /trips/:id/bookings | passager | Réserver une place |
| DELETE | /bookings/:id | passager (propriétaire) | Annuler une réservation |
| GET | /users/me/bookings | passager | Mes réservations |
| GET | /trips/:id/bookings | conducteur (propriétaire) | Passagers d'un trajet |

## Recherche

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | /trips/search | public | Recherche multicritère : `from`, `to`, `date`, `priceMax`, `seatsMin`, `minRating`, `sort` |

## Avis

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /trips/:id/reviews | connecté (participant du trajet) | Noter un conducteur ou un passager |
| GET | /users/:id/reviews | public | Avis reçus par un utilisateur |
| GET | /users/:id/rating | public | Note moyenne |

## Positions (géolocalisation simulée)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | /trips/:id/positions | conducteur, simulateur | Enregistrer une position |
| GET | /trips/:id/positions/current | participant | Position actuelle |
| GET | /trips/:id/positions | participant | Historique (rejeu), filtre `from`, `to` |
| GET | /trips/:id/progress | participant | Progression en % entre départ et arrivée |

## Conventions

- Codes : 200, 201, 204, 400 (validation), 401 (non authentifié), 403 (rôle insuffisant), 404, 409 (conflit, ex. plus de places).
- Erreurs : `{ "error": { "code": "...", "message": "..." } }`.
- Pagination des listes : `?limit=` et `?page=` (ou curseur, à décider).
