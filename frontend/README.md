# Frontend

Application React : interface utilisateur de la plateforme (inscription, connexion, recherche et publication de trajets, réservations, avis, suivi de véhicule simulé). Elle consomme uniquement l'API du backend.

Aucun code applicatif pour l'instant : ce dossier ne contient que ce README.

## Structure prévue

```
frontend/
├── public/
└── src/
    ├── pages/        Écrans (Accueil, Connexion, Recherche, Détail trajet, Mes réservations, Suivi...)
    ├── components/   Composants réutilisables (carte, formulaire de recherche, étoiles d'avis...)
    ├── services/     Appels à l'API REST
    ├── hooks/        Hooks personnalisés (useAuth, useTrips, useTracking...)
    ├── contexts/     Contexte d'authentification (JWT, rôle)
    ├── layouts/      Mises en page (publique, connectée)
    └── assets/       Images, styles
```

## Règles

- Le JWT est transmis dans l'en-tête `Authorization: Bearer` par la couche `services/`.
- Routes protégées selon le rôle (voir [../docs/securite/jwt.md](../docs/securite/jwt.md)).
- Le suivi de position interroge l'API à intervalle régulier (ou WebSocket, à décider).
- Responsables : Développeur React 1 et 2.
