# Definition of Done

Une tâche est **terminée** quand toutes les cases applicables sont cochées. Elle s'applique aux membres de l'équipe
comme aux agents IA. Une case non applicable se justifie en une ligne dans la PR.

Les règles détaillées sont dans [AGENTS.md](AGENTS.md).

---

## 1. Fonctionnel

- [ ] Les critères de l'issue sont tous satisfaits.
- [ ] Le comportement a été essayé pour de vrai : appel de la route (curl, Postman, Bruno…) ou parcours de l'écran.
- [ ] Les cas d'erreur prévus renvoient le bon code HTTP et le format `{ "error": { "code", "message" } }`.

## 2. Code

- [ ] Les couches sont respectées : `routes → middlewares → controller → service → model` (aucun saut de couche).
- [ ] Les conventions de nommage et de langue (code en anglais, doc en français) sont suivies.
- [ ] JSDoc présent sur les fonctions exportées et la logique non évidente.
- [ ] Aucun `catch` vide, aucun `console.log` de debug, aucun code commenté laissé.
- [ ] Aucun fichier sans rapport avec la tâche n'a été modifié ni reformaté.

## 3. Bases de données

- [ ] Toute nouvelle table / requête est décrite dans [docs/bdd-cassandra.md](docs/bdd-cassandra.md)
      (ou dans le doc de la seconde base).
- [ ] Requêtes préparées uniquement, aucun `ALLOW FILTERING`, partitions bornées.
- [ ] Niveau de cohérence choisi explicitement pour chaque écriture / lecture sensible.
- [ ] Les scripts `.cql` de `database/` sont à jour et rejouables sur une base vide.

## 4. Sécurité

- [ ] Chaque route a sa chaîne `authenticate` / `authorize` / `isOwner` conforme à
      [docs/api-rest.md](docs/api-rest.md) (colonne « Accès »).
- [ ] Toutes les entrées (`body`, `params`, `query`) sont validées avant le controller.
- [ ] Aucun mot de passe, jeton ou secret dans le code, les logs, les réponses de l'API ou le dépôt.
- [ ] Toute nouvelle variable d'environnement est ajoutée à [.env.example](.env.example) avec une valeur factice.
- [ ] Toute nouvelle dépendance est justifiée dans la PR.

## 5. Tests (back)

- [ ] Services, middlewares et models touchés ont des tests : cas nominal, au moins un cas d'erreur, cas limites.
- [ ] La couche du dessous est mockée ; aucun test ne touche une vraie base.
- [ ] Les cas 401 / 403 sont couverts pour toute route protégée ajoutée ou modifiée.
- [ ] Couverture ≥ 80 % (lignes et branches) sur le code back touché.

## 6. Contrôles automatiques

Dans chaque dossier touché (`backend/`, `frontend/`), quand les scripts existent :

- [ ] `npm run format:check` passe (sinon `npm run format`).
- [ ] `npm run lint` passe sans erreur.
- [ ] `npm test` passe (back).
- [ ] `npm run build` passe (front).
- [ ] L'application démarre (`npm run dev`) sans erreur dans la console.

## 7. Documentation

- [ ] [docs/api-rest.md](docs/api-rest.md) reflète les routes réellement livrées.
- [ ] La doc de `docs/` concernée est à jour (architecture, sécurité, modèle de données…).
- [ ] Le README est mis à jour si l'installation ou le lancement change.
- [ ] Un choix structurant fait pendant la tâche est écrit et justifié dans `docs/`.

## 8. Livraison

- [ ] La branche `feature/<domaine>-<sujet>` part de `develop` à jour, sans conflit.
- [ ] Les commits suivent `type(portée): résumé` et ne contiennent aucun fichier interdit
      (`.env`, `node_modules/`, builds, couverture).
- [ ] La PR suit le format défini par la personne responsable des PR et est liée à son issue.
- [ ] Ce qui a été volontairement laissé de côté est indiqué dans la PR.
