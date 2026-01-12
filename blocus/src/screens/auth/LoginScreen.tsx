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
import { validateLoginForm, LoginFormData } from '@/lib/schemas/auth';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: keyof LoginFormData) => (value: string) => {
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
    const validationErrors = validateLoginForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setApiError(error);
      }
      // Navigation is handled by AuthProvider state change
    } catch {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
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
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour acceder a toutes les fonctionnalites
            </Text>
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
              placeholder="Votre mot de passe"
              secureTextEntry
              autoComplete="password"
              value={formData.password}
              onChangeText={handleChange('password')}
              error={errors.password}
              editable={!isLoading}
            />

            <Button
              title="Se connecter"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <Pressable onPress={navigateToRegister} disabled={isLoading}>
              <Text style={styles.link}>Inscrivez-vous</Text>
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
