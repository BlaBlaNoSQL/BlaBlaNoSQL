# Contribuer à BlaBlaNoSQL

Guide d'arrivée pour un membre de l'équipe. Les règles de code sont dans [AGENTS.md](AGENTS.md), la checklist de
fin de tâche dans [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md).

## 1. Prérequis

| Outil       | Version / remarque                                     |
| ----------- | ------------------------------------------------------ |
| Git         | Récent, compte GitHub ajouté au dépôt                  |
| Node.js     | Version de [`.nvmrc`](.nvmrc) (npm inclus)             |
| Docker      | Pour lancer Cassandra (et la seconde base) en local    |
| Éditeur     | Extensions Prettier et ESLint, **format-on-save activé** |

## 2. Installation

Les commandes exactes seront complétées quand les squelettes back et front existeront.

```bash
git clone <URL_DU_DEPOT>
```

```bash
cd BlaBlaNoSQL && cp .env.example .env
```

Renseigner `.env` (demander les valeurs partagées au pôle Sécurité JWT, **jamais** par un commit, une issue ou un message
public), puis lancer les bases, le back et le front selon le [README](README.md#démarrage-rapide).

## 3. Déroulé d'une tâche

1. **Prendre une tâche** dans le [tableau du projet](https://github.com/orgs/BlaBlaNoSQL/projects/1) et la passer en cours.
   Rien à prendre ? Voir avec le responsable de votre pôle avant de coder.
2. **Lire** [AGENTS.md](AGENTS.md), le `AGENTS.md` du dossier concerné (`backend/`, `frontend/`, `database/`) et la doc de
   `docs/` liée au sujet (contrat d'API, tables, rôles).
3. **Créer la branche** depuis `develop` à jour :

   ```bash
   git switch develop && git pull
   ```

   ```bash
   git switch -c feature/<domaine>-<sujet>
   ```

4. **Coder par petits commits** au format `type(portée): summary`, en anglais (voir
   [docs/equipe/organisation-git.md](docs/equipe/organisation-git.md)).
5. **Tester** : tests back, essai réel de la route ou de l'écran.
6. **Cocher la [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)**.
7. **Pousser et ouvrir la PR vers `develop`** : titre `type(portée): résumé` en français, description qui dit ce qui change
   et comment le tester.
8. **Demander 2 relectures** : le responsable de votre pôle et une personne du pôle Qualité.
9. **Traiter les retours**, puis fusion après les 2 approbations et les checks au vert.
10. **Prévenir le pôle suivant** (base de données, puis API, puis React) de ce qui change pour lui.

## 4. Travailler avec un agent IA

Les règles sont rangées pour que chaque agent ne charge que ce qui le concerne :

| Fichier                                                             | Contenu                           | Chargé                                  |
| ------------------------------------------------------------------- | --------------------------------- | --------------------------------------- |
| [AGENTS.md](AGENTS.md)                                              | Règles communes                   | À chaque session                        |
| `backend/AGENTS.md`, `frontend/AGENTS.md`, `database/AGENTS.md`     | Règles du pôle                    | Quand l'agent travaille dans le dossier |
| [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md), [docs/](docs/)      | Checklist et référence            | À la demande                            |
| `CLAUDE.local.md`, `.claude/settings.local.json`                    | Vos réglages personnels           | Chez vous seulement (ignorés par Git)   |

Copilot, Cursor et les autres lisent les `AGENTS.md` ; Claude Code y accède par les fichiers `CLAUDE.md`, qui ne contiennent
qu'un renvoi. Une règle s'écrit donc toujours dans un `AGENTS.md`.

- Vous restez **responsable** du code produit : relisez-le comme le code d'un collègue.
- Donnez-lui la tâche et les fichiers concernés, pas « fais le projet ».
- Vérifiez vous-même que les contrôles de la Definition of Done passent.
- Ne collez jamais le contenu de `.env` ou un secret dans une conversation avec un agent.

## 5. Avant de modifier une règle

Les règles d'`AGENTS.md` et de la Definition of Done sont communes à toute l'équipe. Pour en changer une : proposer la
modification dans une PR dédiée, validée par le Chef de projet et une personne du pôle Qualité. Le `AGENTS.md` d'un dossier
se modifie par une PR validée par le responsable du pôle concerné.

## 6. Qui contacter

Voir le tableau des rôles du [README](README.md#équipe-et-rôles).

| Sujet                                  | Rôle                                    |
| -------------------------------------- | --------------------------------------- |
| Planning, désaccord dans une équipe    | Chef de projet                          |
| Modèle de données, choix NoSQL         | Architecte NoSQL                        |
| Tables et requêtes Cassandra           | Pôle base principale                    |
| Seconde base                           | Pôle base secondaire                    |
| JWT, rôles, secrets partagés           | Pôle Sécurité JWT                       |
| API Express                            | Pôle API                                |
| Application React                      | Pôle React                              |
| Règles, tests, documentation           | Pôle Qualité et documentation           |
