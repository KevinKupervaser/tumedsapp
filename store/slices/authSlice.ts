import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
// ----------------------------------------

// --- Estado Inicial ---
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};
// ----------------------------------------

// --- Creación del Slice ---
// Simplifica la creación de acciones, reducers y el estado inicial en un solo lugar.
const authSlice = createSlice({
  // 'name' es un prefijo usado para generar los tipos de acción (ej: 'auth/login').
  name: "auth",
  // Se le pasa el estado inicial que definimos.
  initialState,
  // 'reducers' son las funciones que describen cómo el estado cambia en respuesta a las acciones.
  reducers: {
    // 1. Acción 'login': Recibe la información del usuario (PayloadAction<User>).
    login: (state, action: PayloadAction<User>) => {
      // 'state' es el estado actual del slice (gracias a Immer, podemos 'mutarlo'
      // directamente, y Redux Toolkit lo convierte en un estado inmutable por detrás).
      console.log("🟢 LOGIN ACTION - Before:", {
        user: state.user,
        isAuth: state.isAuthenticated,
      }); // Log para ver el estado antes del cambio

      // Lógica de cambio de estado:
      state.user = action.payload; // Guardamos el objeto de usuario recibido en la acción.
      state.isAuthenticated = true; // Marcamos al usuario como autenticado.

      console.log("🟢 LOGIN ACTION - After:", {
        user: state.user,
        isAuth: state.isAuthenticated,
      }); // Log para ver el estado después del cambio
    },

    // 2. Acción 'logout': No necesita información adicional, solo cambia el estado.
    logout: (state) => {
      console.log("🔴 LOGOUT ACTION - Before:", {
        user: state.user,
        isAuth: state.isAuthenticated,
      }); // Log antes del cambio

      // Lógica de cambio de estado:
      state.user = null; // Borramos la información del usuario.
      state.isAuthenticated = false; // Marcamos al usuario como desautenticado.

      console.log("🔴 LOGOUT ACTION - After:", {
        user: state.user,
        isAuth: state.isAuthenticated,
      }); // Log después del cambio
    },
  },
});
// ----------------------------------------

// --- Exportaciones ---
// Exportamos las 'actions' generadas automáticamente por createSlice
// para poder despacharlas desde cualquier parte de la aplicación (ej: dispatch(login(userData))).
export const { login, logout } = authSlice.actions;
// Exportamos el 'reducer' para poder incluirlo en la store principal (rootReducer).
export default authSlice.reducer;
