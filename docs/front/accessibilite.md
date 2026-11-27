# Accessibilité du front

Règles d'accessibilité de l'application React, pour les membres de l'équipe comme pour les agents IA.
Décision de l'équipe (27/11/2026) : l'accessibilité se traite **dès la maquette**, pas après coup.

**Niveau visé : [WCAG 2.2](https://www.w3.org/TR/WCAG22/), niveau AA.** Les seuils ci-dessous viennent du texte du W3C
(relus le 27/11/2026) ; le numéro du critère est entre parenthèses. Ce qui va plus loin que le niveau AA est noté
« choix du projet ». Aucune règle ne dépend d'une bibliothèque de style.

Chaque règle dit quoi faire, puis comment le vérifier. Les vérifications se font dans les outils de développement de
Chrome (DevTools) : rien à installer.

## 1. Contrastes

| Quoi faire                                                                                                                                            | Comment vérifier                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Texte : contraste d'au moins **4,5:1** avec son fond (1.4.3).                                                                                         | DevTools : inspecter l'élément, la bulle affiche « Contrast ».                           |
| Grand texte (au moins 24 px, ou 18,66 px en gras) : au moins **3:1** (1.4.3).                                                                         | Idem.                                                                                    |
| Ce qui sert à reconnaître un composant ou à lire un graphique : au moins **3:1** (1.4.11). Bordure d'un champ, icône, anneau de focus, tracé de carte. | Pipette du sélecteur de couleur de DevTools, ou un calculateur de contraste.             |
| Élément désactivé : pas de seuil dans WCAG, mais il reste lisible et la raison du blocage est écrite (« Complet », « Connecte-toi pour réserver »).   | Lire l'écran sans plisser les yeux ; le texte dit pourquoi.                              |
| Les couleurs sont définies **une seule fois** (variables CSS), avec leurs paires texte / fond vérifiées. Pas de couleur écrite en dur dans un composant. | Recherche d'un code couleur (`#`, `rgb(`) hors du fichier des variables : aucun résultat. |

Un texte posé sur une photo, un dégradé ou une carte n'est pas mesuré par les outils automatiques : lui donner un fond
uni, ou le vérifier à la main à l'endroit le moins favorable.

## 2. Jamais la couleur seule (1.4.1)

Toute information donnée par une couleur est aussi donnée par un **texte**, une **icône** ou une **forme**.

| Cas                     | Ce qu'on affiche en plus de la couleur                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Statut d'un trajet      | Le statut écrit (« À venir », « En cours », « Terminé », « Annulé »), avec une icône si besoin.           |
| Places restantes        | Le nombre écrit (« 2 places restantes », « Complet »).                                                    |
| Erreur de formulaire    | Un message sous le champ et une icône : une bordure rouge ne suffit pas.                                  |
| Carte de suivi          | Départ, arrivée et véhicule ont des formes ou des libellés différents ; parcouru et restant diffèrent par le trait (plein / pointillé). Un résumé en texte accompagne la carte (« Arrivée estimée à 14 h 32 »). |
| Note d'un conducteur    | La valeur écrite (« 4,5 sur 5 »), pas seulement des étoiles colorées.                                     |
| Lien dans un paragraphe | Souligné.                                                                                                 |

Vérifier : DevTools → _Rendering_ → _Emulate vision deficiencies_ → _Achromatopsia_ (niveaux de gris). Tout doit rester
compréhensible.

## 3. Clavier et focus

| Quoi faire                                                                                                                              | Comment vérifier                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Tout ce qui se fait à la souris se fait au clavier, et on peut toujours ressortir d'un composant (2.1.1, 2.1.2).                        | Parcourir l'écran sans souris : Tab, Maj+Tab, Entrée, Espace, Échap. |
| Éléments natifs : `<button>` pour une action, `<a href>` pour une navigation. Pas de `<div onClick>`.                                   | Lint (voir la fin du document).                                     |
| L'ordre de tabulation suit l'ordre visuel (2.4.3). Jamais de `tabIndex` supérieur à 0.                                                  | Tab du haut au bas de l'écran.                                      |
| Focus toujours visible (2.4.7) : style `:focus-visible`, jamais `outline: none` sans remplacement. Choix du projet : anneau de 2 px, contraste 3:1. | Tab sur chaque élément, en regardant où est le focus.     |
| L'élément qui a le focus n'est pas caché par un en-tête ou une barre fixe (2.4.11).                                                     | Tab jusqu'en bas d'une page longue.                                 |
| Fenêtre modale ou menu : le focus y entre à l'ouverture, Échap ferme, le focus revient au bouton qui l'a ouvert.                         | Ouvrir et fermer au clavier.                                        |
| Changement de page : le `<title>` change et le focus va sur le titre de la nouvelle page. Un lien « Aller au contenu » ouvre chaque page (2.4.1, 2.4.2). | Tab juste après une navigation.                          |

## 4. Formulaires

| Quoi faire                                                                                                                                  | Comment vérifier                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Chaque champ a un `<label htmlFor>` **visible** (3.3.2). Un `placeholder` n'est pas un libellé. Un champ obligatoire le dit en texte.        | Cliquer sur le libellé : le champ prend le focus.            |
| Bon `type` et bon `autoComplete` (`email`, `tel`, `current-password`, `new-password`…) (1.3.5). Le collage reste possible partout (3.3.8).  | Le navigateur propose de remplir ; coller un mot de passe.   |
| Erreur : le message est **en texte**, sous le champ, et dit comment corriger (3.3.1, 3.3.3). Le champ porte `aria-invalid="true"` et `aria-describedby` vers le message. | Envoyer le formulaire vide.     |
| À l'envoi en erreur, le focus va sur le premier champ en erreur. Ce que l'utilisateur a saisi n'est pas effacé.                              | Idem, au clavier.                                            |
| Message qui apparaît sans changement de page (« Réservation confirmée », « 12 trajets trouvés ») : dans un élément `role="status"` ; `role="alert"` pour une erreur bloquante (4.1.3). | Inspecter l'élément qui reçoit le message. |

## 5. Structure et titres

| Quoi faire                                                                                                         | Comment vérifier                                     |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `<html lang="fr">` (3.1.1).                                                                                        | Ouvrir `index.html`.                                 |
| Un seul `<h1>` par écran, puis `<h2>`, `<h3>` sans sauter de niveau. Un titre se choisit pour son rôle, pas pour sa taille. | DevTools → _Elements_ → _Accessibility_, ou Lighthouse. |
| Zones de page : `<header>`, `<nav>`, `<main>` (un seul), `<footer>`.                                               | Idem.                                                |
| Une liste de trajets est un `<ul>` ; un tableau de données est un `<table>` avec des `<th>`.                       | Idem.                                                |
| HTML natif d'abord. ARIA seulement quand aucun élément natif ne convient.                                          | Relecture.                                           |

## 6. Images et icônes

| Quoi faire                                                                                                             | Comment vérifier                           |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Image qui apporte une information : `alt` en français qui donne cette information (1.1.1).                             | Lint, puis relire le texte de l'`alt`.     |
| Image décorative : `alt=""`.                                                                                           | Lint.                                      |
| Bouton fait d'une icône seule : `aria-label` en français (« Annuler la réservation ») et icône en `aria-hidden="true"`. | Lighthouse : aucun bouton sans nom.        |
| Pas de texte dans une image. La carte a toujours un équivalent en texte (étapes, position, heure d'arrivée).           | Masquer la carte : l'information reste là. |

## 7. Téléphone et tactile

| Quoi faire                                                                                                                         | Comment vérifier                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Cible tactile d'au moins **24 × 24 px CSS** (2.5.8). Choix du projet : **44 × 44 px** pour les actions principales (réserver, rechercher, menu). | DevTools : inspecter le bouton, lire sa taille.      |
| Pas de défilement horizontal à **320 px** de large (1.4.10). Seule la carte peut défiler dans les deux sens.                       | DevTools, mode appareil, 320 px puis 390 px.                       |
| Zoom du navigateur à **200 %** sans perte de contenu (1.4.4). Jamais `user-scalable=no` ni `maximum-scale`. Tailles de texte en `rem`. | Ctrl + « + » jusqu'à 200 % sur PC.                             |
| Champs de saisie à 16 px au moins sur téléphone (sinon iOS zoome sur la page).                                                     | Inspecter la taille de police du champ.                            |
| Portrait et paysage fonctionnent tous les deux (1.3.4). Rien n'existe qu'au survol.                                                | Tourner l'appareil dans le mode appareil.                          |
| Carte : boutons « + » et « − », pas seulement le pincement ou le glissement (2.5.7).                                               | Zoomer la carte avec un seul clic.                                 |

## 8. Mouvement réduit

| Quoi faire                                                                                                                 | Comment vérifier                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Sous `@media (prefers-reduced-motion: reduce)` : pas de transition ni de déplacement animé ; le véhicule change de position sans glisser. | DevTools → _Rendering_ → _Emulate CSS media feature prefers-reduced-motion_. |
| Rien ne clignote ; aucune animation en boucle sans bouton pour l'arrêter (2.2.2).                                          | Regarder l'écran 5 secondes sans rien toucher.                                   |
| Le suivi n'annonce pas chaque position au lecteur d'écran : une annonce quand le statut change (parti, proche, arrivé).    | Relecture du code de la zone `role="status"`.                                    |

## 9. Vérification express avant une PR (5 minutes par écran)

1. **Clavier** : faire le parcours de l'écran sans souris, focus toujours visible.
2. **Téléphone** : 320 px puis 390 px de large, pas de défilement horizontal, boutons atteignables.
3. **Zoom** : 200 % sur PC, rien n'est coupé.
4. **Niveaux de gris** : statuts, erreurs et carte restent compréhensibles.
5. **Lighthouse** (DevTools, catégorie _Accessibility_) : aucune erreur. Un score de 100 ne prouve pas que l'écran est
   accessible : il ne voit ni l'ordre du focus, ni la couleur seule.

Ne déclarer vérifié que ce qui a été réellement essayé. Un agent IA ne peut pas affirmer « testé au lecteur d'écran » ou
« testé sur iPhone » : il liste ce qu'il a lancé et ce qui reste à faire à la main.

## 10. Comment on s'assure que c'est suivi

Du plus contraignant au moins contraignant :

| Moyen                                                              | Ce qui oblige                                                                                       | Ce que ça couvre                                                                                      | Limite                                                                             |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1. Lint `eslint-plugin-jsx-a11y`, lancé par `npm run lint` en CI   | Le check `CI OK` est exigé pour fusionner : une PR en erreur ne passe pas. Personne ne peut l'oublier. | `alt` manquant, champ sans libellé, `<div>` cliquable, rôle ARIA faux, `tabIndex` positif, `autoFocus`. | Analyse le code, pas l'écran : ne voit ni les contrastes, ni la couleur seule, ni le responsive. |
| 2. Cases dans la [Definition of Done](../../DEFINITION_OF_DONE.md)    | Obligatoire pour dire qu'une tâche est finie, mais déclaratif.                                      | Tout, y compris ce que le lint ne voit pas.                                                           | On peut cocher sans avoir fait.                                                    |
| 3. Relecture par le pôle Qualité                                   | Une des deux approbations exigées vient déjà de ce pôle.                                            | Le relecteur refait le §9 sur l'écran livré.                                                          | Dépend du temps du relecteur.                                                      |
| 4. Vérification manuelle par l'auteur (§9)                         | Rien, sans les moyens 2 et 3.                                                                       | Clavier, zoom, contrastes, couleur seule : la seule à les voir.                                       | Repose sur la bonne volonté.                                                       |

**Recommandation pour un projet de 16 h : 1 + 2, avec 3 par sondage.**

- **Le lint dès le premier commit du front.** C'est le seul moyen qui bloque vraiment, et il coûte une dépendance de
  développement et quelques lignes de configuration (`jsxA11y.flatConfigs.recommended`). Ajouté plus tard, il faudra
  corriger tout l'existant d'un coup.
- **Deux cases dans la Definition of Done**, qui renvoient au §9, pour ce que le lint ne voit pas.
- **Les couleurs fixées une fois, à la maquette**, avec leurs contrastes vérifiés (§1) : c'est ce qui règle les contrastes
  pour tout le projet, là où aucun outil ne bloque.
- **Le pôle Qualité** refait le §9 sur l'écran d'une PR front, au moins pour les écrans clés (recherche, réservation,
  suivi).
- **Écarté pour ce projet** : les tests automatiques dans un navigateur (axe-core avec un outil de test de bout en bout).
  Aucun test front n'est exigé et la mise en place prendrait une part trop grande des 16 h.

À savoir avant d'installer le lint (registre npm, 27/11/2026) : `eslint-plugin-jsx-a11y` 6.10.2 déclare ESLint 9 au
plus, alors que la version courante d'ESLint est la 10. Le front doit donc rester sur ESLint 9 tant que le plugin n'a pas
suivi, ou la compatibilité doit être essayée au moment de l'installation. Ne pas forcer avec `--legacy-peer-deps` sans
l'avoir vérifié.
