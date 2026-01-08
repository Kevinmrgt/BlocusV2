import { render, screen } from '@testing-library/react-native';
import { DifficultyBadge } from '@/components/boulder/DifficultyBadge';
import { colors } from '@/theme/colors';

describe('DifficultyBadge', () => {
  it('renders the difficulty level', () => {
    render(<DifficultyBadge level={5} />);

    expect(screen.getByText('5')).toBeTruthy();
  });

  it('renders with testID', () => {
    render(<DifficultyBadge level={3} />);

    expect(screen.getByTestId('difficulty-badge')).toBeTruthy();
  });

  it('applies easy color for levels 1-3', () => {
    const { getByTestId } = render(<DifficultyBadge level={2} />);
    const badge = getByTestId('difficulty-badge');

    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: colors.difficultyEasy })])
    );
  });

  it('applies medium color for levels 4-6', () => {
    const { getByTestId } = render(<DifficultyBadge level={5} />);
    const badge = getByTestId('difficulty-badge');

    expect(badge.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.difficultyMedium }),
      ])
    );
  });

  it('applies hard color for levels 7-8', () => {
    const { getByTestId } = render(<DifficultyBadge level={7} />);
    const badge = getByTestId('difficulty-badge');

    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: colors.difficultyHard })])
    );
  });

  it('applies expert color for levels 9-10', () => {
    const { getByTestId } = render(<DifficultyBadge level={10} />);
    const badge = getByTestId('difficulty-badge');

    expect(badge.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.difficultyExpert }),
      ])
    );
  });

  it('renders small size by default', () => {
    const { getByTestId } = render(<DifficultyBadge level={5} />);
    const badge = getByTestId('difficulty-badge');

    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderRadius: 12, height: 24, width: 24 })])
    );
  });

  it('renders medium size when specified', () => {
    const { getByTestId } = render(<DifficultyBadge level={5} size="medium" />);
    const badge = getByTestId('difficulty-badge');

    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderRadius: 16, height: 32, width: 32 })])
    );
  });
});
