# Backend

API REST Node.js / Express.js. Elle expose les fonctionnalités de la plateforme au front React, applique l'authentification JWT et les rôles, et dialogue avec Cassandra et la seconde base.

Aucun code applicatif pour l'instant : ce dossier ne contient que ce README.

## Structure prévue

```
backend/
├── app.js            Point d'entrée Express
├── config/           Variables d'environnement, connexions Cassandra et seconde base
├── routes/           Déclaration des endpoints (auth, trips, bookings, search, reviews, positions)
├── controllers/      Lecture de la requête, appel des services, réponse HTTP
├── services/         Logique métier et accès aux bases
├── middlewares/      JWT, contrôle des rôles, validation, gestion d'erreurs
├── models/           Définition et requêtes par table / collection
└── tests/            Tests de l'API
```

## Règles

- Un controller n'accède jamais directement à une base : il passe par un service.
- Les endpoints sont décrits dans [../docs/api/api-rest.md](../docs/api/api-rest.md).
- La configuration vient exclusivement de `.env` (voir `../.env.example`).
- Responsables : Développeur API 1 et 2 (JWT : Responsable sécurité).
