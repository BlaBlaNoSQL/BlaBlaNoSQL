# backend/AGENTS.md : règles de l'API

S'ajoute aux [règles communes](../AGENTS.md). Pôles concernés : Développeurs API et Sécurité JWT.
Base de départ : les responsables de ces pôles la confirment ou l'ajustent avec leur plan (PR validée par eux).

Références : [docs/api/api-rest.md](../docs/api/api-rest.md) (contrat), [docs/securite/jwt.md](../docs/securite/jwt.md) (rôles,
jeton), [docs/architecture/architecture.md](../docs/architecture/architecture.md).

## 1. Structure

```
backend/
  app.js          point d'entrée : middlewares globaux, montage des routes, gestionnaire d'erreurs
  config/         lecture de l'environnement, clients Cassandra et seconde base
  routes/         déclaration des endpoints et chaînage des middlewares
  middlewares/    authenticate, authorize, isOwner, validate, errorHandler
  controllers/    lit la requête, appelle le service, met en forme la réponse HTTP
  services/       logique métier
  models/         requêtes CQL / seconde base pour une table ou une collection
  utils/          helpers techniques
  tests/          en miroir de controllers/, services/, models/, middlewares/
```

| Couche        | Responsabilité                                                    | Ce qu'elle ne fait jamais             |
| ------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `routes`      | Associer méthode + chemin à une chaîne de middlewares + controller | Contenir de la logique                |
| `middlewares` | Authentifier, vérifier le rôle ou la propriété, valider l'entrée  | Logique métier                        |
| `controllers` | Extraire les données de la requête, appeler le service, répondre  | Calcul métier, requête en base        |
| `services`    | Règles métier (places restantes, droit de noter, progression…)    | Lire `req` / `res`, écrire du CQL     |
| `models`      | Requêtes préparées, passage des lignes de la base aux objets JS   | Logique métier, contrôle de droits    |

- **Sens de dépendance** : `routes → middlewares → controllers → services → models → config`. Jamais l'inverse, jamais de saut
  de couche : un controller n'importe ni model ni client de base.
- **Un fichier = une ressource = une responsabilité** (c'est le S de SOLID). Fichiers nommés `ressource.<couche>.js`, au
  singulier : `trip.routes.js`, `booking.service.js`. Les URL restent au pluriel (`/api/trips`).
- Une couche reçoit ce dont elle dépend sous une forme qu'un test peut remplacer (instance exportée ou paramètre).
- Une fonction fait une chose. Au-delà d'une quarantaine de lignes, découper.

## 2. Contrat d'API

- [docs/api/api-rest.md](../docs/api/api-rest.md) est le contrat entre le back et le front. **Toute route ajoutée, modifiée ou
  supprimée y est mise à jour dans la même PR**, et le pôle React est prévenu.
- Codes HTTP et format d'erreur du contrat : `{ "error": { "code": "...", "message": "..." } }`.
- Casse des champs JSON : à décider (voir [§7 des règles communes](../AGENTS.md)). Le contrat actuel utilise le camelCase
  (`priceMax`, `seatsMin`) : ne pas le changer sans décision.
- Les listes sont paginées, avec une limite bornée côté serveur.

## 3. Erreurs

- Une seule sortie pour les erreurs : le middleware `errorHandler`, qui formate la réponse. Les couches lèvent une erreur
  typée (statut, code, message) et ne répondent pas elles-mêmes.
- Pas d'échec silencieux : aucun `catch` vide ; on journalise et on propage, ou on transforme en erreur typée.
- Toutes les promesses sont attendues (`await`). Pas de `console.log` de debug dans le code livré.

## 4. Sécurité

- Chaque route a sa chaîne `authenticate` / `authorize(...roles)` / `isOwner`, conforme à la colonne « Accès » du contrat.
- Toute entrée (`body`, `params`, `query`, en-têtes) est validée par un middleware avant le controller : type, format,
  longueur, bornes.
- Mots de passe hachés, **jamais** renvoyés par l'API ni journalisés. Idem pour les jetons.
- CORS limité à l'origine du front ; limitation des tentatives de connexion.
- Pas d'`eval`, de `new Function` ni de commande construite depuis une entrée.

## 5. Tests

- Runner natif `node:test` avec `node:assert/strict`, dans `backend/tests/`, en miroir des dossiers testés.
- À tester : services, middlewares (JWT, rôles, propriété, validation) et models (requête et paramètres envoyés au driver).
- **La couche du dessous est toujours remplacée par un double** : aucun test ne touche une vraie base.
- Couvrir le cas nominal, au moins un cas d'erreur et les cas limites (liste vide, valeur absente, 0 place restante).
- Cas de sécurité obligatoires : sans jeton, jeton expiré, jeton falsifié → 401 ; mauvais rôle → 403 ; ressource d'un autre
  utilisateur → 403.
- Objectif : 80 % de couverture sur le code back touché par la PR.
- `npm test` doit se terminer seul (pas de mode watch) : la CI le lance.
