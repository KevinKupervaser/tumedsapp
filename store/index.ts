import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./slices/authSlice"; // Para la autenticación del usuario
import themeReducer from "./slices/themeSlice"; // Para el tema (claro/oscuro) de la app

// --- Configuración de Redux Persist ---
const persistConfig = {
  // 'key' es la llave que se usará para guardar el estado en el AsyncStorage.
  key: "root",
  // 'storage' indica dónde se guardará el estado. Aquí es el almacenamiento asíncrono.
  storage: AsyncStorage,
  // 'whitelist' es una lista de los 'slices' (rebanadas) que QUEREMOS guardar.
  whitelist: ["auth", "theme"],
};
// ----------------------------------------

// --- Combinación de Reducers ---
// combineReducers junta todos nuestros 'reducers' individuales en un único 'rootReducer'.
// La estructura del estado de Redux será: { auth: authState, theme: themeState }
const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});
// ----------------------------------------

// --- Aplicación de Persistencia ---
// persistReducer toma la configuración de persistencia y el rootReducer,
// y devuelve un nuevo reducer que maneja la persistencia.
const persistedReducer = persistReducer(persistConfig, rootReducer);
// ----------------------------------------

// --- Creación del Store de Redux ---
// configureStore es la función principal de Redux Toolkit para crear el store.
export const store = configureStore({
  // El 'reducer' principal es ahora el 'persistedReducer'.
  reducer: persistedReducer,
  // El 'middleware' es código que se ejecuta entre que se despacha una acción y
  // antes de que llegue al reducer.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck previene errores en la consola si detecta cosas
      // no serializables (como funciones o promesas) en el estado o las acciones.
      serializableCheck: {
        // Redux Persist despacha acciones que INTENCIONALMENTE no son serializables
        // (por ejemplo, 'persist/PERSIST' y 'persist/REHYDRATE'),
        // por eso, las ignoramos explícitamente para evitar los warnings/errores.
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
// ----------------------------------------

// --- Persistor ---
// persistStore crea el 'persistor', que es necesario para envolver nuestra aplicación
// y asegurarse de que el estado se cargue (rehidrate) desde el almacenamiento
// antes de que la app se muestre.
export const persistor = persistStore(store);
// ----------------------------------------

// --- Tipado (para TypeScript) ---
// Definimos el tipo del estado completo ('RootState') para que TypeScript
// sepa la estructura exacta de nuestro store, mejorando la seguridad del código.
export type RootState = ReturnType<typeof store.getState>;
// Definimos el tipo del 'dispatch' ('AppDispatch') para usarlo en los 'hooks' de Redux,
// como el 'useDispatch' personalizado, lo que asegura que las acciones despachadas
// tengan el tipo correcto.
export type AppDispatch = typeof store.dispatch;