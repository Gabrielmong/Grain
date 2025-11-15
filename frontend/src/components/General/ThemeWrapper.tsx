import { useMemo, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { getTheme } from '../../theme/theme';
import { LanguageSync } from './LanguageSync';

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const themeMode = useAppSelector((state) => state.settings.themeMode);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageSync />
      {children}
    </ThemeProvider>
  );
}
