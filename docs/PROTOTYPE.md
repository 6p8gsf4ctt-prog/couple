# Couple — Phase 5 — Prototype mobile

## Statut

**EN COURS — Prototype 0.2 livré après test réel sur iPhone**

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


---

# Itération 0.2 — retours figés

## Retour 1 — Navigation

### Constat
La flèche de retour était trop souvent le seul moyen de sortir d'un sous-parcours.

### Correction
Navigation persistante à quatre entrées :
- Accueil
- Carnet
- Idées
- Réglages

Elle reste visible sur les écrans ordinaires.

Elle disparaît uniquement pendant les moments immersifs ou de confirmation :
- envoi confirmé
- révélation
- confirmation d'utilisation

Le brouillon reste en mémoire locale lorsqu'on change de section.

---

## Retour 2 — Marquage vertical du Chèque Signature

### Constat
Le mot `COUPLE` pouvait dépasser visuellement du chèque.

### Correction
Le marquage reste vertical, mais il est désormais contenu et masqué à l'intérieur de la zone du talon.

---

## Retour 3 — Révélation trop rapide

### Constat
La version 0.1 donnait l'impression qu'un simple glissement ouvrait immédiatement le bon.

### Correction
La 0.2 rend le geste beaucoup plus progressif :
1. le rabat commence par s'ouvrir ;
2. le chèque reste presque immobile au début ;
3. le papier commence ensuite à suivre le doigt ;
4. la résistance réduit le déplacement réel ;
5. un seuil de bascule plus éloigné doit être franchi ;
6. relâcher trop tôt referme l'enveloppe ;
7. haptique au point de bascule ;
8. la sortie finale prend encore un temps perceptible.

Le but reste un seul geste naturel, mais vécu comme une séquence physique et non comme un changement d'écran.

---

## Retour 4 — Disponibles / Utilisés / Offerts

### Constat
Un bon estampillé `UTILISÉ` apparaissait dans `Disponibles`, ce qui rendait les catégories incompréhensibles.

### Règles désormais strictes
- **Disponibles** : découverts et non utilisés.
- **Utilisés** : utilisés uniquement, avec marque `UTILISÉ`.
- **Offerts** : bons envoyés par l'utilisateur.

Aucun bon utilisé ne doit apparaître dans `Disponibles`.
