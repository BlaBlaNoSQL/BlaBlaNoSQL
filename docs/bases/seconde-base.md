# Seconde base NoSQL : justification

Choix libre, justification obligatoire (2 points au barème). Remplir la grille pour chaque candidat, puis conclure.
Responsables : Responsable base secondaire et Architecte NoSQL.

## Candidats

| Candidat | Usage envisagé |
|---|---|
| Redis | Suivi temps réel (position courante, expiration, pub/sub) |
| MongoDB | Profils utilisateurs, recherche multicritère |
| Neo4j | Relations conducteurs / passagers, recommandations |
| Autre | |

## Grille de justification

À remplir (note de 1 à 5 ou commentaire court).

| Critère | Redis | MongoDB | Neo4j | Justification / mesures |
|---|---|---|---|---|
| Volumétrie | | | | |
| Performance (latence, débit) | | | | |
| Temps réel | | | | |
| Modèle de données | | | | |
| Cohérence | | | | |
| Disponibilité | | | | |
| Complexité des requêtes | | | | |
| **Total** | | | | |

Rappel CAP à situer pour chaque candidat : CP ou AP, comportement lors d'une partition réseau.

## Décision

- Base retenue : _à compléter_
- Données qu'elle porte : _à compléter_
- Pourquoi Cassandra ne suffit pas pour ce besoin : _à compléter_
- Risques et limites : _à compléter_
- Requêtes complexes illustrant le choix (3 points au barème) : _à compléter_

## Synchronisation avec Cassandra

À décrire : qui écrit dans quelle base, que se passe-t-il si l'une des deux est indisponible, cohérence entre les deux (écriture double, événements, reconstruction).
