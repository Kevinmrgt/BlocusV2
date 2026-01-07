import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Mountains } from 'phosphor-react-native';
import { useGymStore } from '@/stores/gymStore';
import { GymHeader } from '@/components/gym/GymHeader';
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
      <GymHeader
        gymName={selectedGym?.name ?? null}
        onChangeGym={handleChangeGym}
        testID="change-gym-button"
      />

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
