import { create } from 'zustand';

// Define the types for the state
interface DisabledState {
  disabled: {
    selector1: boolean;
    selector2: boolean;
    selector3: boolean;
    option1: boolean;
    option2: boolean;
  };
  setDisabled: (newDisabled: Partial<DisabledState['disabled']>) => void; // Use Partial to allow partial updates
}

// Initialize the state with types
const initialState: DisabledState['disabled'] = {
  selector1: false,
  selector2: false,
  selector3: false,
  option1: false,
  option2: false,
};

// Create the store with TypeScript support
export const useDisabledStore = create<DisabledState>((set) => ({
  disabled: initialState,
  setDisabled: (newDisabled) =>
    set((state) => ({
      disabled: {
        ...state.disabled,
        ...newDisabled,
      },
    })),
}));
