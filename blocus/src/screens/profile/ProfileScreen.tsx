import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, MapPin, CaretRight, Gear } from 'phosphor-react-native';
import { useGymStore } from '@/stores/gymStore';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';
import type { ProfileStackParamList } from '@/navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MyProfile'>;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const selectedGym = useGymStore((state) => state.selectedGym);
  const clearSelectedGym = useGymStore((state) => state.clearSelectedGym);
  const { isAuthenticated, user } = useAuth();

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

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container} testID="profile-screen">
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          testID="settings-button"
        >
          <Gear size={24} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.avatarContainer}>
          <User size={48} color={colors.white} weight="fill" />
        </View>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>{isAuthenticated ? user?.email : 'Mode invite'}</Text>
      </View>

      {/* Current Gym Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salle actuelle</Text>
        <Pressable style={styles.card} onPress={handleChangeGym} testID="change-gym-button">
          <MapPin size={24} color={colors.primary} weight="fill" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {selectedGym?.name ?? 'Aucune salle selectionnee'}
            </Text>
            <Text style={styles.cardAction}>Changer de salle</Text>
          </View>
          <CaretRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parametres</Text>
        <Pressable style={styles.card} onPress={handleSettingsPress} testID="settings-card">
          <Gear size={24} color={colors.primary} weight="fill" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Parametres</Text>
            <Text style={styles.cardAction}>Compte et preferences</Text>
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
  card: {
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
  cardAction: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 2,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingBottom: 24,
    paddingTop: 60,
    position: 'relative',
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
  settingsButton: {
    padding: 8,
    position: 'absolute',
    right: 16,
    top: 52,
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
