import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Gear } from 'phosphor-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';

export function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Deconnexion',
      'Etes-vous sur de vouloir vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Deconnexion',
          style: 'destructive',
          onPress: performLogout,
        },
      ],
      { cancelable: true }
    );
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Navigate to Home (Explore tab) after logout
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                index: 0,
                routes: [{ name: 'Explore' }],
              },
            },
          ],
        })
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container} testID="settings-screen">
      <View style={styles.header}>
        <Gear size={32} color={colors.textPrimary} weight="fill" />
        <Text style={styles.title}>Parametres</Text>
      </View>

      <View style={styles.content}>
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>
            <Button
              title="Se deconnecter"
              onPress={handleLogout}
              variant="outline"
              loading={isLoggingOut}
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
              testID="logout-button"
            />
          </View>
        )}

        {!isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.guestText}>
              Vous naviguez en mode invite. Connectez-vous pour acceder a toutes les
              fonctionnalites.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  guestText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
  },
});
