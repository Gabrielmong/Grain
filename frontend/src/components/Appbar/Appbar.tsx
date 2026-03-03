import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { LanguageSelector } from '../General';

export const Appbar = ({ showSignInUp = true }: { showSignInUp?: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <MuiAppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('app.title')}
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate('/feed')}
          sx={{ textTransform: 'none', borderRadius: 2, px: 2, mr: 1 }}
        >
          {t('nav.feed')}
        </Button>
        <LanguageSelector />
        {isAuthenticated ? (
          <Button
            variant="outlined"
            onClick={() => navigate('/app')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              ml: 1,
            }}
          >
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.75rem' }}
                  src={user.imageData || undefined}
                >
                  {!user.imageData && user.firstName?.charAt(0).toUpperCase()}
                </Avatar>
                {t('landing.goToApp')}
              </Box>
            )}
          </Button>
        ) : (
          showSignInUp && (
            <Stack direction="row" spacing={2} sx={{ ml: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                }}
              >
                {t('landing.signIn')}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {t('landing.signUp')}
              </Button>
            </Stack>
          )
        )}

        {!showSignInUp && (
          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              ml: 1,
            }}
          >
            {t('app.backToHome')}
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};
