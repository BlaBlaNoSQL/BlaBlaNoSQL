# BlaBlaNoSQL

Plateforme de covoiturage temps réel de type BlaBlaCar, réalisée dans le cadre du projet NoSQL du BUT3 (groupe de 10 étudiants, 16 h de conception et de développement).

L'enjeu : gérer des données très dynamiques (positions GPS, trajets, réservations, évaluations) avec rapidité, disponibilité et montée en charge, grâce à une architecture NoSQL à deux bases.

## Stack

| Couche | Technologie |
|---|---|
| Front | React |
| API | Node.js / Express.js (API REST) |
| Sécurité | JWT avec rôles |
| Base principale (imposée) | Apache Cassandra |
| Seconde base NoSQL | À définir et à justifier (pistes : Redis, MongoDB, Neo4j), voir [docs/bdd-secondaire.md](docs/bdd-secondaire.md) |
| Versioning | Git / GitHub |

## Fonctionnalités minimales

- Authentification JWT (inscription, connexion, rôles)
- Publication de trajets (création, modification, suppression)
- Réservation de places et annulation
- Recherche multicritère (départ, destination, date, prix, places...)
- Évaluations conducteurs / passagers
- Géolocalisation simulée : position actuelle, progression du trajet, historique et rejeu du parcours

## Équipe et rôles

| Rôle | Membre |
|---|---|
| Chef de projet | |
| Architecte NoSQL | |
| Responsable base principale (Cassandra) | |
| Responsable base secondaire | |
| Développeur API 1 | |
| Développeur API 2 | |
| Responsable sécurité JWT | |
| Développeur React 1 | |
| Développeur React 2 | |
| Responsable qualité et documentation | |

## Arborescence

```
BlaBlaNoSQL/
├── backend/        API Express (routes, controllers, services, middlewares, models, config)
├── frontend/       Application React
├── database/       Schémas, scripts CQL, jeux de données de démo (seed)
├── scripts/        Scripts d'import et de simulation de positions
├── docs/           Documentation technique
├── .env.example
└── README.md
```

## Démarrage rapide

Les commandes ci-dessous sont des placeholders, à compléter quand le code existera.

```bash
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT> && cd BlaBlaNoSQL

# 2. Configurer l'environnement
cp .env.example .env        # puis renseigner les valeurs

# 3. Lancer les bases (Cassandra + seconde base)
<COMMANDE_LANCEMENT_BASES>

# 4. Initialiser le schéma et charger la démo
<COMMANDE_SCHEMA_ET_SEED>

# 5. Backend
cd backend && <COMMANDE_INSTALL> && <COMMANDE_START>

# 6. Frontend
cd frontend && <COMMANDE_INSTALL> && <COMMANDE_START>
```

## Documentation

- [Règles du projet (équipe et agents IA)](AGENTS.md) · [Definition of Done](DEFINITION_OF_DONE.md) · [Contribuer](CONTRIBUTING.md)
- [Architecture](docs/architecture.md)
- [API REST](docs/api-rest.md)
- [Base Cassandra](docs/bdd-cassandra.md)
- [Seconde base : justification](docs/bdd-secondaire.md)
- [JWT et sécurité](docs/jwt-securite.md)
- [Organisation Git](docs/organisation-git.md)
- [Issues à créer](docs/issues-a-creer.md)
- [README backend](backend/README.md) · [README frontend](frontend/README.md)

## Livrables attendus

Code source, README, documentation API, schéma des bases, jeu de données de démo (idéalement volumineux et réaliste : open data, Kaggle, API publiques), application fonctionnelle.

## Barème (rappel, /20)

| Critère | Points |
|---|---|
| Modélisation NoSQL | 5 |
| Choix et justification de la seconde base | 2 |
| Requêtes complexes | 3 |
| API REST (Express) | 3 |
| Application React | 3 |
| JWT et sécurité | 2 |
| Documentation | 1 |
| Organisation d'équipe | 1 |
