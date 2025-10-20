import { User } from "@shared/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  profilePicture: string | null;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  profilePicture: null,
  isGuest: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
    },
    loginAsGuest: (state) => {
      state.user = {
        email: "invitado@guest.com",
        token: "guest-token-" + Date.now(),
      };
      state.isAuthenticated = true;
      state.isGuest = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profilePicture = null;
      state.isGuest = false;
    },
    setProfilePicture: (state, action: PayloadAction<string | null>) => {
      state.profilePicture = action.payload;
    },
  },
});

export const { login, loginAsGuest, logout, setProfilePicture } =
  authSlice.actions;
export default authSlice.reducer;
