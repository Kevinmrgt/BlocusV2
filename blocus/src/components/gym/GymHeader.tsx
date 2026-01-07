import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin } from 'phosphor-react-native';
import { colors } from '@/theme/colors';

interface GymHeaderProps {
  gymName: string | null;
  onChangeGym: () => void;
  testID?: string;
}

export function GymHeader({ gymName, onChangeGym, testID }: GymHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.gymSelector} onPress={onChangeGym} testID={testID ?? 'gym-header'}>
        <MapPin size={24} color={colors.primary} weight="fill" />
        <Text style={styles.gymName} numberOfLines={1}>
          {gymName ?? 'Aucune salle'}
        </Text>
        <Text style={styles.changeText}>Changer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  changeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
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
});
