# JWT et sécurité

Responsable : Responsable sécurité JWT. Barème : 2 points.

## Rôles

| Rôle | Droits |
|---|---|
| passager | Rechercher, réserver, annuler ses réservations, noter, suivre un trajet réservé |
| conducteur | Droits du passager + publier, modifier, supprimer ses trajets, envoyer ses positions |
| admin | Modération : supprimer trajets, avis, comptes |

## Jeton

- Algorithme : HS256, secret dans `JWT_SECRET` (jamais commité).
- Claims : `sub` (user_id), `role`, `iat`, `exp`.
- Durée : courte (`JWT_EXPIRES_IN`, ex. 15 min) ; refresh token à décider.
- Transport : en-tête `Authorization: Bearer <token>`.
- Stockage côté React : à décider (mémoire, ou cookie httpOnly), avec ses compromis XSS / CSRF.

## Middlewares prévus

- `authenticate` : vérifie la signature et l'expiration, place l'utilisateur dans `req.user`. Répond 401 sinon.
- `authorize(...roles)` : vérifie le rôle. Répond 403 sinon.
- `isOwner` : vérifie que la ressource appartient à l'utilisateur (trajet, réservation).

## Règles de sécurité

- Mots de passe hachés avec bcrypt (ou argon2), jamais en clair, jamais renvoyés par l'API.
- Validation des entrées sur toutes les routes (types, longueurs).
- CORS limité à l'origine du front.
- Limitation du nombre de tentatives de connexion.
- Pas de secret ni de donnée sensible dans les logs.
- Requêtes CQL préparées (pas de concaténation).

## À tester

- Accès sans jeton, avec jeton expiré, avec jeton falsifié : 401.
- Passager sur une route conducteur : 403.
- Modification du trajet d'un autre conducteur : 403.
