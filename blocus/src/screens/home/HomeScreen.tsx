import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Mountains } from 'phosphor-react-native';
import { useGymStore } from '@/stores/gymStore';
import { colors } from '@/theme/colors';
import type { ExploreStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectedGym = useGymStore((state) => state.selectedGym);
  const clearSelectedGym = useGymStore((state) => state.clearSelectedGym);

  const handleChangeGym = () => {
    clearSelectedGym();
    navigation.reset({
      index: 0,
      routes: [{ name: 'GymMap' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with gym name */}
      <View style={styles.header}>
        <Pressable style={styles.gymSelector} onPress={handleChangeGym} testID="change-gym-button">
          <MapPin size={24} color={colors.primary} weight="fill" />
          <Text style={styles.gymName} numberOfLines={1}>
            {selectedGym?.name ?? 'Aucune salle'}
          </Text>
          <Text style={styles.changeText}>Changer</Text>
        </Pressable>
      </View>

      {/* Placeholder content */}
      <View style={styles.content}>
        <Mountains size={80} color={colors.textSecondary} weight="thin" />
        <Text style={styles.title}>Bienvenue !</Text>
        <Text style={styles.subtitle}>
          Les boulders de {selectedGym?.name ?? 'cette salle'} arrivent bientôt.
        </Text>
        <Text style={styles.comingSoon}>Epic 3 - Boulder Exploration</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  changeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  comingSoon: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 24,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  gymName: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  gymSelector: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 60,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
  },
});
