# Testing Strategy

Cette section définit l'approche de test pour garantir la qualité du code et prévenir les régressions.

## Test Pyramid

```
         ┌─────────────────┐
         │   E2E Tests     │  Maestro (V2)
         │   (Minimal)     │  5-10 critical flows
         └────────┬────────┘
                  │
      ┌───────────┴───────────┐
      │  Integration Tests    │  React Query + Services
      │  (Moderate)           │  Mock Supabase
      └───────────┬───────────┘
                  │
  ┌───────────────┴───────────────┐
  │       Unit Tests              │  Components, Hooks
  │       (Extensive)             │  Jest + RNTL
  └───────────────────────────────┘
```

## Unit Testing

```typescript
// __tests__/components/boulder/DifficultyBadge.test.tsx

import { render } from "@testing-library/react-native";
import { DifficultyBadge } from "@/components/boulder/DifficultyBadge";
import { colors } from "@/theme/colors";

describe("DifficultyBadge", () => {
  it("renders correct level", () => {
    const { getByText } = render(<DifficultyBadge level={5} />);
    expect(getByText("5")).toBeTruthy();
  });

  it("applies easy color for levels 1-3", () => {
    const { getByTestId } = render(<DifficultyBadge level={2} />);
    const badge = getByTestId("difficulty-badge");
    expect(badge.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: colors.difficultyEasy })
    );
  });

  it("applies expert color for levels 9-10", () => {
    const { getByTestId } = render(<DifficultyBadge level={10} />);
    const badge = getByTestId("difficulty-badge");
    expect(badge.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: colors.difficultyExpert })
    );
  });
});
```

```typescript
// __tests__/hooks/useValidateBoulder.test.tsx

import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useValidateBoulder } from "@/hooks/useBoulders";

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({ data: mockValidation, error: null })
          ),
        })),
      })),
    })),
  },
}));

const mockValidation = {
  id: "validation-1",
  user_id: "user-1",
  boulder_id: "boulder-1",
  points_earned: 50,
  validated_at: "2024-01-01T00:00:00Z",
};

describe("useValidateBoulder", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("creates validation and invalidates queries", async () => {
    const { result } = renderHook(() => useValidateBoulder(), { wrapper });

    result.current.mutate("boulder-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

## Integration Testing

```typescript
// __tests__/services/api/boulders.test.ts

import { getBoulderDetails, getWallBoulders } from "@/services/api/boulders";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase");

describe("Boulder Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBoulderDetails", () => {
    it("fetches boulder with photos and counts", async () => {
      const mockBoulder = {
        id: "boulder-1",
        title: "Test Boulder",
        difficulty: 5,
        boulder_photos: [{ id: "photo-1", url: "https://..." }],
        validations: [{ count: 10 }],
        comments: [{ count: 3 }],
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest
              .fn()
              .mockResolvedValue({ data: mockBoulder, error: null }),
          }),
        }),
      });

      const result = await getBoulderDetails("boulder-1");

      expect(result).toEqual(mockBoulder);
      expect(supabase.from).toHaveBeenCalledWith("boulders");
    });

    it("throws error on failure", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: "Not found", code: "PGRST116" },
            }),
          }),
        }),
      });

      await expect(getBoulderDetails("invalid-id")).rejects.toThrow();
    });
  });
});
```

## E2E Testing (V2 - Maestro)

```yaml
# maestro/flows/validate-boulder.yaml
appId: com.yourcompany.climbingapp
---
- launchApp

# Login
- tapOn: "Se connecter"
- inputText:
    id: "email-input"
    text: "test@example.com"
- inputText:
    id: "password-input"
    text: "testpassword123"
- tapOn: "Connexion"

# Navigate to boulder
- waitForAnimationToEnd
- tapOn: "Explorer"
- tapOn: "Salle Test"
- tapOn: "Mur Nord"
- tapOn: "Boulder Facile"

# Validate boulder
- tapOn:
    id: "validate-button"
- assertVisible: "+50 pts"
- assertVisible:
    id: "validation-indicator"

# Verify points updated
- tapOn: "Profil"
- assertVisible: "50" # Total points
```

## Coverage Goals

| Test Type   | Coverage Target | Focus Areas                 |
| ----------- | --------------- | --------------------------- |
| Unit        | 80%+            | Components, hooks, utils    |
| Integration | 60%+            | Services, API layer         |
| E2E         | Critical paths  | Auth, validation, favorites |

---
