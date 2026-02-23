import { create } from 'zustand';

// Define the types for the state and actions
interface MatchingConditionsState {
  emailList: any; // Define the type of emailList as an array of strings
  setEmailList: (emailList: any) => void; // Define the setter function
}

// Initialize the state with types
const initialState: Pick<MatchingConditionsState, 'emailList'> = {
  emailList: []
};

// Create the store with TypeScript support
export const useMatchingConditionsStore = create<MatchingConditionsState>((set) => ({
  ...initialState,
  setEmailList: (emailList) => set({ emailList }) // Setter with type-safe parameter
}));
