import { create } from 'zustand';

type State = {
  tabKey: string;
};
type Action = {
  setTabKeyAction: (tabKey: string) => void;
};
const initialState: State = {
  tabKey: '1'
};

export const useTabStore = create<State & Action>((set) => ({
  ...initialState,
  setTabKeyAction: (tabKey: string) => set({ tabKey: tabKey })
}));
