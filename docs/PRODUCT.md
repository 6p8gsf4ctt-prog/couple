# Couple — Vision produit

## Mission

Créer une application mobile privée pour deux partenaires, centrée sur l'échange de chèques-cadeaux numériques personnels.

L'application doit transformer un geste simple — offrir un bon pour une attention, une sortie, une expérience ou un moment intime — en un rituel élégant, émotionnel et mémorable.

## Principe central

Le chèque est un objet, pas une ligne de base de données.

L'expérience produit doit suivre ce cycle émotionnel :

**préparer en secret → attendre → offrir → anticiper → découvrir → posséder → utiliser → conserver**

## Priorités

1. Plaisir d'offrir et de recevoir
2. Simplicité
3. Émotion
4. Beauté
5. Fluidité
6. Fonctionnalités

## Règle de décision

Toute nouvelle fonctionnalité doit répondre à cette question :

> Est-ce que cela augmente le plaisir, la complicité ou la qualité du rituel, ou est-ce que cela transforme l'application en outil de gestion du couple ?

Si la fonctionnalité pousse vers la gestion, le suivi, la performance, l'obligation ou la culpabilité, elle doit être rejetée ou profondément retravaillée.

## Utilisateurs

La V1 est conçue pour exactement deux partenaires.

Il n'y a pas de logique d'équipe, d'organisation, de groupe, de communauté ou de réseau social.

## Rituel mensuel

L'intention produit est qu'un partenaire offre environ un chèque par mois à l'autre.

Ce rituel ne doit jamais être présenté comme une obligation.

Interdits :
- compteurs de performance
- séries / streaks
- alertes rouges
- messages de retard
- score mensuel
- comparaison entre partenaires
- culpabilisation

Un mois sans chèque n'est jamais présenté comme un échec.

## Secret

Un chèque préparé doit rester invisible pour le destinataire tant qu'il n'a pas été offert.

Après l'offre :
- le destinataire peut savoir qu'un nouveau bon l'attend ;
- le contenu reste caché jusqu'à la révélation ;
- la notification ne doit pas dévoiler le titre, la catégorie ou le message.

## Révélation

La réception d'un chèque est une cérémonie.

Interaction principale recommandée :
- enveloppe fermée
- bord du chèque visible
- geste de tirage
- légère résistance
- ouverture de l'enveloppe
- sortie du papier
- haptique subtile
- recentrage du chèque

À éviter :
- confettis
- effets enfantins
- animations bruyantes
- surenchère visuelle

## Le chèque

Champs possibles :
- « Bon pour… »
- titre
- description
- expéditeur
- destinataire
- date d'envoi
- validité optionnelle
- catégorie
- condition optionnelle
- message personnel optionnel
- statut

États persistés recommandés :

**Brouillon → Prêt → Offert → Découvert → Utilisé**

« Disponible » est un état dérivé après découverte et ne doit pas nécessairement être persisté.

Pas d'état « Expiré » par défaut.

## Bibliothèque d'idées

La V1 doit proposer au moins 100 idées.

Catégories de base :
- Romantique
- Sorties
- Aventure
- Maison
- Petites attentions
- Intime / Couple

La catégorie intime doit être présente directement, avec un ton élégant et non gênant.

La bibliothèque ne doit jamais ressembler à une grille de 100 cartes.

La navigation doit se faire par intention ou catégorie, avec des sélections éditorialisées.

## Création

Trois modes :
- Choisir une idée
- Me surprendre
- Créer le mien

Lors de la création, le chèque doit rester visible autant que possible pour donner l'impression de remplir un vrai objet plutôt qu'un formulaire.

## Carnet

Le carnet est une collection, pas une liste de tâches.

Il doit évoquer :
- album
- carnet
- pile de chèques
- pages
- talons
- perforations
- traces d'utilisation

Les chèques utilisés ne disparaissent jamais.

## Souvenirs

Les souvenirs sont optionnels et contextuels.

Pour une sortie, un week-end, une randonnée ou un restaurant, l'application peut proposer :
- photo
- texte
- date
- lieu

Pour les chèques intimes ou très personnels, aucune sollicitation automatique ne doit être imposée.

## Philosophie visuelle

Référence de discipline : simplicité, espace, typographie, animation fluide, cohérence premium.

Direction recommandée :

**Carnet Ivoire + discipline de Lumière**

Cela signifie :
- objet papier chaleureux
- ivoire, graphite, blanc, rose poudré, bordeaux en touches
- textures très discrètes
- ombres légères
- typographie élégante
- interface numérique minimaliste
- romance portée par le contenu et le geste, pas par des clichés visuels

À éviter :
- faux papier ancien
- textures lourdes
- fleurs et cœurs omniprésents
- rouge Saint-Valentin systématique

## Mobile

Application mobile uniquement.

Principes :
- utilisation à une main
- gestes tactiles
- zones accessibles au pouce
- transitions plein écran
- haptique subtile
- priorité au ressenti sur téléphone réel

## Sécurité et confidentialité

Le dépôt GitHub peut être public, mais l'application reste privée.

Principes :
- authentification obligatoire
- deux comptes seulement
- inscription publique désactivée
- données dans Supabase
- règles RLS au niveau base de données
- aucun secret dans GitHub
- notifications non révélatrices
- verrouillage local / Face ID prévu pour la V1
- photos futures dans un stockage privé

## Technologie retenue

- React Native
- Expo
- TypeScript
- Supabase
- GitHub
- Expo EAS

## Non-objectifs V1

Pas de :
- réseau social
- statistiques de performance
- IA générative
- recommandations complexes
- calendrier avancé
- gamification
- système multi-couples
- marketplace
- abonnement
