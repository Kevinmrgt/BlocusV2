import { render, screen, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WallSection } from '@/components/gym/WallSection';
import * as useBoulders from '@/hooks/useBoulders';
import type { Tables } from '@/types/database';
import type { BoulderWithPhotos } from '@/services/api/boulders';

jest.mock('@/hooks/useBoulders');

const mockWall: Tables<'walls'> = {
  id: 'wall-1',
  gym_id: 'gym-1',
  name: 'Test Wall',
  description: null,
  order_index: 0,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const mockBoulders: BoulderWithPhotos[] = [
  {
    id: 'boulder-1',
    wall_id: 'wall-1',
    title: 'Boulder 1',
    difficulty: 3,
    description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    boulder_photos: [],
  },
  {
    id: 'boulder-2',
    wall_id: 'wall-1',
    title: 'Boulder 2',
    difficulty: 7,
    description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    boulder_photos: [],
  },
];

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('WallSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders wall name as title', () => {
    jest.spyOn(useBoulders, 'useBouldersByWall').mockReturnValue({
      data: mockBoulders,
      isLoading: false,
    } as ReturnType<typeof useBoulders.useBouldersByWall>);

    renderWithProviders(<WallSection wall={mockWall} />);

    expect(screen.getByText('Test Wall')).toBeTruthy();
  });

  it('renders with testID containing wall id', () => {
    jest.spyOn(useBoulders, 'useBouldersByWall').mockReturnValue({
      data: mockBoulders,
      isLoading: false,
    } as ReturnType<typeof useBoulders.useBouldersByWall>);

    renderWithProviders(<WallSection wall={mockWall} />);

    expect(screen.getByTestId('wall-section-wall-1')).toBeTruthy();
  });

  it('shows loading spinner while fetching boulders', () => {
    jest.spyOn(useBoulders, 'useBouldersByWall').mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useBoulders.useBouldersByWall>);

    renderWithProviders(<WallSection wall={mockWall} />);

    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('shows empty state when no boulders', () => {
    jest.spyOn(useBoulders, 'useBouldersByWall').mockReturnValue({
      data: [] as BoulderWithPhotos[],
      isLoading: false,
    } as ReturnType<typeof useBoulders.useBouldersByWall>);

    renderWithProviders(<WallSection wall={mockWall} />);

    expect(screen.getByText('Aucun boulder dans ce mur')).toBeTruthy();
  });

  it('renders boulder cards when data is loaded', () => {
    jest.spyOn(useBoulders, 'useBouldersByWall').mockReturnValue({
      data: mockBoulders,
      isLoading: false,
    } as ReturnType<typeof useBoulders.useBouldersByWall>);

    renderWithProviders(<WallSection wall={mockWall} />);

    expect(screen.getByText('Boulder 1')).toBeTruthy();
    expect(screen.getByText('Boulder 2')).toBeTruthy();
  });

  it('calls onBoulderPress when boulder is pressed', () => {
    jest.spyOn(useBoulders, 'useBouldersByWall').mockReturnValue({
      data: mockBoulders,
      isLoading: false,
    } as ReturnType<typeof useBoulders.useBouldersByWall>);

    const onBoulderPress = jest.fn();
    renderWithProviders(<WallSection wall={mockWall} onBoulderPress={onBoulderPress} />);

    fireEvent.press(screen.getByTestId('boulder-card-boulder-1'));

    expect(onBoulderPress).toHaveBeenCalledWith(mockBoulders[0]);
  });
});
