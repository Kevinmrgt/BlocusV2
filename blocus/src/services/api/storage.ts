/**
 * Storage Service for file uploads
 * [Source: architecture/backend-architecture-row-level-security.md]
 */

import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '@/lib/supabase';

/**
 * Compress image to specified dimensions and quality
 */
async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 500, height: 500 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

/**
 * Convert image URI to Blob for upload
 */
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

/**
 * Upload avatar image to Supabase Storage
 * @param userId - User ID for the avatar filename
 * @param imageUri - Local URI of the selected image
 * @returns Public URL of the uploaded avatar
 */
export async function uploadAvatar(userId: string, imageUri: string): Promise<string> {
  // Compress the image first
  const compressedUri = await compressImage(imageUri);

  // Convert to blob
  const blob = await uriToBlob(compressedUri);

  // Create a unique filename with timestamp to bust cache
  const filename = `${userId}.jpg`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage.from('avatars').upload(filename, blob, {
    upsert: true,
    contentType: 'image/jpeg',
  });

  if (uploadError) throw uploadError;

  // Get the public URL
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filename);

  // Add cache-busting timestamp
  return `${urlData.publicUrl}?t=${Date.now()}`;
}
