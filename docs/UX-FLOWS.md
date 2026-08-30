# Couple — Parcours UX V1

## Règle générale

Le parcours doit rester centré sur l'objet « chèque ».  
Chaque écran doit avoir une intention principale claire.

---

# 1. Offrir un bon

## Entrée
Accueil → Ton bon à offrir

## Choix
- Choisir une idée
- Me surprendre
- Créer le mien

## Bibliothèque
Navigation par catégories et intentions.

## Édition
Le chèque reste visuellement présent pendant l'édition.

Éléments éditables :
- titre
- description
- message personnel
- condition optionnelle
- validité optionnelle

## Brouillon
Enregistrable sans visibilité côté partenaire.

## Prêt
Le chèque est finalisé mais toujours secret.

## Offrir
Action volontaire et explicite.

V1 :
- le destinataire est le partenaire lié au compte
- pas de partage public
- pas de lien externe comme mécanisme principal
- l'offre déclenche l'état `Offert` et la notification serveur

---

# 2. Recevoir et découvrir

## Notification
Message non révélateur, par exemple :

> Un nouveau bon t'attend.

Aucun titre, catégorie ou message personnel dans la notification.

## Réception
Écran presque vide :
- enveloppe
- « Pour toi »
- expéditeur discret
- aucune information sur le contenu

## Révélation
Interaction signature définie dans DESIGN.md.

## Après révélation
Le chèque est enregistré dans le Carnet automatiquement.

Actions possibles :
- utiliser
- revenir au Carnet
- consulter les détails nécessaires

Pas de bouton « conserver » indispensable : la conservation est automatique.

---

# 3. Utiliser un bon

## Action
« Utiliser ce bon »

## Confirmation
Confirmation simple car l'action modifie l'état du chèque.

## Résultat
`Utilisé`

Le bon :
- ne disparaît jamais
- reste consultable
- reçoit une marque visuelle discrète
- conserve son contenu original

---

# 4. Carnet

## Rôle
Collection sensible de l'histoire des bons.

## Vues conceptuelles
- reçus
- offerts
- disponibles
- utilisés

Ces vues ne doivent pas devenir des KPI.

## Navigation
Privilégier le feuilletage, les piles ou les cartes-objets plutôt qu'une liste administrative.

## Ancien bon
Afficher :
- chèque
- date d'offre
- date d'utilisation si applicable
- message original
- souvenir futur si disponible

Ne pas afficher :
- « utilisé après X jours »
- score
- retard
- performance

---

# 5. Réglages

## Compte
- compte
- déconnexion

## Notifications
- activation/désactivation
- contenu toujours discret

## Confidentialité
- rappel que le contenu est privé
- verrouillage local

## Face ID / verrouillage
Prévu pour V1.

---

# 6. Souvenirs

Pas une section de navigation principale en V1.

Après V1 :
- photo
- texte
- date
- lieu

Sollicitation contextuelle seulement.

Pas de demande automatique après un bon intime/personnel.

---

# 7. États du chèque

États persistés :

**Brouillon → Prêt → Offert → Découvert → Utilisé**

`Disponible` est dérivé de `Découvert` tant que `used_at` est vide.

Pas de statut `Expiré` par défaut.


---

# Navigation globale — validation après prototype 0.1

Accès permanents :
- Accueil
- Carnet
- Idées
- Réglages

La flèche `‹` sert à remonter dans un sous-parcours, jamais à remplacer la navigation principale.

Masquer la navigation globale uniquement lorsque sa présence détournerait du rituel :
- envoi confirmé
- révélation
- confirmation irréversible d'utilisation
