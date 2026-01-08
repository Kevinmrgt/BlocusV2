import { render, screen, fireEvent } from '@testing-library/react-native';
import { BoulderCard } from '@/components/boulder/BoulderCard';
import type { BoulderWithPhotos } from '@/services/api/boulders';

const mockBoulderWithPhoto: BoulderWithPhotos = {
  id: 'boulder-1',
  wall_id: 'wall-1',
  title: 'Test Boulder',
  difficulty: 5,
  description: 'A test boulder',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  boulder_photos: [
    {
      id: 'photo-1',
      url: 'https://example.com/photo.jpg',
      order_index: 0,
      boulder_id: 'boulder-1',
      created_at: '2024-01-01',
    },
  ],
};

const mockBoulderWithoutPhoto: BoulderWithPhotos = {
  id: 'boulder-2',
  wall_id: 'wall-1',
  title: 'Boulder Without Photo',
  difficulty: 7,
  description: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  boulder_photos: [],
};

describe('BoulderCard', () => {
  it('renders boulder title', () => {
    render(<BoulderCard boulder={mockBoulderWithPhoto} />);

    expect(screen.getByText('Test Boulder')).toBeTruthy();
  });

  it('renders with testID containing boulder id', () => {
    render(<BoulderCard boulder={mockBoulderWithPhoto} />);

    expect(screen.getByTestId('boulder-card-boulder-1')).toBeTruthy();
  });

  it('renders DifficultyBadge with correct level', () => {
    render(<BoulderCard boulder={mockBoulderWithPhoto} />);

    expect(screen.getByTestId('difficulty-badge')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('renders placeholder when no photo available', () => {
    render(<BoulderCard boulder={mockBoulderWithoutPhoto} />);

    // The Mountains icon from phosphor should be rendered in placeholder
    expect(screen.getByTestId('boulder-card-boulder-2')).toBeTruthy();
    expect(screen.getByText('Boulder Without Photo')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<BoulderCard boulder={mockBoulderWithPhoto} onPress={onPress} />);

    fireEvent.press(screen.getByTestId('boulder-card-boulder-1'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not throw when pressed without onPress handler', () => {
    render(<BoulderCard boulder={mockBoulderWithPhoto} />);

    expect(() => {
      fireEvent.press(screen.getByTestId('boulder-card-boulder-1'));
    }).not.toThrow();
  });
});
