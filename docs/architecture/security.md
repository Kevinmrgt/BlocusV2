# Security

Cette section définit les mesures de sécurité implémentées à chaque niveau de l'application.

## Authentication Security

```typescript
// src/lib/auth-security.ts

// Password requirements (enforced by Supabase Auth)
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: false, // Supabase default
  requireNumber: false, // Supabase default
  requireSpecial: false, // Supabase default
};

// Session management
export const SESSION_CONFIG = {
  autoRefreshToken: true,
  persistSession: true,
  // JWT expires after 1 hour, refresh token after 7 days (Supabase defaults)
};

// Rate limiting handled by Supabase Auth
// - Login: 30 requests per hour per IP
// - Signup: 10 requests per hour per IP
```

## Data Validation

```typescript
// src/lib/schemas/validation.ts

import { z } from "zod";

// Input sanitization schemas
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Commentaire requis")
    .max(500, "Maximum 500 caractères")
    .trim()
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      "Contenu non autorisé"
    ),
});

export const usernameSchema = z
  .string()
  .min(3, "Minimum 3 caractères")
  .max(20, "Maximum 20 caractères")
  .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement")
  .transform((val) => val.toLowerCase());
```

## Image Upload Security

```typescript
// src/services/api/storage.ts

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function uploadImageSecure(
  bucket: string,
  uri: string,
  fileName: string
): Promise<string> {
  // Validate file type from response
  const response = await fetch(uri);
  const contentType = response.headers.get("content-type");

  if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType)) {
    throw new Error("Type de fichier non autorisé");
  }

  const blob = await response.blob();

  // Validate file size
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 2MB)");
  }

  // Upload with sanitized filename
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${Date.now()}_${sanitizedName}`;

  // ... upload logic
}
```

## Security Headers (Supabase Managed)

Supabase gère automatiquement les headers de sécurité pour l'API:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000`
- CORS configuré par projet

## Sensitive Data Handling

```typescript
// Ne jamais stocker en clair
// - Passwords: Gérés par Supabase Auth (bcrypt)
// - JWT tokens: AsyncStorage (encrypté iOS Keychain / Android Keystore)

// Variables d'environnement
// - Supabase URL: Public (EXPO_PUBLIC_*)
// - Anon Key: Public (limité par RLS)
// - Service Role Key: JAMAIS dans le client

// Logging sécurisé
const sanitizeForLogs = (data: any) => {
  const sensitive = ["password", "token", "key", "secret"];
  return JSON.stringify(data, (key, value) =>
    sensitive.some((s) => key.toLowerCase().includes(s)) ? "[REDACTED]" : value
  );
};
```

## Defense in Depth Summary

| Layer       | Protection                         | Implementation          |
| ----------- | ---------------------------------- | ----------------------- |
| API         | Anon key + RLS enforcement         | Supabase client         |
| Database    | Row Level Security policies        | PostgreSQL RLS          |
| Storage     | Bucket policies                    | Supabase Storage        |
| Application | Input validation, error boundaries | Zod, React ErrorBoundary|
| Transport   | HTTPS only                         | Supabase managed        |

---
