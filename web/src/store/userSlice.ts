import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./userTypes";

const savedUser = localStorage.getItem("user");

interface UserState {
  userInfo: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userInfo: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
