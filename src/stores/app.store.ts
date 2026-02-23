import { create } from 'zustand';

// Define the store state interface
interface AppState {
  formTabIndex: boolean;
  matchingCondtionTabIndex: boolean;
  editRegisterFormStatus: boolean | null;
  editRegisterId: string | null;
  checkSelectAllState: boolean;
  mainTabIndex: boolean | null;
  isTabPage: boolean;
  checkFetch: boolean;
  setFormTabIndex: (formTabIndex: boolean) => void;
  setIsTabPageAction: (isTabPage: boolean) => void;
  setMainTabIndex: (mainTabIndex: boolean | null) => void;
  setMatchingConditonTabIndex: (matchingCondtionTabIndex: boolean) => void;
  setSelectAllAction: (checkSelectAll: boolean) => void;
  setEditRegisterFormStatus: (editRegisterFormStatus: boolean | null) => void;
  setEditRegisterId: (editRegisterId: string | null) => void;
  setCheckFetch: (checkFetch: boolean) => void;
  editExistingFile: boolean; // Added new state property
  setEditExistingFile: (editExistingFile: boolean) => void; // Added setter for new state
  fetchShopType: any;
  setFetchShopType: (fetchShopType: any) => void;
}

// Define the initial state
const initialState: AppState = {
  formTabIndex: false,
  matchingCondtionTabIndex: false,
  editRegisterFormStatus: null,
  editRegisterId: null,
  checkSelectAllState: false,
  mainTabIndex: null,
  isTabPage: false,
  checkFetch: false,
  setFormTabIndex: () => {},
  setIsTabPageAction: () => {},
  setMainTabIndex: () => {},
  setMatchingConditonTabIndex: () => {},
  setSelectAllAction: () => {},
  setEditRegisterFormStatus: () => {},
  setEditRegisterId: () => {},
  setCheckFetch: () => {},
  editExistingFile: false, // Initialized new state property
  setEditExistingFile: () => {}, // Placeholder for setter
  fetchShopType: '',
  setFetchShopType: () => {}
};

// Create the store with Zustand
export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setFormTabIndex: (formTabIndex) => set({ formTabIndex }),
  setIsTabPageAction: (isTabPage) => set({ isTabPage }),
  setMainTabIndex: (mainTabIndex) => set({ mainTabIndex }),
  setMatchingConditonTabIndex: (matchingCondtionTabIndex) => set({ matchingCondtionTabIndex }),
  setSelectAllAction: (checkSelectAll) => set({ checkSelectAllState: checkSelectAll }),
  setEditRegisterFormStatus: (editRegisterFormStatus) => set({ editRegisterFormStatus }),
  setEditRegisterId: (editRegisterId) => set({ editRegisterId }),
  setCheckFetch: (checkFetch) => set({ checkFetch }),
  setEditExistingFile: (editExistingFile) => set({ editExistingFile }), // Implemented setter
  setFetchShopType: (fetchShopType) => set({ fetchShopType })
}));
