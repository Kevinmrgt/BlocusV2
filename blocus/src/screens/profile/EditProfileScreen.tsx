/**
 * EditProfileScreen
 * Edit username, bio, and avatar
 * [Source: front-end-spec.md#profil-utilisateur]
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Images } from 'phosphor-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { UserAvatar } from '@/components/user/UserAvatar';
import { useUserProfile, useUpdateProfile } from '@/hooks/useUserProfile';
import { uploadAvatar } from '@/services/api/storage';
import { editProfileSchema, type EditProfileFormData } from '@/lib/schemas/user';
import { colors } from '@/theme/colors';
import type { ProfileStackParamList } from '@/navigation/types';

type EditProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen() {
  const navigation = useNavigation<EditProfileNavigationProp>();
  const { data: profile } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState<EditProfileFormData>({
    username: profile?.username ?? '',
    bio: profile?.bio ?? '',
  });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof EditProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const showImageOptions = () => {
    Alert.alert('Changer la photo', 'Choisissez une option', [
      { text: 'Appareil photo', onPress: () => pickImage(true) },
      { text: 'Galerie', onPress: () => pickImage(false) },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    // Validate form data
    const result = editProfileSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsUploading(true);

    try {
      let avatarUrl = profile?.avatar_url;

      // Upload new avatar if selected
      if (avatarUri && profile?.id) {
        avatarUrl = await uploadAvatar(profile.id, avatarUri);
      }

      // Update profile
      await updateProfile.mutateAsync({
        username: formData.username || undefined,
        bio: formData.bio || undefined,
        avatar_url: avatarUrl ?? undefined,
      });

      navigation.goBack();
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsUploading(false);
    }
  };

  const isSaving = isUploading || updateProfile.isPending;
  const displayAvatarUrl = avatarUri ?? profile?.avatar_url ?? null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable onPress={showImageOptions} testID="avatar-picker">
            <UserAvatar avatarUrl={displayAvatarUrl} size="large" testID="edit-avatar" />
          </Pressable>

          <View style={styles.avatarButtons}>
            <Pressable
              style={styles.avatarButton}
              onPress={() => pickImage(true)}
              testID="camera-button"
            >
              <Camera size={20} color={colors.primary} />
              <Text style={styles.avatarButtonText}>Photo</Text>
            </Pressable>
            <Pressable
              style={styles.avatarButton}
              onPress={() => pickImage(false)}
              testID="gallery-button"
            >
              <Images size={20} color={colors.primary} />
              <Text style={styles.avatarButtonText}>Galerie</Text>
            </Pressable>
          </View>
        </View>

        {/* Username Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Nom d&apos;utilisateur</Text>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            value={formData.username ?? ''}
            onChangeText={(value) => handleChange('username', value)}
            placeholder="Votre pseudo"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            testID="username-input"
          />
          {errors.username && (
            <Text style={styles.errorText} testID="username-error">
              {errors.username}
            </Text>
          )}
          <Text style={styles.hint}>3-20 caractères, lettres, chiffres et _</Text>
        </View>

        {/* Bio Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.bio && styles.inputError]}
            value={formData.bio ?? ''}
            onChangeText={(value) => handleChange('bio', value)}
            placeholder="Parlez-nous de vous..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={200}
            testID="bio-input"
          />
          {errors.bio && (
            <Text style={styles.errorText} testID="bio-error">
              {errors.bio}
            </Text>
          )}
          <Text style={styles.hint}>{formData.bio?.length ?? 0}/200 caractères</Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title={isSaving ? 'Enregistrement...' : 'Enregistrer'}
          onPress={handleSubmit}
          disabled={isSaving}
          testID="save-button"
        />
        {isSaving && (
          <ActivityIndicator style={styles.loader} size="small" color={colors.primary} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatarButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  avatarButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  field: {
    marginBottom: 20,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: 16,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  loader: {
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
