# Couple — Journal des décisions

Ce fichier contient les décisions structurantes du projet.

Format :
- identifiant
- décision
- raison
- conséquence
- statut

---

## DEC-001 — Deux utilisateurs uniquement

### Décision
La V1 est conçue pour exactement deux partenaires.

### Pourquoi
Réduire la complexité et préserver l'intimité du produit.

### Conséquence
Pas de groupe, équipe, organisation ou multi-couple en V1.

### Statut
VALIDÉ

---

## DEC-002 — Le chèque est l'objet central

### Décision
Le chèque doit être traité comme un objet visuel et émotionnel, pas comme une simple donnée.

### Pourquoi
C'est l'élément qui différencie le produit d'une application de tâches ou de notes.

### Conséquence
L'interface doit s'effacer autour du chèque.

### Statut
VALIDÉ

---

## DEC-003 — Secret avant révélation

### Décision
Le destinataire ne peut pas accéder au contenu secret avant l'action de révélation.

### Pourquoi
Préserver la surprise.

### Conséquence
La sécurité doit être appliquée côté backend / RLS, pas seulement dans l'UI.

### Statut
VALIDÉ

---

## DEC-004 — Notification non révélatrice

### Décision
Les notifications ne contiennent aucun contenu sensible.

### Pourquoi
Une notification peut apparaître sur un écran verrouillé.

### Conséquence
Message générique uniquement.

### Statut
VALIDÉ

---

## DEC-005 — Pas de gamification

### Décision
Aucun streak, score, classement ou KPI de couple.

### Pourquoi
Le cadeau ne doit pas devenir une obligation.

### Conséquence
Le rituel mensuel reste une intention douce.

### Statut
VALIDÉ

---

## DEC-006 — Pas de compteur mensuel

### Décision
Aucun compteur de type 0/1, jours restants ou retard.

### Pourquoi
Éviter la culpabilisation.

### Conséquence
Un mois sans chèque n'est jamais présenté comme un échec.

### Statut
VALIDÉ

---

## DEC-007 — Une révélation signature

### Décision
La V1 privilégie une interaction principale très travaillée.

### Pourquoi
Une bonne cérémonie vaut mieux que plusieurs effets moyens.

### Conséquence
Enveloppe + tirage du chèque comme interaction de référence.

### Statut
VALIDÉ

---

## DEC-008 — 3 familles de chèques maximum en V1

### Décision
Limiter la variété structurelle.

### Pourquoi
Préserver une identité forte.

### Conséquence
Les variations se font surtout par couleur, matière et détail.

### Statut
VALIDÉ

---

## DEC-009 — Direction Carnet Ivoire + Lumière

### Décision
Associer chaleur du papier et minimalisme numérique.

### Pourquoi
Obtenir une identité premium, romantique sans kitsch.

### Conséquence
Textures discrètes, espace, typographie forte, palette chaude contenue.

### Statut
VALIDÉ

---

## DEC-010 — React Native + Expo + TypeScript

### Décision
Construire l'application mobile avec React Native, Expo et TypeScript.

### Pourquoi
Bon équilibre entre qualité mobile, vitesse de développement et accès aux fonctionnalités natives.

### Statut
VALIDÉ

---

## DEC-011 — Supabase comme backend

### Décision
Utiliser Supabase pour Auth, PostgreSQL, RLS, fonctions serveur et stockage futur.

### Pourquoi
Architecture simple et adaptée à un produit à deux utilisateurs.

### Statut
VALIDÉ

---

## DEC-012 — Dépôt GitHub public, application privée

### Décision
Le code source peut être public, mais l'application et les données restent privées.

### Pourquoi
Contourner les problèmes d'accès au dépôt privé sans modifier le produit.

### Conséquence
Aucun secret ni donnée personnelle dans GitHub.

### Statut
VALIDÉ

---

## DEC-013 — Inscription publique désactivée

### Décision
L'application ne permet pas à n'importe qui de créer un compte.

### Pourquoi
La V1 est une application privée pour deux personnes.

### Conséquence
Les deux comptes sont créés de manière contrôlée.

### Statut
VALIDÉ

---

## DEC-014 — Les souvenirs sont optionnels

### Décision
Les souvenirs post-utilisation ne sont jamais obligatoires.

### Pourquoi
Éviter de transformer une expérience en formulaire administratif.

### Conséquence
Les sollicitations dépendent du type de chèque.

### Statut
VALIDÉ

---

## DEC-015 — Pas d'IA en V1

### Décision
L'IA personnalisée n'est pas incluse dans la V1.

### Pourquoi
Le cœur de valeur est le rituel, le chèque et la révélation.

### Conséquence
« Me surprendre » utilise d'abord une logique simple et maîtrisable.

### Statut
VALIDÉ
