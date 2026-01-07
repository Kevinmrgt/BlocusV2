import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { User, MapPin, CaretRight } from 'phosphor-react-native';
import { useGymStore } from '@/stores/gymStore';
import { colors } from '@/theme/colors';

export function ProfileScreen() {
  const navigation = useNavigation();
  const selectedGym = useGymStore((state) => state.selectedGym);
  const clearSelectedGym = useGymStore((state) => state.clearSelectedGym);

  const handleChangeGym = () => {
    clearSelectedGym();
    // Navigate to Explore tab and reset its stack to GymMap
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Explore',
            state: {
              index: 0,
              routes: [{ name: 'GymMap' }],
            },
          },
        ],
      })
    );
  };

  return (
    <View style={styles.container} testID="profile-screen">
      {/* Header placeholder */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={48} color={colors.white} weight="fill" />
        </View>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Coming in Epic 4</Text>
      </View>

      {/* Current Gym Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salle actuelle</Text>
        <Pressable style={styles.gymCard} onPress={handleChangeGym} testID="change-gym-button">
          <MapPin size={24} color={colors.primary} weight="fill" />
          <View style={styles.gymInfo}>
            <Text style={styles.gymName} numberOfLines={1}>
              {selectedGym?.name ?? 'Aucune salle sélectionnée'}
            </Text>
            <Text style={styles.gymAction}>Changer de salle</Text>
          </View>
          <CaretRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  gymAction: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 2,
  },
  gymCard: {
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
  gymInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gymName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingBottom: 24,
    paddingTop: 60,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
  },
});
