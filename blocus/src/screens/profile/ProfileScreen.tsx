import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, CaretRight, Gear, Mountains } from 'phosphor-react-native';
import { Text } from '@/components/ui/Text';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { UserStats } from '@/components/user/UserStats';
import { useGymStore } from '@/stores/gymStore';
import { useAuth } from '@/providers/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { colors } from '@/theme/colors';
import type { ProfileStackParamList } from '@/navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MyProfile'>;

type TabType = 'history' | 'favorites';

export function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const selectedGym = useGymStore((state) => state.selectedGym);
  const clearSelectedGym = useGymStore((state) => state.clearSelectedGym);
  const { isAuthenticated, user } = useAuth();
  const { data: profile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState<TabType>('history');

  const handleChangeGym = () => {
    clearSelectedGym();
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

  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };

  // Guest mode - simplified view
  if (!isAuthenticated) {
    return (
      <View style={styles.container} testID="profile-screen">
        <View style={styles.header}>
          <Pressable
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            testID="settings-button"
          >
            <Gear size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Mode invité</Text>
          <Text style={styles.guestSubtitle}>Connectez-vous pour voir vos statistiques</Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]} testID="profile-screen-loading">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} testID="profile-screen">
      {/* Header with Settings */}
      <View style={styles.header}>
        <Pressable
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          testID="settings-button"
        >
          <Gear size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Profile Header */}
      <ProfileHeader
        avatarUrl={profile?.avatar_url ?? null}
        username={profile?.username ?? null}
        email={user?.email ?? ''}
        bio={profile?.bio ?? null}
        onEditPress={handleEditPress}
        testID="profile-header"
      />

      {/* Stats */}
      <UserStats
        totalPoints={profile?.total_points ?? 0}
        validationsCount={profile?.validations_count ?? 0}
        favoritesCount={profile?.favorites_count ?? 0}
        rank={profile?.rank ?? null}
        testID="user-stats"
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
          testID="tab-history"
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Historique
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => setActiveTab('favorites')}
          testID="tab-favorites"
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
            Favoris
          </Text>
        </Pressable>
      </View>

      {/* Tab Content - Placeholder for Story 4.4 */}
      <View style={styles.tabContent}>
        {activeTab === 'history' ? (
          <View style={styles.emptyState} testID="history-placeholder">
            <Mountains size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Vos validations apparaîtront ici</Text>
          </View>
        ) : (
          <View style={styles.emptyState} testID="favorites-placeholder">
            <Mountains size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Vos favoris apparaîtront ici</Text>
          </View>
        )}
      </View>

      {/* Current Gym Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salle actuelle</Text>
        <Pressable style={styles.card} onPress={handleChangeGym} testID="change-gym-button">
          <MapPin size={24} color={colors.primary} weight="fill" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {selectedGym?.name ?? 'Aucune salle sélectionnée'}
            </Text>
            <Text style={styles.cardAction}>Changer de salle</Text>
          </View>
          <CaretRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  guestContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  guestSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  guestTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: 52,
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
    alignSelf: 'flex-end',
    padding: 8,
    paddingRight: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  tabContainer: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  tabContent: {
    minHeight: 200,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.primary,
  },
});
