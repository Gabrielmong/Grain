import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Settings, Currency, Language, ThemeMode } from '../../types/settings';

const initialState: Settings = {
  currency: 'CRC',
  language: 'en',
  themeMode: 'light',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCurrency, setLanguage, setThemeMode, updateSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
