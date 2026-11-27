# Definition of Done

Une tâche est **terminée** quand toutes les cases applicables sont cochées. Elle vaut pour les membres de l'équipe comme
pour les agents IA. Une case non applicable se justifie en une ligne dans la PR.

Les règles sont dans [AGENTS.md](AGENTS.md) et dans le `AGENTS.md` du dossier concerné.

## 1. Fonctionnel

- [ ] Ce que demande la tâche (carte du tableau ou issue) est fait en entier.
- [ ] Le comportement a été essayé pour de vrai : appel de la route (curl, Postman, Bruno…) ou parcours de l'écran.
- [ ] Les cas d'erreur prévus renvoient le bon code HTTP et le format `{ "error": { "code", "message" } }`.

## 2. Code

- [ ] Le code est en anglais ; le texte affiché à l'utilisateur est en français.
- [ ] Le nommage suit les règles communes ([AGENTS.md](AGENTS.md), §2 et §7).
- [ ] Chaque module a une seule responsabilité ; les couches du back sont respectées, sans saut de couche.
- [ ] Aucun `catch` vide, aucun `console.log` de debug, aucun code commenté laissé.
- [ ] Aucun fichier sans rapport avec la tâche n'a été modifié ni reformaté.

## 3. Bases de données

- [ ] Toute nouvelle table ou requête est décrite dans [docs/bases/cassandra.md](docs/bases/cassandra.md) (ou dans la doc de
      la seconde base), avec la justification du choix.
- [ ] Requêtes préparées uniquement, aucun `ALLOW FILTERING`, partitions bornées.
- [ ] Niveau de cohérence choisi explicitement pour chaque écriture ou lecture sensible.
- [ ] Les scripts `.cql` de `database/` sont à jour et rejouables sur une base vide.

## 4. Sécurité

- [ ] Chaque route a sa chaîne `authenticate` / `authorize` / `isOwner`, conforme à la colonne « Accès » de
      [docs/api/api-rest.md](docs/api/api-rest.md).
- [ ] Toutes les entrées (`body`, `params`, `query`) sont validées avant le controller.
- [ ] Aucun mot de passe, jeton ou secret dans le code, les logs, les réponses de l'API ou le dépôt.
- [ ] Toute nouvelle variable d'environnement est ajoutée à [.env.example](.env.example) avec une valeur factice.
- [ ] Toute nouvelle dépendance est justifiée dans la PR.

## 5. Tests (back)

- [ ] Services, middlewares et models touchés ont des tests : cas nominal, au moins un cas d'erreur, cas limites.
- [ ] La couche du dessous est remplacée par un double ; aucun test ne touche une vraie base.
- [ ] Les cas 401 / 403 sont couverts pour toute route protégée ajoutée ou modifiée.

## 6. Interface (front)

- [ ] L'écran est utilisable sur téléphone et sur PC : pas de défilement horizontal à 320 px, zoom à 200 % sans perte.
- [ ] Aucune information n'est donnée par la couleur seule ; les contrastes respectent les seuils.
- [ ] Chaque champ a un libellé visible, chaque image porteuse de sens a un texte alternatif, tout se fait au clavier.
- [ ] La vérification express de [docs/front/accessibilite.md](docs/front/accessibilite.md) (§9) a été faite sur chaque
      écran touché.
- [ ] Les trois états de chaque appel sont gérés : chargement, erreur lisible, succès (liste vide comprise).

## 7. Contrôles automatiques

Dans chaque dossier touché (`backend/`, `frontend/`), quand les scripts existent :

- [ ] `npm run lint` passe sans erreur.
- [ ] `npm run format:check` passe (sinon `npm run format`).
- [ ] `npm test` passe (back).
- [ ] `npm run build` passe (front).
- [ ] L'application démarre sans erreur dans la console.

## 8. Documentation

- [ ] [docs/api/api-rest.md](docs/api/api-rest.md) reflète les routes réellement livrées.
- [ ] La doc de `docs/` concernée est à jour (architecture, sécurité, modèle de données…).
- [ ] Le README est mis à jour si l'installation ou le lancement change.
- [ ] Le pôle suivant dans la chaîne (base de données, puis API, puis React) est prévenu de ce qui change pour lui.

## 9. Livraison

- [ ] La branche `feature/<domaine>-<sujet>` part de `develop` à jour, sans conflit.
- [ ] Les commits suivent `type(portée): summary` et ne contiennent aucun fichier interdit (`.env`, `node_modules/`,
      builds, couverture).
- [ ] Le titre de la PR suit `type(portée): résumé`, sa description dit ce qui change et comment le tester.
- [ ] La relecture est demandée au responsable du pôle et à une personne du pôle Qualité.
- [ ] Ce qui a été volontairement laissé de côté est indiqué dans la PR.
