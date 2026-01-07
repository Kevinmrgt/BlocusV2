import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { colors } from '@/theme/colors';
import { useGyms } from '@/hooks/useGyms';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/layout/EmptyState';
import { ErrorState } from '@/components/layout/ErrorState';
import { Crashlytics } from '@/lib/crashlytics';
import { Health, type HealthStatus } from '@/lib/health';

export function ExploreScreen() {
  const { data: gyms, isLoading, error, refetch } = useGyms();
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  useEffect(() => {
    if (__DEV__) {
      Health.getStatus().then(setHealthStatus);
    }
  }, []);

  const handleCrashTest = () => {
    Alert.alert(
      'Test Crashlytics',
      'Cela va provoquer un crash intentionnel pour tester Crashlytics. Continuer?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Crasher',
          style: 'destructive',
          onPress: () => Crashlytics.crash(),
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Chargement des salles..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Erreur de connexion'}
        onRetry={() => refetch()}
      />
    );
  }

  const gymCount = gyms?.length ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Blocus</Text>
      <Text style={styles.subtitle}>Votre application d&apos;escalade</Text>

      <View style={styles.statusContainer}>
        {gymCount === 0 ? (
          <EmptyState
            title="Aucune salle"
            message="Aucune salle d'escalade n'est encore disponible."
          />
        ) : (
          <View style={styles.countContainer}>
            <Text style={styles.countNumber}>{gymCount}</Text>
            <Text style={styles.countLabel}>
              {gymCount === 1 ? 'salle disponible' : 'salles disponibles'}
            </Text>
          </View>
        )}
      </View>

      {__DEV__ && (
        <View style={styles.devSection}>
          {healthStatus && (
            <View style={styles.healthContainer}>
              <Text style={styles.healthTitle}>Health Status</Text>
              <View style={styles.healthRow}>
                <Text style={styles.healthLabel}>Network:</Text>
                <Text
                  style={[
                    styles.healthValue,
                    healthStatus.network ? styles.healthOk : styles.healthError,
                  ]}
                >
                  {healthStatus.network ? '✓ Connected' : '✗ Disconnected'}
                </Text>
              </View>
              <View style={styles.healthRow}>
                <Text style={styles.healthLabel}>Supabase:</Text>
                <Text
                  style={[
                    styles.healthValue,
                    healthStatus.api ? styles.healthOk : styles.healthError,
                  ]}
                >
                  {healthStatus.api ? '✓ Connected' : '✗ Error'}
                </Text>
              </View>
            </View>
          )}

          <Pressable style={styles.crashButton} onPress={handleCrashTest}>
            <Text style={styles.crashButtonText}>🔥 Test Crash</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  countContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 3,
    padding: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  countLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
  },
  countNumber: {
    color: colors.primary,
    fontSize: 48,
    fontWeight: '700',
  },
  crashButton: {
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 12,
  },
  crashButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  devSection: {
    marginBottom: 24,
  },
  healthContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  healthError: {
    color: colors.error,
  },
  healthLabel: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
  healthOk: {
    color: colors.success,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  healthTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  healthValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
});
