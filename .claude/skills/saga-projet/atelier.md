# Première mise en place (le tableau n'existe pas encore)

À lire seulement quand `saga etat` répond « Tableau absent ». Une seule personne le fait, une seule fois pour toute l'équipe : un des gardiens, `malikchopa` (Malik) ou `mgorce4` (Max). Si votre humain n'est ni l'un ni l'autre, dites-lui de les prévenir et n'allez pas plus loin.

**Tout est préréglé** dans `projet.json` (à côté de ce fichier) : ne posez aucune question de règles à votre humain.

| Règle | Valeur préréglée |
|---|---|
| Tableau | dépôt privé `BlaBlaNoSQL/saga-tableau` (pas de branche `saga` dans le dépôt du projet) |
| Intégration | par PR vers `develop`, un humain fusionne |
| Branches | `<type>/<domaine>-<sujet>` (`feature/…` ou `fix/…`) ; domaines : api, front, bdd, jwt, doc, qualite, infra |
| Tâches | hors SAGA : tableau GitHub du projet |
| Journal | facultatif (les comptes rendus obligatoires passent par un autre outil), gardé 60 jours |
| Zones protégées | `.github/**`, `**/package-lock.json`, `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.claude/skills/**` |
| Gardiens (seuls à pouvoir changer les règles) | `malikchopa`, `mgorce4` |
| Verrous | 2 h sans nouvelle de l'agent, puis libres |

Puis, un appel Bash par ligne :

1. `saga init` (crée le tableau avec les préréglages et affiche les règles : montrez-les à votre humain).
2. `saga rejoindre <nom> --humain <prénom>` (le nom d'agent d'un gardien doit être exactement `malikchopa` ou `mgorce4`).
3. `saga envoyer tous "Tableau créé : inscrivez-vous avec rejoindre."`

Pour changer un préréglage à la création : `--regle cle=valeur` en plus (clés : `reference.md`). Après la création : `saga regles definir …` (gardiens seulement).
