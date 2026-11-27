# Contribuer à BlaBlaNoSQL

Guide d'arrivée pour un membre de l'équipe. Les règles de code sont dans [AGENTS.md](AGENTS.md), la checklist de
fin de tâche dans [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md).

## 1. Prérequis

| Outil       | Version / remarque                                     |
| ----------- | ------------------------------------------------------ |
| Git         | Récent, compte GitHub ajouté au dépôt                  |
| Node.js     | LTS ≥ 22 (npm inclus)                                  |
| Docker      | Pour lancer Cassandra (et la seconde base) en local    |
| Éditeur     | Extensions Prettier et ESLint, **format-on-save activé** |

## 2. Installation

Les commandes exactes seront complétées quand les squelettes back et front existeront (issues #9 et #17).

```bash
git clone <URL_DU_DEPOT>
```

```bash
cd BlaBlaNoSQL && cp .env.example .env
```

Renseigner `.env` (demander les valeurs partagées au Responsable sécurité JWT, **jamais** par un commit ni dans une
issue), puis lancer les bases, le back et le front selon le [README](README.md#démarrage-rapide).

## 3. Workflow d'une tâche

1. **Prendre une issue** qui vous est attribuée (une issue = un responsable). Pas d'issue ? En demander une au Chef de
   projet avant de coder.
2. **Lire** [AGENTS.md](AGENTS.md) et la doc de `docs/` liée au sujet (contrat d'API, tables, rôles).
3. **Créer la branche** depuis `dev` à jour :

   ```bash
   git switch dev && git pull
   ```

   ```bash
   git switch -c feature/<domaine>-<sujet>
   ```

4. **Coder par petits commits** au format `type(portée): résumé` (voir
   [docs/organisation-git.md](docs/organisation-git.md)).
5. **Tester** : tests back, essai réel de la route ou de l'écran.
6. **Cocher la [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)**.
7. **Pousser et ouvrir la PR vers `dev`** en suivant le format défini par la personne responsable des PR.
8. **Traiter les retours de relecture**, puis fusion après approbation.

## 4. Travailler avec un agent IA

Les agents (Claude Code, Copilot, Cursor…) lisent [AGENTS.md](AGENTS.md) ; Claude Code y accède via
[CLAUDE.md](CLAUDE.md).

- Vous restez **responsable** du code produit : relisez-le comme le code d'un collègue.
- Donnez-lui l'issue et les fichiers concernés, pas « fais le projet ».
- Vérifiez vous-même que les contrôles de la Definition of Done passent.
- Ne collez jamais le contenu de `.env` ou un secret dans une conversation avec un agent.

## 5. Avant de modifier une règle

Les règles d'`AGENTS.md` et de la Definition of Done sont communes à toute l'équipe. Pour en changer une : proposer
la modification dans une PR dédiée, la faire valider par le Chef de projet et le Responsable qualité et documentation.

## 6. Qui contacter

Voir le tableau des rôles du [README](README.md#équipe-et-rôles).

| Sujet                                  | Rôle                                    |
| -------------------------------------- | --------------------------------------- |
| Planning, attribution des issues       | Chef de projet                          |
| Modèle de données, choix NoSQL         | Architecte NoSQL                        |
| Tables et requêtes Cassandra           | Responsable base principale             |
| Seconde base                           | Responsable base secondaire             |
| JWT, rôles, secrets partagés           | Responsable sécurité JWT                |
| API Express                            | Développeurs API 1 et 2                 |
| Application React                      | Développeurs React 1 et 2               |
| Règles, tests, documentation           | Responsable qualité et documentation    |
