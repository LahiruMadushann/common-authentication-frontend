import { create } from 'zustand';

interface BuyerStoreState {
  clearImage: boolean;
  setClearImage: (clearImage: boolean) => void;
  results: { id: string | null; week: string | null; day: string }[] | undefined;
  setResult: (results: { id: string | null; week: string | null; day: string }[]) => void;
  storeTypeDisable: boolean;
  setStroeTypeDisbale: (storeTypeDisable: boolean) => void;
  headBranchId: number | string | null;
  setHeadBranchId: (headBranchId: number | string | null) => void;
  firstRegister: boolean;
  setFirstRegister: (storeTypeDisable: boolean) => void;
}

const initialState: Omit<
  BuyerStoreState,
  'setClearImage' | 'setResult' | 'setStroeTypeDisbale' | 'setHeadBranchId' | 'setFirstRegister'
> = {
  clearImage: false,
  results: undefined,
  storeTypeDisable: false,
  headBranchId: null,
  firstRegister: false
};

export const useBuyerStore = create<BuyerStoreState>((set) => ({
  ...initialState,
  setClearImage: (clearImage) => set(() => ({ clearImage })),
  setResult: (results) => set(() => ({ results })),
  setStroeTypeDisbale: (storeTypeDisable) => set(() => ({ storeTypeDisable })),
  setHeadBranchId: (headBranchId) => set(() => ({ headBranchId })),
  setFirstRegister: (firstRegister) => set(() => ({ firstRegister }))
}));
