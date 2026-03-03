import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import type { Customer } from '../../types/customer';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete, onRestore }: CustomerListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (customers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">{t('customers.noCustomers')}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {customers.map((customer) => (
        <Grid key={customer.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              opacity: customer.isDeleted ? 0.6 : 1,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' },
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                      onClick={() => navigate(`/app/customers/${customer.id}`)}
                    >
                      {customer.name}
                    </Typography>
                    {customer.isDeleted && (
                      <Chip
                        label={t('common.deleted')}
                        size="small"
                        color="error"
                        sx={{ height: 18, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  {customer.isDeleted ? (
                    <Tooltip title={t('common.restore')}>
                      <IconButton size="small" onClick={() => onRestore(customer.id)}>
                        <RestoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => onEdit(customer)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(customer.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </Stack>

              <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                {customer.email && (
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {customer.email}
                    </Typography>
                  </Stack>
                )}
                {customer.phone && (
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Stack>
                )}
                {customer.projects && customer.projects.length > 0 && (
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <FolderIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {customer.projects.length} {t('customers.projects')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
