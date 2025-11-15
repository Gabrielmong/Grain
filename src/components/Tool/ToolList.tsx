import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Stack,
  Grid,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import BuildIcon from '@mui/icons-material/Build';
import type { Tool } from '../../types/tool';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../utils/currency';

const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface ToolListProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export function ToolList({ tools, onEdit, onDelete, onRestore }: ToolListProps) {
  const { t } = useTranslation();
  const formatCurrency = useCurrency();

  return (
    <Grid container spacing={3}>
      {tools.map((tool) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tool.id}>
          <Card
            sx={{
              opacity: tool.isDeleted ? 0.6 : 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack spacing={2}>
                {/* Header with Image/Icon */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {tool.imageData ? (
                    <Avatar
                      src={tool.imageData}
                      variant="rounded"
                      sx={{
                        width: 64,
                        height: 64,
                        border: '2px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ) : (
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <BuildIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          wordBreak: 'break-word',
                        }}
                      >
                        {tool.name}
                      </Typography>
                      {tool.isDeleted && (
                        <Chip label={t('lumber.deleted')} size="small" color="error" sx={{ height: 24, flexShrink: 0 }} />
                      )}
                    </Stack>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      sx={{ fontWeight: 600, mt: 0.5 }}
                    >
                      {formatCurrency(tool.price)}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {truncateText(tool.description)}
                </Typography>

                {/* Function */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                  >
                    {t('tools.function')}:
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {tool.function}
                  </Typography>
                </Box>

                {/* Serial Number */}
                {tool.serialNumber && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                    >
                      {t('tools.serialNumber')}:
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontFamily: 'monospace' }}>
                      {tool.serialNumber}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
              {!tool.isDeleted ? (
                <>
                  <IconButton
                    onClick={() => onEdit(tool)}
                    aria-label="edit"
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'rgba(99, 91, 255, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(99, 91, 255, 0.15)',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(tool.id)}
                    aria-label="delete"
                    sx={{
                      color: 'error.main',
                      bgcolor: 'rgba(223, 27, 65, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(223, 27, 65, 0.15)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={() => onRestore(tool.id)}
                  aria-label="restore"
                  sx={{
                    color: 'success.main',
                    bgcolor: 'rgba(0, 217, 36, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 217, 36, 0.15)',
                    },
                  }}
                >
                  <RestoreIcon fontSize="small" />
                </IconButton>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
