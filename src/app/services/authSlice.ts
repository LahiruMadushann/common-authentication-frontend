import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId') || null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = authSlice.actions;
export default authSlice.reducer;
