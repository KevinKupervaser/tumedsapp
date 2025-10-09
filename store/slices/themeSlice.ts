import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "system" | "light" | "dark";
// ----------------------------------------

// --- Definición del Estado (Typescript) ---
// La 'ThemeState' describe cómo se verá el estado de este slice.
interface ThemeState {
  mode: ThemeMode; // Almacena el modo de tema actual.
}
// ----------------------------------------

// --- Estado Inicial ---
const initialState: ThemeState = {
  mode: "system", // El valor por defecto es 'system' (usar la configuración del sistema operativo).
};
// ----------------------------------------

// --- Creación del Slice ---
const themeSlice = createSlice({
  // 'name' es 'theme' (las acciones se verán como 'theme/setThemeMode').
  name: "theme",
  initialState,
  reducers: {
    // 1. Acción 'setThemeMode': Recibe un nuevo modo de tema (PayloadAction<ThemeMode>).
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      // El nuevo valor del modo de tema es el que viene en el 'payload' (la carga útil) de la acción.
      state.mode = action.payload;
    },
  },
});
// ----------------------------------------

// --- Exportaciones ---
// Exportamos la 'action' generada automáticamente.
export const { setThemeMode } = themeSlice.actions;
// Exportamos el 'reducer' para incluirlo en la store principal (rootReducer).
export default themeSlice.reducer;
