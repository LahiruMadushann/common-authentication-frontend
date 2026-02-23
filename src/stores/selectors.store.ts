import { create } from 'zustand';

// Define the types for the state and actions
interface Selectors {
  selector1: boolean;
  selector2: boolean;
  selector3: boolean;
  option1: boolean;
  option2: boolean;
}

interface SelectedTypeStoreState {
  selectors: Selectors; // The state object
  setSelectors: (newSelectors: Partial<Selectors>) => void; // Action to update the selectors
}

// Initialize the state with types
const initialState: Pick<SelectedTypeStoreState, 'selectors'> = {
  selectors: {
    selector1: false,
    selector2: false,
    selector3: false,
    option1: false,
    option2: false,
  },
};

// Create the store with TypeScript support
export const useSelectedTypeStore = create<SelectedTypeStoreState>((set) => ({
  ...initialState,
  setSelectors: (newSelectors) =>
    set((state) => ({
      selectors: {
        ...state.selectors,
        ...newSelectors, // Merge the existing state with the new state
      },
    })),
}));
