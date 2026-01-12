import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { validateRegisterForm, RegisterFormData } from '@/lib/schemas/auth';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const { error } = await signUp(formData.email, formData.password);

      if (error) {
        setApiError(error);
      } else {
        // Show success message for email confirmation
        Alert.alert('Compte cree', 'Verifiez votre email pour confirmer votre compte.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>Creez votre compte pour commencer a grimper</Text>
          </View>

          <View style={styles.form}>
            {apiError && (
              <View style={styles.apiErrorContainer}>
                <Text style={styles.apiError}>{apiError}</Text>
              </View>
            )}

            <Input
              label="Email"
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoComplete="email"
              value={formData.email}
              onChangeText={handleChange('email')}
              error={errors.email}
              editable={!isLoading}
            />

            <Input
              label="Mot de passe"
              placeholder="Minimum 8 caracteres"
              secureTextEntry
              autoComplete="new-password"
              value={formData.password}
              onChangeText={handleChange('password')}
              error={errors.password}
              editable={!isLoading}
            />

            <Input
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              secureTextEntry
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              editable={!isLoading}
            />

            <Button
              title="Creer mon compte"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Deja un compte ?</Text>
            <Pressable onPress={navigateToLogin} disabled={isLoading}>
              <Text style={styles.link}>Connectez-vous</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  apiError: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  apiErrorContainer: {
    backgroundColor: `${colors.error}15`,
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  keyboardView: {
    flex: 1,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
});
