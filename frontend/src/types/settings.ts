export type Currency = 'CRC' | 'USD';
export type Language = 'en' | 'es' | 'pt';
export type ThemeMode = 'light' | 'dark';

export interface Settings {
  currency: Currency;
  language: Language;
  themeMode: ThemeMode;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CRC: '₡',
  USD: '$',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  CRC: 'Costa Rican Colón',
  USD: 'US Dollar',
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};
