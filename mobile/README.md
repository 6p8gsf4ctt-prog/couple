# Couple — Prototype mobile Phase 5

## Objectif

Ce dossier contient un prototype Expo local et sans backend destiné à tester le ressenti sur téléphone avant l'installation de Supabase.

Le prototype couvre :
- accueil
- préparation
- bibliothèque
- « Me surprendre »
- création personnalisée
- édition
- état prêt
- offre simulée
- réception simulée
- révélation par tirage
- haptique au point de bascule
- chèque découvert
- utilisation
- état utilisé
- Carnet
- Réglages

## Lancer sur téléphone

Depuis le dossier `mobile/` :

```bash
npm install
npx expo install expo-haptics
npx expo start
```

Ouvrir ensuite le projet avec Expo Go sur un téléphone compatible.

Si Expo propose d'aligner certaines versions de dépendances avec le SDK installé, accepter les versions recommandées par `npx expo install`.

## Important

Ce prototype ne contient :
- aucun backend
- aucun compte réel
- aucune notification push réelle
- aucune donnée privée
- aucun secret

L'action **« Simuler la réception »** sert uniquement à tester les deux côtés du parcours sur un seul téléphone. Elle ne fera pas partie de l'interface finale.

## Test prioritaire

Le geste de révélation est le point le plus important de ce prototype.

Tester :
- prise naturelle du chèque
- distance avant validation
- sensation de résistance
- retour quand le geste est relâché trop tôt
- haptique au point de bascule
- lisibilité du Chèque Signature
- rythme entre révélation et apparition des actions

Les valeurs sont volontairement faciles à ajuster dans :

`src/components/EnvelopeReveal.tsx`

Constantes principales :
- `MAX_PULL`
- `RELEASE_THRESHOLD`
- facteur de résistance dans `g.dy * 0.86`
