import { create } from 'zustand';

// Define the types for the state and actions
interface SelectedStates {
  okCarTypes: boolean;
  okBodyTypes: boolean;
  okMakes: boolean;
  ngCarTypes: boolean;
  ngBodyTypes: boolean;
  ngMakes: boolean;
}

interface SelectAllStoreState {
  selectedStates: SelectedStates; // The state object
  setSelecteAllAction: (newState: Partial<SelectedStates>) => void; // The action for updating selectedStates
}

// Initialize the state with types
const initialState: Pick<SelectAllStoreState, 'selectedStates'> = {
  selectedStates: {
    okCarTypes: false,
    okBodyTypes: false,
    okMakes: false,
    ngCarTypes: false,
    ngBodyTypes: false,
    ngMakes: false,
  },
};

// Create the store with TypeScript support
export const useSelectAllStore = create<SelectAllStoreState>((set) => ({
  ...initialState,
  setSelecteAllAction: (newState) =>
    set((state) => ({
      selectedStates: {
        ...state.selectedStates,
        ...newState, // Merges the new state with the existing state
      },
    })),
}));
