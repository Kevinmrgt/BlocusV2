/**
 * User Profile Validation Schemas
 * [Source: architecture/frontend-architecture.md#form-handling-with-zod]
 */

import { z } from 'zod';

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Minimum 3 caractères')
    .max(20, 'Maximum 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et _ uniquement')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(200, 'Maximum 200 caractères').optional().or(z.literal('')),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
