import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/theme/colors';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

type ConnectionStatus = 'connecting' | 'connected' | 'error';

export function ExploreScreen() {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [gymCount, setGymCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error: queryError } = await supabase.from('gyms').select('*').limit(10);

        if (queryError) {
          setError(queryError.message);
          setStatus('error');
          return;
        }

        setGymCount((data as Tables<'gyms'>[])?.length ?? 0);
        setStatus('connected');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    }

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explorer</Text>
      <Text style={styles.subtitle}>Carte des salles à venir</Text>

      <View style={styles.statusContainer}>
        {status === 'connecting' && (
          <>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.statusText}>Connexion à Supabase...</Text>
          </>
        )}
        {status === 'connected' && (
          <>
            <Text style={styles.successText}>Supabase connecté</Text>
            <Text style={styles.statusText}>{gymCount} salle(s) trouvée(s)</Text>
          </>
        )}
        {status === 'error' && (
          <>
            <Text style={styles.errorText}>Erreur de connexion</Text>
            <Text style={styles.statusText}>{error}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  successText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
  },
});
