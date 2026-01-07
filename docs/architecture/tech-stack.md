# Tech Stack

Cette table est la **source de vérité définitive** pour toutes les technologies du projet. Tout développement doit utiliser exactement ces versions.

## Technology Stack Table

| Category                | Technology                         | Version | Purpose                        | Rationale                          |
| ----------------------- | ---------------------------------- | ------- | ------------------------------ | ---------------------------------- |
| **Frontend Language**   | TypeScript                         | 5.3+    | Type safety, meilleure DX      | Imposé par PRD, standard industrie |
| **Frontend Framework**  | React Native                       | 0.73+   | Cross-platform iOS/Android     | Imposé par PRD                     |
| **Expo SDK**            | Expo                               | 52+     | Managed workflow, builds       | Recommandé PRD pour RN            |
| **UI Component Library**| Custom + React Native Paper        | 5.x     | Design system custom           | Front-End Spec                     |
| **State Management**    | React Query (TanStack)             | 5.x     | Server state, caching, sync    | Imposé par PRD                     |
| **Local State**         | Zustand                            | 4.x     | Client state léger             | Simplicité vs Redux                |
| **Navigation**          | React Navigation                   | 6.x     | Tab + Stack navigation         | Imposé par PRD                     |
| **Backend Platform**    | Supabase                           | Cloud   | BaaS tout-en-un                | Imposé par PRD (NFR4)              |
| **Database**            | PostgreSQL                         | 15+     | Base relationnelle             | Inclus Supabase                    |
| **API Style**           | REST (PostgREST)                   | Auto    | API auto-générée               | Natif Supabase                     |
| **Authentication**      | Supabase Auth                      | Inclus  | Email/password                 | Imposé par PRD                     |
| **File Storage**        | Supabase Storage                   | Inclus  | Images                         | Imposé par PRD                     |
| **Maps**                | react-native-maps                  | 1.x     | Carte des salles               | Imposé par PRD                     |
| **Geolocation**         | expo-location                      | 17.x    | Position utilisateur           | Expo managed                       |
| **Image Handling**      | expo-image                         | 1.x     | Affichage optimisé             | Lazy loading, cache                |
| **Image Compression**   | expo-image-manipulator             | 12.x    | Compression avant upload       | NFR2                               |
| **Animations**          | react-native-reanimated            | 3.x     | Animations performantes        | Front-End Spec                     |
| **Icons**               | phosphor-react-native              | 2.x     | Iconographie                   | Front-End Spec                     |
| **Fonts**               | expo-font                          | 12.x    | Inter, JetBrains Mono          | Front-End Spec                     |
| **Async Storage**       | @react-native-async-storage        | 1.x     | Persistence locale             | Gym sélectionné                    |
| **Form Validation**     | Zod                                | 3.x     | Validation schémas             | Type-safe, léger                   |
| **HTTP Client**         | @supabase/supabase-js              | 2.x     | Client Supabase                | Intégration native                 |
| **Crash Reporting**     | @react-native-firebase/crashlytics | 20.x    | Monitoring crashes             | Imposé PRD (NFR7)                  |
| **Testing - Unit**      | Jest                               | 29.x    | Tests unitaires                | Standard RN                        |
| **Testing - Components**| React Native Testing Library       | 12.x    | Tests composants               | Standard communauté                |
| **Testing - E2E**       | Maestro                            | 1.x     | Tests E2E (V2)                 | Simple, YAML-based                 |
| **Linting**             | ESLint                             | 8.x     | Qualité code                   | Standard                           |
| **Formatting**          | Prettier                           | 3.x     | Formatage cohérent             | Standard                           |
| **Build Tool**          | EAS Build                          | Cloud   | Builds iOS/Android             | Recommandé Expo                    |
| **CI/CD**               | GitHub Actions                     | -       | Automatisation                 | Gratuit, intégré                   |
| **Type Generation**     | supabase gen types                 | CLI     | Types depuis DB                | Sync types TS/DB                   |

---
