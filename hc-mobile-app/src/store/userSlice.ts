import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  phone: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
