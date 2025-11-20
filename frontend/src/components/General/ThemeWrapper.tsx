import { useMemo, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { getTheme } from '../../theme/theme';
import { LanguageSync } from './LanguageSync';

interface ThemeWrapperProps {
  children: ReactNode;
}

const globalStyles = (
  <GlobalStyles
    styles={{
      // Custom scrollbar styles for all scrollable elements
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        // 1A3A5C
        backgroundColor: 'rgba(26, 58, 92, 0.2)',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'rgba(26, 58, 92, 0.3)',
        },
      },
      // Firefox scrollbar styles
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(26, 58, 92, 0.2) transparent',
      },
    }}
  />
);

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const themeMode = useAppSelector((state) => state.settings.themeMode);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <LanguageSync />
      {children}
    </ThemeProvider>
  );
}
