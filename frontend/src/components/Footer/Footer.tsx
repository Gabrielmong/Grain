import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        py: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} {t('app.title')}. {t('landing.footer.rights')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            component="a"
            href="https://gabrielmong.github.io/gandalfio/#/contact"
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            align="center"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1,
                textDecoration: 'underline',
              },
            }}
          >
            {t('app.contactDeveloper')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
