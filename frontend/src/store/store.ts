import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './authSlice';
import settingsReducer from './settings/settingsSlice';
import toolReducer from './tool/toolSlice';

// Create a simple localStorage wrapper
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
  },
};

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  tool: toolReducer,
});

const persistConfig = {
  key: 'lumber-calculator',
  storage,
  whitelist: ['settings'], // Only persist settings locally, auth handled separately
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
