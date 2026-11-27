# frontend/AGENTS.md : règles de l'application React

S'ajoute aux [règles communes](../AGENTS.md). Pôle concerné : Développeurs React.
Base de départ : le responsable du pôle la confirme ou l'ajuste avec le plan du pôle (PR validée par lui).

Références : [docs/api/api-rest.md](../docs/api/api-rest.md) (contrat avec le back), [docs/securite/jwt.md](../docs/securite/jwt.md)
(rôles, jeton), [docs/front/accessibilite.md](../docs/front/accessibilite.md) (règles d'accessibilité détaillées).

## 1. Structure

```
frontend/src/
  pages/       un écran par fichier
  components/  composants réutilisables
  services/    appels à l'API : seul endroit qui fait des requêtes HTTP
  hooks/       hooks personnalisés (useAuth, useTrips…)
  contexts/    contexte d'authentification (jeton, rôle)
  layouts/     mises en page publique / connectée
  assets/      images, styles
```

- Composants fonctionnels et hooks uniquement. Pas de composant classe.
- **Composants et pages en `PascalCase`** (`TripCard.jsx`) et **hooks en `useXxx`** : React en a besoin pour les
  reconnaître. Pour le reste du nommage, voir [§7 des règles communes](../AGENTS.md).
- Un composant fait une chose. S'il grossit, le découper plutôt que lui ajouter des options.

## 2. Données et API

- Un composant ne fait jamais de requête lui-même : il passe par un hook ou par `src/services/`.
- L'URL de l'API vient de `import.meta.env.VITE_API_URL`, jamais en dur.
- Le jeton est ajouté à l'en-tête `Authorization: Bearer` par `src/services/` uniquement. Son stockage est à décider
  ([docs/securite/jwt.md](../docs/securite/jwt.md)).
- Le front suit le contrat [docs/api/api-rest.md](../docs/api/api-rest.md). S'il manque une route ou un champ, le demander au pôle
  API : ne pas inventer de réponse.
- Gérer les trois états de chaque appel : chargement, erreur (message lisible), succès (liste vide comprise).

## 3. Texte et langue

- **Tout ce que l'utilisateur lit est en français** : libellés, boutons, messages d'erreur, textes alternatifs.
- Le code reste en anglais : noms de composants, de props, de variables, commentaires.

## 4. Responsive

- L'application est une application web utilisable **sur téléphone et sur PC**. Il n'y a pas d'application mobile.
- Chaque écran est vérifié aux deux largeurs avant la PR : rien ne déborde, pas de défilement horizontal, les boutons
  restent atteignables au doigt.

## 5. Accessibilité

Prise en compte **dès la maquette**, pas après coup. Le détail et la façon de vérifier sont dans
[docs/front/accessibilite.md](../docs/front/accessibilite.md). L'essentiel :

- **Niveau visé : WCAG 2.2 AA.**
- **Jamais une information donnée par la couleur seule** : un statut, une erreur ou une place disponible ont aussi un texte,
  une icône ou une forme.
- **Contrastes** : au moins 4,5:1 pour le texte, 3:1 pour le grand texte, les icônes et les bordures de champ. Les couleurs
  sont définies une seule fois (variables CSS), jamais en dur dans un composant.
- **Clavier** : tout ce qui se fait à la souris se fait au clavier, avec un focus toujours visible. `<button>` pour une
  action, `<a href>` pour une navigation, jamais de `<div onClick>`.
- **Formulaires** : chaque champ a un `<label>` visible ; l'erreur est un texte sous le champ qui dit comment corriger.
- **Images** : `alt` en français si l'image apporte une information, `alt=""` si elle est décorative.
- **Téléphone** : pas de défilement horizontal à 320 px, zoom à 200 % sans perte, cibles tactiles de 44 px pour les actions
  principales.
- Avant une PR, faire la vérification express du document (clavier, téléphone, zoom, niveaux de gris, Lighthouse) et ne
  déclarer vérifié que ce qui a été réellement essayé.

## 6. Sécurité

- Les routes protégées vérifient le rôle côté front **pour l'affichage seulement** : la vraie vérification est faite par
  l'API.
- Pas de `dangerouslySetInnerHTML` avec du contenu utilisateur ; liens externes limités à `https:` et `mailto:`.
- Aucun secret dans le front : tout ce qui est dans le bundle est public.

## 7. Tests

Aucun test front n'est exigé. `npm run lint` et `npm run build` doivent passer : la CI les lance.
