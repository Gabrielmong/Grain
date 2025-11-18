import { Container, Box, Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Appbar } from '../components';
import { useTranslation } from 'react-i18next';

export default function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Appbar showSignInUp={true} />
      <Container component="main" maxWidth="md">
        <Box sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {t('terms.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t('terms.lastUpdated')}: {new Date().toLocaleDateString()}
            </Typography>

            {/* Introduction */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.introduction.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.introduction.text')}
            </Typography>

            {/* Acceptance of Terms */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.acceptance.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.acceptance.text')}
            </Typography>

            {/* User Accounts */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.accounts.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.accounts.text')}
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>
                <Typography variant="body1">{t('terms.accounts.point1')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.accounts.point2')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.accounts.point3')}</Typography>
              </li>
            </Box>

            {/* Data Protection - Costa Rica Law 8968 */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.dataProtection.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.dataProtection.text')}
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>
                <Typography variant="body1">{t('terms.dataProtection.point1')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.dataProtection.point2')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.dataProtection.point3')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.dataProtection.point4')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.dataProtection.point5')}</Typography>
              </li>
            </Box>

            {/* Your Rights */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.rights.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.rights.text')}
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>
                <Typography variant="body1">{t('terms.rights.point1')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.rights.point2')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.rights.point3')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.rights.point4')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.rights.point5')}</Typography>
              </li>
            </Box>

            {/* Use of Service */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.useOfService.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.useOfService.text')}
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li>
                <Typography variant="body1">{t('terms.useOfService.point1')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.useOfService.point2')}</Typography>
              </li>
              <li>
                <Typography variant="body1">{t('terms.useOfService.point3')}</Typography>
              </li>
            </Box>

            {/* User Content */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.userContent.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.userContent.text')}
            </Typography>

            {/* No Sale of Data */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.noDataSale.title')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontWeight: 600, color: 'primary.main' }}>
              {t('terms.noDataSale.text')}
            </Typography>

            {/* Limitation of Liability */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.liability.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.liability.text')}
            </Typography>

            {/* Changes to Terms */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.changes.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.changes.text')}
            </Typography>

            {/* Governing Law */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.governingLaw.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.governingLaw.text')}
            </Typography>

            {/* Contact */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
              {t('terms.contact.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.contact.text')}
            </Typography>

            {/* Back Link */}
            <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
              <MuiLink component={RouterLink} to="/" variant="body2">
                {t('terms.backToHome')}
              </MuiLink>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
