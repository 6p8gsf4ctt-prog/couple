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

---

## DEC-016 — Direction artistique finale

### Décision
La direction officielle est **Carnet Ivoire + discipline Lumière + douceur organique**.

### Pourquoi
Préserver la sophistication tout en ajoutant chaleur, rondeur, tactilité et intimité.

### Conséquence
Éviter les formes trop strictes, sans tomber dans une esthétique enfantine ou « bubble ».

### Statut
VALIDÉ

---

## DEC-017 — Chèque 01 Signature

### Décision
Le **Chèque 01 — Signature** devient la structure principale de la V1.

### Pourquoi
Il offre le meilleur équilibre entre identité, lisibilité, intemporalité et capacité à accueillir des contenus variés.

### Conséquence
Les autres pistes ne sont pas des modèles indépendants à développer en V1.

### Statut
VALIDÉ

---

## DEC-018 — Révélation par tirage contrôlé

### Décision
La révélation signature repose sur un chèque tiré manuellement d'une enveloppe avec légère résistance et haptique au point de bascule.

### Pourquoi
Faire de la découverte une interaction vécue et non une animation passive.

### Conséquence
Avant le point de bascule, un geste interrompu revient doucement à l'état fermé.

### Statut
VALIDÉ

---

## DEC-019 — Les documents écrits priment sur les détails accidentels des planches

### Décision
Les planches visuelles sont des références de design et de parcours ; elles ne remplacent pas les règles écrites.

### Pourquoi
Une génération visuelle peut introduire des micro-textes ou contrôles non décidés.

### Conséquence
En cas de conflit, le dossier `docs/` est la source de vérité.

### Statut
VALIDÉ

---

## DEC-020 — Phase 4 UX validée

### Décision
Les parcours Offrir, Recevoir/Découvrir/Utiliser et Carnet/Réglages sont validés comme base UX de la V1.

### Pourquoi
Le système couvre désormais le cycle émotionnel complet du chèque.

### Conséquence
La prochaine phase est le prototype mobile navigable et animé.

### Statut
VALIDÉ



---

## DEC-021 — Prototype avant backend

### Décision
La Phase 5 est construite comme un prototype Expo local, navigable et animé, sans Supabase.

### Pourquoi
Valider le ressenti, les gestes, les proportions et le rythme avant d'investir dans l'architecture fonctionnelle.

### Conséquence
Les comptes, RLS, notifications push et synchronisation à deux téléphones restent hors du prototype 0.1.

### Statut
VALIDÉ


---

## DEC-022 — Navigation principale persistante

### Décision
La navigation mobile principale comporte quatre accès : **Accueil · Carnet · Idées · Réglages**.

### Pourquoi
Le test sur téléphone a montré qu'une navigation reposant trop souvent sur la flèche retour enferme l'utilisateur dans les parcours.

### Conséquence
La barre reste visible sur les écrans ordinaires et disparaît seulement dans les moments immersifs.

### Statut
VALIDÉ APRÈS TEST 0.1

---

## DEC-023 — Statuts du Carnet strictement séparés

### Décision
Un bon `Utilisé` ne peut jamais apparaître dans `Disponibles`.

### Définition
- Disponible = découvert et non utilisé
- Utilisé = utilisé
- Offert = envoyé par l'utilisateur

### Statut
VALIDÉ APRÈS TEST 0.1

---

## DEC-024 — Révélation plus progressive

### Décision
Le tirage reste un geste unique, mais l'ouverture du rabat, la sortie du papier et le point de bascule doivent être perceptiblement séparés dans le mouvement.

### Pourquoi
Le prototype 0.1 rendait la révélation trop instantanée par rapport au storyboard validé.

### Conséquence
Résistance accrue, course plus longue, seuil plus éloigné, retour doux avant le seuil et haptique au basculement.

### Statut
VALIDÉ APRÈS TEST 0.1

---

## DEC-025 — Marquage COUPLE contenu dans le talon

### Décision
Le marquage vertical `COUPLE` est conservé, mais ne doit jamais sortir des limites visuelles du chèque.

### Statut
VALIDÉ APRÈS TEST 0.1
