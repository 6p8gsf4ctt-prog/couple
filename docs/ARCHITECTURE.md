# Couple — Architecture technique

## Vue d'ensemble

```text
                    GITHUB
                       │
          code + migrations + contenu
                       │
                       ▼
              React Native / Expo
                 iOS + Android
                       │
               HTTPS authentifié
                       │
                       ▼
                   SUPABASE
        ┌──────────────┼──────────────┐
        │              │              │
       Auth        PostgreSQL       Storage
    2 comptes       chèques      futures photos
        │              │              │
        └────── RLS / sécurité ───────┘
                       │
                 Edge Functions
                       │
                Expo Push Service
                       │
              ┌────────┴────────┐
              ▼                 ▼
           Téléphone A       Téléphone B
```

## Stack

### Mobile
- React Native
- Expo
- TypeScript
- Reanimated
- Gesture Handler
- Haptics
- LocalAuthentication
- SecureStore
- ImagePicker plus tard

### Backend
- Supabase Auth
- PostgreSQL
- Row Level Security
- Edge Functions
- Storage privé plus tard

### Build / distribution
- Expo EAS
- TestFlight pendant le développement
- distribution privée adaptée ensuite

---

## Dépôt GitHub public

Le dépôt est considéré comme public.

Conséquence :
- aucun secret
- aucune donnée personnelle
- aucune photo réelle
- aucun mot de passe
- aucun token
- aucune clé de service
- aucune clé privée

Les fichiers `.env` réels ne doivent jamais être commités.

Un `.env.example` sans secret pourra être versionné.

---

## Authentification

V1 :
- 2 comptes uniquement
- inscription publique désactivée
- comptes créés de manière contrôlée
- session persistante
- verrouillage local optionnel / Face ID

---

## Modèle de confidentialité

Séparer les métadonnées visibles du contenu secret.

Conceptuellement :

```text
CHEQUE
id
couple_id
sender_id
recipient_id
status
offered_at
revealed_at
used_at

SECRET_CONTENT
cheque_id
title
description
personal_message
condition
validity
category
```

Le modèle réel pourra être ajusté lors des migrations SQL.

---

## Règles d'accès

### Avant l'offre
- créateur : accès complet
- destinataire : aucun accès

### Après l'offre, avant révélation
- créateur : accès
- destinataire : voit seulement qu'un objet existe
- contenu secret : inaccessible au destinataire

### Après révélation
- destinataire : accès au contenu
- `revealed_at` est enregistré côté serveur

### Après utilisation
- contenu toujours conservé
- `used_at` enregistré

---

## RLS

La confidentialité doit être appliquée au niveau PostgreSQL.

Ne jamais se contenter de masquer le contenu dans l'interface.

---

## Notifications

Flux :

```text
action mobile
→ fonction serveur
→ Expo Push
→ téléphone destinataire
```

Payload non sensible.

Exemple :

« Un nouveau bon t'attend. »

Jamais :
- titre du bon
- catégorie intime
- message personnel
- condition

---

## Photos futures

Stockage privé Supabase.

Exemple conceptuel :

```text
memories/{couple_id}/{cheque_id}/photo.jpg
```

RLS obligatoire.

Limiter les métadonnées EXIF inutiles.

---

## Sauvegardes

La base de données doit être sauvegardée.

Les objets Storage nécessiteront une stratégie séparée quand les photos seront introduites.

Prévoir plus tard un export du carnet.

---

## Synchronisation

Pas de peer-to-peer.

Les deux téléphones utilisent Supabase comme source de vérité.

Realtime uniquement si une vraie nécessité UX apparaît.

---

## Chiffrement

La V1 repose sur :
- HTTPS
- Auth
- politiques RLS
- stockage sécurisé côté services

Pas de chiffrement de bout en bout en V1.

E2EE ne sera étudié que si l'exigence devient : « même l'administrateur du backend ne doit jamais pouvoir lire le contenu ».
