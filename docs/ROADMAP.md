# Couple — Feuille de route

## État du projet

**Phase actuelle : 4 — UX complète — VALIDÉE**  
**Dernier jalon validé : parcours UX complets**  
**Prochaine phase : 5 — Prototype mobile navigable et animé**  
**Objectif suivant : tester le ressenti réel sur téléphone avant le backend**  
**Développement fonctionnel : non commencé**

---

## Méthode de travail

Ordre de construction :

**émotion → interaction → design → prototype → architecture → développement → finition**

Cycle de travail :

1. Explorer
2. Décider
3. Enregistrer
4. Construire
5. Tester sur téléphone
6. Corriger
7. Passer au jalon suivant

---

## Phase 0 — Cadrage — VALIDÉE

### Livrables
- PRODUCT.md
- ROADMAP.md
- V1-SCOPE.md
- DESIGN.md
- ARCHITECTURE.md
- DECISIONS.md

### Résultat
La vision, les principes produit, le périmètre V1 et l'architecture de principe sont figés.

---

## Phase 1 — Direction artistique — VALIDÉE

### Direction officielle
**Carnet Ivoire + discipline Lumière + douceur organique**

### Validation
- palette chaude et contenue
- ivoire, blanc cassé, graphite, sable, rose poudré, bordeaux en accent
- papier tactile mais discret
- lumière diffuse
- formes assouplies
- rondeurs modérées
- interface épurée
- romance portée par le contenu et le geste

### Référence
`references/phase1_direction-artistique_v2.png`

---

## Phase 2 — Le chèque — VALIDÉE

### Décision
**Chèque 01 — Signature** est la structure officielle de référence.

### Caractéristiques
- structure intemporelle et équilibrée
- talon/perforation
- coins doux
- typographie éditoriale
- papier ivoire
- accent bordeaux/rose discret
- état utilisé conservé et marqué avec sobriété

### Références
- `references/phase2_comparatif-3-cheques.png`
- `references/phase2_cheque-signature_specification.png`

---

## Phase 3 — La découverte — VALIDÉE

### Interaction signature
**enveloppe fermée → prise du chèque → tirage → résistance → ouverture → point de bascule → haptique → sortie → révélation**

### Principes
- interaction pilotée par le doigt
- légère résistance
- haptique subtile au point de bascule
- aucune surenchère
- pas de confettis
- retour doux si le geste est interrompu avant le seuil
- le chèque devient ensuite l'écran principal

### Référence
`references/phase3_storyboard-revelation.png`

---

## Phase 4 — UX complète — VALIDÉE

### Parcours validés
1. architecture UX globale
2. offrir un bon
3. recevoir, découvrir et utiliser
4. carnet, anciens bons et réglages

### Références
- `references/phase4_architecture-ux-globale.png`
- `references/phase4_ux01_offrir.png`
- `references/phase4_ux02_recevoir-utiliser.png`
- `references/phase4_ux03_carnet-reglages.png`

### Règle
Les planches générées sont des références de composition, d'atmosphère et de parcours.  
En cas de détail textuel ou de contrôle contradictoire avec les documents du dossier `docs/`, **les documents écrits font foi**.

---

# Phase 5 — Prototype mobile — PROCHAINE ÉTAPE

## Objectif
Construire un prototype mobile navigable et animé sans dépendre du backend final.

## À tester en priorité
- proportions du Chèque Signature sur téléphone
- création d'un bon
- passage Brouillon → Prêt
- geste « Offrir »
- réception de l'enveloppe
- révélation tactile
- retour en cas de geste interrompu
- affichage du chèque découvert
- passage à Utilisé
- parcours du Carnet
- transitions et haptique

## Validation
Le prototype doit donner envie d'être utilisé sur un téléphone réel avant toute construction backend importante.

---

## Phase 6 — Architecture technique

Après validation du prototype :
- Expo / React Native / TypeScript
- Supabase
- modèle de données
- Auth
- RLS
- Edge Functions
- notifications
- tests de sécurité

---

## Phase 7 — V1 fonctionnelle

- authentification
- deux comptes
- création secrète
- bibliothèque
- offre
- notification
- révélation
- utilisation
- carnet
- verrouillage local

---

## Phases 8 à 12

8. contenu 100+ idées  
9. finition premium  
10. tests à deux  
11. V1 privée  
12. évolutions
