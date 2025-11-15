import { createTheme, type PaletteMode } from '@mui/material/styles';

// Create theme with dynamic mode
export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#635BFF', // Stripe purple
      light: '#7A73FF',
      dark: '#4D47CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0A2540', // Stripe dark blue
      light: '#1A3A5C',
      dark: '#051729',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00D924',
      light: '#33E052',
      dark: '#00A81C',
    },
    error: {
      main: '#DF1B41',
      light: '#E54867',
      dark: '#B21534',
    },
    warning: {
      main: '#FF6E3A',
      light: '#FF8B61',
      dark: '#CC582E',
    },
    background: {
      default: mode === 'light' ? '#F6F9FC' : '#0A1929',
      paper: mode === 'light' ? '#FFFFFF' : '#132F4C',
    },
    text: {
      primary: mode === 'light' ? '#0A2540' : '#E3E8EE',
      secondary: mode === 'light' ? '#425466' : '#8B9DAF',
    },
    divider: mode === 'light' ? '#E3E8EE' : '#1E3A52',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 4px 6px rgba(50, 50, 93, 0.11), 0px 1px 3px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(50, 50, 93, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.08)',
    '0px 13px 27px rgba(50, 50, 93, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 16px 32px rgba(50, 50, 93, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 20px 40px rgba(50, 50, 93, 0.1), 0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 24px 48px rgba(50, 50, 93, 0.1), 0px 16px 32px rgba(0, 0, 0, 0.08)',
    '0px 30px 60px rgba(50, 50, 93, 0.1), 0px 18px 36px rgba(0, 0, 0, 0.08)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
    '0px 1px 3px rgba(50, 50, 93, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(50, 50, 93, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(50, 50, 93, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 6px rgba(50, 50, 93, 0.11), 0px 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(50, 50, 93, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#635BFF',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          minHeight: 56,
          '&.Mui-selected': {
            color: '#635BFF',
          },
        },
      },
    },
  },
});
