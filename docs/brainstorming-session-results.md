# Brainstorming Session Results

**Session Date:** 2026-01-06
**Facilitator:** Business Analyst Mary
**Participant:** Kevin

---

## Executive Summary

**Topic:** Architecture globale — Application mobile d'escalade en React Native

**Session Goals:** Définir l'architecture technique complète pour le MVP

**Techniques Used:** First Principles Thinking, Mind Mapping, Six Thinking Hats, SCAMPER

**Total Ideas Generated:** 40+

### Key Themes Identified:
- Simplicité et rapidité de développement
- Coût minimal avant validation marché
- Expérience visuelle centrée sur les photos
- Architecture évolutive pour features futures (social, gamification, événements)

---

## Technique Sessions

### 1. First Principles Thinking

**Description:** Déconstruction du problème jusqu'aux éléments fondamentaux

**Fondamentaux identifiés:**
1. Salles d'escalade (gyms) — Conteneur principal
2. Murs et boulders — Contenu à explorer
3. Gestion des rôles — Contrôle d'accès (Invité, Utilisateur, Admin)

**Insights découverts:**
- Géolocalisation ponctuelle suffit (pas de tracking temps réel)
- Photos critiques et obligatoires, vidéos secondaires (reportées V2)
- Authentification email/password extensible plus tard
- Volumétrie : 50+ salles, ~1500 boulders, 100+ users simultanés

---

### 2. Mind Mapping

**Description:** Visualisation des composants et leurs relations

#### Architecture 5 branches :

```
                           ┌─────────────────────┐
                           │    APP ESCALADE     │
                           └──────────┬──────────┘
        ┌──────────────┬──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼
┌───────────────┐ ┌─────────┐ ┌────────────┐ ┌───────────┐ ┌────────────────┐
│   FRONTEND    │ │ BACKEND │ │  DATABASE  │ │  STORAGE  │ │    SERVICES    │
│ React Native  │ │Supabase │ │ PostgreSQL │ │ Supabase  │ │    EXTERNES    │
└───────────────┘ └─────────┘ └────────────┘ └───────────┘ └────────────────┘
```

#### Branche 1 — Frontend Mobile (React Native)
- **Navigation:** Tab Navigator (3 onglets : Accueil, Profil, Classement)
- **State Management:** À définir (React Query recommandé)
- **Services natifs:** Caméra, géolocalisation

#### Branche 2 — Backend (Supabase tout-en-un)
- API REST via Supabase
- Auth email/password
- Row Level Security (RLS)
- Hébergement gratuit

#### Branche 3 — Base de données (PostgreSQL)

| Table | Description |
|-------|-------------|
| `users` | id, email, password_hash, role, avatar_url, bio, total_points, created_at |
| `gyms` | id, name, description, latitude, longitude, created_at |
| `gym_admins` | id, gym_id, user_id (many-to-many) |
| `gym_photos` | id, gym_id, url, order |
| `walls` | id, gym_id, title, description, created_at |
| `wall_photos` | id, wall_id, url, order |
| `boulders` | id, wall_id, title, description, difficulty (1-10), created_at |
| `boulder_photos` | id, boulder_id, url, order |
| `favorites` | id, user_id, boulder_id, created_at |
| `validations` | id, user_id, boulder_id, points_earned, validated_at (unique user+boulder) |
| `comments` | id, user_id, boulder_id, content, created_at |
| `leaderboards` | id, user_id, gym_id (null=global), total_points, rank, updated_at |

#### Branche 4 — Stockage (Supabase Storage)

```
supabase-storage/
├── avatars/
│   └── {user_id}.jpg
├── gyms/
│   └── {gym_id}/
│       └── {photo_id}.jpg
├── walls/
│   └── {wall_id}/
│       └── {photo_id}.jpg
└── boulders/
    └── {boulder_id}/
        └── photos/
            └── {photo_id}.jpg
```

- Compression côté client avant upload
- Vidéos reportées à V2

#### Branche 5 — Services externes
- **Géolocalisation:** React Native Geolocation
- **Cartes:** Native (react-native-maps — Apple Maps iOS / Google Maps Android)
- **Crash reporting:** Firebase Crashlytics
- **Notifications push (futur):** Firebase Cloud Messaging

---

### 3. Six Thinking Hats

**Description:** Évaluation de l'architecture sous différents angles

#### 🎩 Chapeau BLANC (Faits)
| Aspect | Décision |
|--------|----------|
| Frontend | React Native + Tab Navigation |
| Backend | Supabase (tout-en-un) |
| Database | PostgreSQL (12 tables MVP) |
| Storage | Supabase Storage (4 buckets) |
| Auth | Email/password via Supabase Auth |
| Cartes | Native (react-native-maps) |
| Monitoring | Firebase Crashlytics |

#### 🎩 Chapeau JAUNE (Points forts)
1. **Rapidité de développement** — Supabase tout-en-un
2. **Coût initial nul** — Free tiers suffisants
3. **Cross-platform** — Un code pour iOS et Android

#### 🎩 Chapeau NOIR (Risques)
| Risque | Mitigation |
|--------|------------|
| Sécurité RLS | Règles strictes dès le départ, tests multi-rôles |
| Limites free tier | Monitoring usage, plan migration si succès |
| Performance images | Compression client, lazy loading |

#### 🎩 Chapeau VERT (Idées futures)
- Gamification étendue (badges, défis) — V2
- Social (suivre grimpeurs, partager) — V2
- Événements (compétitions) — V2
- Carte interactive 2D des murs avec points boulders — V2

#### 🎩 Chapeau BLEU (Principes directeurs)
1. **Rapide** — Développement et UX fluide
2. **Visuel** — Photos au cœur de l'app
3. **Coût minimal** — Free tiers jusqu'à validation marché

---

### 4. SCAMPER

**Description:** Challenge systématique des choix d'architecture

| Lettre | Décision |
|--------|----------|
| **S — Substitute** | Aucune substitution — stack confirmée |
| **C — Combine** | Aucune combinaison — structure claire |
| **A — Adapt** | Carte simple accueil, commentaires style Instagram, validation bouton simple |
| **M — Modify** | Profil riche (4 stats), photo obligatoire, difficulté 1-10 |
| **P — Put to use** | Focus 100% escalade |
| **E — Eliminate** | MVP sans vidéos, commentaires sans réponses imbriquées |
| **R — Rearrange** | Tab bar 3 onglets, accueil = grille boulders regroupés par murs |

---

## Idea Categorization

### Immediate Opportunities
*Ideas ready to implement now*

1. **Architecture Supabase tout-en-un**
   - Description: Backend, auth, storage, database centralisés
   - Why immediate: Réduit complexité, gratuit, rapide à setup
   - Resources needed: Compte Supabase, config initiale

2. **Tab Navigation 3 onglets**
   - Description: Accueil | Profil | Classement
   - Why immediate: Simple, couvre les besoins MVP
   - Resources needed: React Navigation setup

3. **Grille photos boulders**
   - Description: Affichage galerie avec regroupement par murs
   - Why immediate: Visuel, intuitif, performant
   - Resources needed: Composant FlatList/grid

### Future Innovations
*Ideas requiring development/research*

1. **Carte interactive 2D des murs**
   - Description: Vue salle avec murs cliquables et points boulders
   - Development needed: Design UI/UX, système de coordonnées
   - Timeline estimate: V2

2. **Gamification étendue**
   - Description: Badges, niveaux, défis hebdomadaires
   - Development needed: Nouvelles tables, logique métier
   - Timeline estimate: V2

3. **Fonctionnalités sociales**
   - Description: Suivre grimpeurs, feed activité
   - Development needed: Tables follows, activity_feed
   - Timeline estimate: V2

### Moonshots
*Ambitious, transformative concepts*

1. **Événements et compétitions**
   - Description: Compétitions live, classements temps réel
   - Transformative potential: Engagement communautaire fort
   - Challenges to overcome: Temps réel, gestion événements

### Insights & Learnings
*Key realizations from the session*

- **Simplicité gagne:** Un bouton "Valider" suffit, pas besoin de complexité Strava
- **Photos = cœur de l'app:** Obligatoires, bien compressées, lazy loading
- **Évolutivité prévue:** Architecture supporte social/gamification sans refonte
- **Free tier viable:** Supabase couvre les besoins MVP largement

---

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Setup Supabase complet
- Rationale: Fondation de toute l'application
- Next steps: Créer projet, configurer tables, RLS, storage buckets
- Resources needed: Documentation Supabase, schéma DB finalisé
- Timeline: Phase 1

#### #2 Priority: Écrans core React Native
- Rationale: Parcours utilisateur principal
- Next steps: Setup navigation, écrans Accueil/Profil/Classement/Détail boulder
- Resources needed: React Navigation, composants UI
- Timeline: Phase 1

#### #3 Priority: Système de rôles et auth
- Rationale: Sécurité et permissions essentielles
- Next steps: Configurer Supabase Auth, RLS par rôle, tests permissions
- Resources needed: Règles RLS documentées
- Timeline: Phase 1

---

## Reflection & Follow-up

### What Worked Well
- First Principles a clarifié les fondamentaux rapidement
- SCAMPER a permis d'éliminer les vidéos du MVP (simplification)
- Principes directeurs (rapide, visuel, coût minimal) ont guidé chaque décision

### Areas for Further Exploration
- **UX détaillée:** Wireframes des écrans principaux
- **Modèle de points:** Formule exacte difficulté → points
- **Compression images:** Librairie et paramètres optimaux

### Recommended Follow-up Techniques
- **Wireframing:** Maquettes des écrans clés
- **User Story Mapping:** Parcours utilisateur détaillé
- **Technical Spike:** Prototype Supabase + React Native

### Questions That Emerged
- Quelle formule pour calculer les points selon la difficulté ?
- Faut-il un onboarding utilisateur au premier lancement ?
- Comment gérer la suppression d'un boulder (points persistants confirmé) ?

### Next Session Planning
- **Suggested topics:** UX/Wireframes, Modèle de données détaillé, User stories MVP
- **Recommended timeframe:** Après validation de cette architecture
- **Preparation needed:** Relire ce document, préparer questions UX

---

## Stack Technique MVP — Résumé Final

| Couche | Technologie |
|--------|-------------|
| Mobile | React Native |
| Navigation | React Navigation (Tab Navigator) |
| State | React Query (recommandé) |
| Backend | Supabase (API REST auto) |
| Auth | Supabase Auth (email/password) |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Cartes | react-native-maps (natif) |
| Géoloc | React Native Geolocation |
| Crash | Firebase Crashlytics |
| Notifs (futur) | Firebase Cloud Messaging |

---

## Parcours Utilisateur MVP

```
┌─────────────────────────────────────────────────────────────────┐
│                     PREMIÈRE OUVERTURE                          │
├─────────────────────────────────────────────────────────────────┤
│  Carte salles → Suggestion salle proche → Sélection            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     OUVERTURES SUIVANTES                        │
├─────────────────────────────────────────────────────────────────┤
│  Direct → Accueil (salle mémorisée)                            │
│  Changement salle : Header accueil OU Paramètres profil        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        TAB BAR                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Accueil]          [Profil]           [Classement]            │
│   Grille boulders    Avatar, bio        Global                 │
│   Par murs           4 stats            Par salle              │
│   Toggle vue         Favoris            Profil cliquable       │
│                      Historique                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Rôles et Permissions

| Action | Invité | Utilisateur | Admin |
|--------|--------|-------------|-------|
| Voir salles/murs/boulders | ✅ | ✅ | ✅ |
| Créer compte | ✅ | — | — |
| Valider boulder | ❌ | ✅ | ✅ |
| Ajouter favori | ❌ | ✅ | ✅ |
| Commenter | ❌ | ✅ | ✅ |
| Voir classements | ✅ | ✅ | ✅ |
| Créer/éditer salle | ❌ | ❌ | ✅ (ses salles) |
| Créer/éditer murs | ❌ | ❌ | ✅ (ses salles) |
| Créer/éditer boulders | ❌ | ❌ | ✅ (ses salles) |

---

*Session facilitated using the BMAD-METHOD™ brainstorming framework*
