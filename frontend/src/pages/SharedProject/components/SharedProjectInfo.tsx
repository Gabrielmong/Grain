import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Paper, Stack, Box, Typography, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ProjectStatus } from '../../../types/project';
import { StatusChip } from '../../../components/Project/utils';

interface SharedProjectInfoProps {
  name: string;
  description: string;
  createdBy: string;
  username: string;
  createdAt: string;
  status: ProjectStatus;
  formatDate: (date: string) => string;
}

export function SharedProjectInfo({
  name,
  description,
  createdBy,
  username,
  createdAt,
  status,
  formatDate,
}: SharedProjectInfoProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<PersonIcon />}
            label={`${t('shared.createdBy')}: ${createdBy}`}
            variant="outlined"
            onClick={username ? () => navigate(`/u/${username}`) : undefined}
            sx={username ? { cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } } : {}}
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={`${t('shared.createdOn')}: ${formatDate(createdAt)}`}
            variant="outlined"
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <StatusChip status={status} />
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
