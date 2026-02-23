import { create } from 'zustand';

type State = {
  singleAprisial: any;
};
type Action = {
  setSingleAprisialAction: (singleAprisial: any) => void;
};
const initialState: State = {
  singleAprisial: '1'
};

export const useApprisialStore = create<State & Action>((set) => ({
  ...initialState,
  setSingleAprisialAction: (singleAprisial: any) => set({ singleAprisial: singleAprisial })
}));
