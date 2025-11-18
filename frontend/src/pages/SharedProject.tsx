import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { GET_SHARED_PROJECT } from '../graphql/operations';
import type { SharedProject } from '../types/project';
import { CURRENCY_SYMBOLS } from '../types';
import { LanguageSelector } from '../components/General';

export default function SharedProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, loading, error } = useQuery(GET_SHARED_PROJECT, {
    variables: { id },
    skip: !id,
  });

  const project: SharedProject | undefined = data?.sharedProject;

  const currencySymbol = project
    ? CURRENCY_SYMBOLS[project.currency as keyof typeof CURRENCY_SYMBOLS] || CURRENCY_SYMBOLS.USD
    : CURRENCY_SYMBOLS.USD;

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {t('app.title')}
            </Typography>
            <LanguageSelector />
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ ml: 1 }}
            >
              {t('shared.goToApp')}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="error">{t('shared.projectNotFound')}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {t('app.title')}
          </Typography>
          <LanguageSelector />
          <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ ml: 1 }}>
            {t('shared.goToApp')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Project Header */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                {project.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {project.description}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={<PersonIcon />}
                label={`${t('shared.createdBy')}: ${project.createdBy}`}
                variant="outlined"
              />
              <Chip
                icon={<CalendarTodayIcon />}
                label={`${t('shared.createdOn')}: ${formatDate(project.createdAt)}`}
                variant="outlined"
              />
            </Box>
          </Stack>
        </Paper>

        {/* Cost Summary */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  {t('shared.materialCost')}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(project.materialCost)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  {t('shared.finishCost')}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(project.finishCost)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  {t('shared.laborCost')}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(project.laborCost)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  variant="body2"
                  sx={{ color: 'primary.contrastText', opacity: 0.9 }}
                >
                  {t('shared.totalCost')}
                </Typography>
                <Typography variant="h5" fontWeight={600} sx={{ color: 'primary.contrastText' }}>
                  {formatCurrency(project.totalCost)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Materials Breakdown */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {t('shared.materials')}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('shared.totalBoardFeet')}: {project.totalBoardFeet.toFixed(2)} BF
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('shared.lumber')}</TableCell>
                  <TableCell align="right">{t('shared.width')}</TableCell>
                  <TableCell align="right">{t('shared.thickness')}</TableCell>
                  <TableCell align="right">{t('shared.length')}</TableCell>
                  <TableCell align="right">{t('shared.quantity')}</TableCell>
                  <TableCell align="right">{t('shared.boardFeet')}</TableCell>
                  <TableCell align="right">{t('shared.cost')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project.boards.map((board) => (
                  <TableRow key={board.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {board.lumber?.name}
                        </Typography>
                        {board.lumber?.description && (
                          <Typography variant="caption" color="text.secondary">
                            {board.lumber.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{board.width}"</TableCell>
                    <TableCell align="right">{board.thickness}"</TableCell>
                    <TableCell align="right">{board.length} varas</TableCell>
                    <TableCell align="right">{board.quantity}</TableCell>
                    <TableCell align="right">{board.boardFeet.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(board.boardFeet * (board.lumber?.costPerBoardFoot || 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Finishes */}
        {project.finishes && project.finishes.length > 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {t('shared.finishes')}
            </Typography>
            <Grid container spacing={2}>
              {project.finishes.map((finish) => (
                <Grid size={12} key={finish.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        alignItems="flex-start"
                      >
                        {finish.imageData && (
                          <Box
                            component="img"
                            src={finish.imageData}
                            alt={finish.name}
                            sx={{
                              width: { xs: '100%', sm: 200 },
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {finish.name}
                          </Typography>
                          {finish.description && (
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {finish.description}
                            </Typography>
                          )}
                          <Typography variant="h6" color="primary">
                            {formatCurrency(finish.price)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Additional Notes */}
        {project.additionalNotes && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {t('shared.additionalNotes')}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {project.additionalNotes}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
