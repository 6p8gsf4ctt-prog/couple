# Couple — Phase 5 — Prototype mobile

## Statut

**EN COURS — Prototype 0.1 livré**

## Intention

Tester sur téléphone réel l'expérience avant d'installer le backend.

Le prototype ne doit pas seulement prouver que la technologie fonctionne. Il doit répondre à une question plus importante :

> Est-ce que l'application donne envie d'offrir, de recevoir et de manipuler un chèque ?

## Contenu du prototype 0.1

- navigation locale
- Chèque Signature
- préparation
- bibliothèque
- « Me surprendre »
- création personnalisée
- édition
- bon prêt
- offre
- réception simulée
- révélation tactile
- haptique
- utilisation
- Carnet
- Réglages

## Ce qui est volontairement absent

- Supabase
- Auth
- RLS
- deux téléphones synchronisés
- notifications push réelles
- stockage distant
- photos
- souvenirs riches
- IA

Ces éléments arrivent seulement après validation du prototype.

## Critères de validation Phase 5

### Chèque
- paraît être un objet, pas une carte UI
- lisible sur téléphone
- confortable à une main
- résiste aux titres/messages de longueurs réalistes

### Création
- démarrage évident
- pas de sensation de formulaire administratif
- aperçu du chèque présent au moment important

### Offre
- action volontaire
- pas de culpabilisation
- pas de score
- sensation de « laisser partir » le chèque

### Révélation
- geste compréhensible sans tutoriel lourd
- légère résistance
- relâchement anticipé = retour doux
- point de bascule satisfaisant
- haptique subtile
- pas de confettis
- après révélation, le chèque prend toute l'attention

### Carnet
- ressemble à une collection
- pas à une liste de tâches
- état Utilisé digne et durable

## Protocole de test recommandé

1. Créer un bon depuis la bibliothèque.
2. Créer un second bon personnalisé.
3. Tester « Me surprendre ».
4. Offrir puis simuler la réception.
5. Rater volontairement le geste de révélation trois fois.
6. Réussir la révélation.
7. Marquer le bon utilisé.
8. Revenir au Carnet.
9. Noter les moments où une action nécessite réflexion.
10. Noter tout élément qui semble trop administratif.

## Après validation

La Phase 6 installera les fondations réelles :
- Expo projet de production
- Supabase
- Auth
- modèle de données
- RLS
- fonctions serveur
- notifications
- règles de confidentialité
