import { useAppSelector } from '../store/hooks';
import { CURRENCY_SYMBOLS, type Currency } from '../types/settings';

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toFixed(2)}`;
}

// Custom hook to format currency based on app settings
export function useCurrency() {
  const currency = useAppSelector((state) => state.settings.currency);

  return (amount: number) => formatCurrency(amount, currency);
}
