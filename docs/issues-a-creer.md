# Issues GitHub à créer

Liste de départ (non créées). Labels : `back`, `front`, `bdd`, `doc`, `securite`.
Planning indicatif du guide : H1-H2 analyse, H3-H4 modélisation, H5-H8 backend, H9-H12 React, H13-H14 fonction avancée, H15 tests, H16 livraison.

| # | Titre | Label | Rôle responsable |
|---|---|---|---|
| 1 | Initialiser le dépôt, branches main/dev, protections et PR obligatoires | doc | Chef de projet |
| 2 | Planifier les jalons et répartir les tâches (tableau de suivi) | doc | Chef de projet |
| 3 | Concevoir l'architecture globale et le schéma CAP / réplication / geo-partitioning | bdd | Architecte NoSQL |
| 4 | Choisir et justifier la seconde base (grille 7 critères) | bdd | Responsable base secondaire |
| 5 | Modéliser les tables Cassandra orientées requêtes | bdd | Responsable base principale |
| 6 | Mettre en place Cassandra en local (Docker) et le keyspace | bdd | Responsable base principale |
| 7 | Mettre en place la seconde base et son modèle de données | bdd | Responsable base secondaire |
| 8 | Écrire le script d'import et le jeu de données de démo (volumétrie réaliste) | bdd | Architecte NoSQL |
| 9 | Squelette Express : config, connexions aux bases, gestion d'erreurs | back | Développeur API 1 |
| 10 | Endpoints trajets : création, modification, suppression, détail | back | Développeur API 1 |
| 11 | Endpoints réservations : réserver, annuler, lister (gestion des places) | back | Développeur API 2 |
| 12 | Recherche multicritère de trajets (requêtes complexes) | back | Développeur API 2 |
| 13 | Endpoints avis conducteurs / passagers et note moyenne | back | Développeur API 2 |
| 14 | Simulateur de positions GPS et endpoints de positions (courante, historique, progression) | back | Développeur API 1 |
| 15 | Inscription, connexion, émission du JWT, hachage des mots de passe | securite | Responsable sécurité JWT |
| 16 | Middlewares d'authentification et de contrôle des rôles | securite | Responsable sécurité JWT |
| 17 | Socle React : routing, layouts, contexte d'authentification, services API | front | Développeur React 1 |
| 18 | Pages inscription, connexion et routes protégées | front | Développeur React 1 |
| 19 | Pages recherche, détail et publication de trajet | front | Développeur React 2 |
| 20 | Pages réservations et avis | front | Développeur React 2 |
| 21 | Page de suivi du véhicule : position, progression, rejeu du parcours | front | Développeur React 2 |
| 22 | Tests de l'API et recette croisée avant release candidate | doc | Responsable qualité et documentation |
| 23 | Rédiger la documentation API et finaliser le README | doc | Responsable qualité et documentation |
