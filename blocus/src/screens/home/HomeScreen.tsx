import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGymStore } from '@/stores/gymStore';
import { useWallsByGym } from '@/hooks/useWalls';
import { GymHeader } from '@/components/gym/GymHeader';
import { WallSection } from '@/components/gym/WallSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/layout/EmptyState';
import { ErrorState } from '@/components/layout/ErrorState';
import { colors } from '@/theme/colors';
import type { ExploreStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectedGym = useGymStore((state) => state.selectedGym);
  const clearSelectedGym = useGymStore((state) => state.clearSelectedGym);

  const { data: walls, isLoading, error, refetch, isRefetching } = useWallsByGym(selectedGym?.id);

  const handleChangeGym = () => {
    clearSelectedGym();
    navigation.reset({
      index: 0,
      routes: [{ name: 'GymMap' }],
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Chargement des murs..." />;
    }

    if (error) {
      return <ErrorState message="Impossible de charger les murs" onRetry={refetch} />;
    }

    if (!walls || walls.length === 0) {
      return (
        <EmptyState title="Aucun mur" message="Cette salle n'a pas encore de murs configurés" />
      );
    }

    return walls.map((wall) => <WallSection key={wall.id} wall={wall} />);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      testID="home-screen"
    >
      <GymHeader
        gymName={selectedGym?.name ?? null}
        onChangeGym={handleChangeGym}
        testID="change-gym-button"
      />

      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
});
