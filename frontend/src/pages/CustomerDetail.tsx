import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import NoteIcon from '@mui/icons-material/Note';
import { GET_CUSTOMER, UPDATE_CUSTOMER, GET_CUSTOMERS } from '../graphql/operations';
import type { Customer, CreateCustomerInput } from '../types/customer';
import { CustomerForm } from '../components/Customer/CustomerForm';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_CUSTOMER, {
    variables: { id },
    skip: !id,
  });

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: [
      { query: GET_CUSTOMER, variables: { id } },
      { query: GET_CUSTOMERS, variables: { includeDeleted: false } },
    ],
  });

  const customer: Customer | undefined = data?.customer;

  const handleSubmit = async (input: CreateCustomerInput) => {
    try {
      await updateCustomer({ variables: { id, input } });
      setFormOpen(false);
    } catch (err) {
      console.error('Error updating customer:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error?.message || t('customers.notFound')}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/app/customers')}
        sx={{ mb: 3 }}
      >
        {t('customers.backToCustomers')}
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {customer.name}
          </Typography>
          {customer.isDeleted && (
            <Chip label={t('common.deleted')} color="error" size="small" sx={{ mt: 1 }} />
          )}
        </Box>
        {!customer.isDeleted && (
          <IconButton onClick={() => setFormOpen(true)} color="primary">
            <EditIcon />
          </IconButton>
        )}
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                {t('customers.contactInfo')}
              </Typography>
              <Stack spacing={1.5}>
                {customer.email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{customer.email}</Typography>
                  </Stack>
                )}
                {customer.phone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2">{customer.phone}</Typography>
                  </Stack>
                )}
                {!customer.email && !customer.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {t('customers.noContactInfo')}
                  </Typography>
                )}
              </Stack>

              {customer.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <NoteIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.25 }} />
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {customer.notes}
                    </Typography>
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                {t('customers.linkedProjects')} ({customer.projects?.length || 0})
              </Typography>
              {customer.projects && customer.projects.length > 0 ? (
                <Grid container spacing={2}>
                  {customer.projects.map((project) => (
                    <Grid key={project.id} size={{ xs: 12, sm: 6 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s',
                          '&:hover': { boxShadow: 2 },
                        }}
                        onClick={() => navigate(`/app/projects/${project.id}`)}
                      >
                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {project.name}
                          </Typography>
                          {project.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {project.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('customers.noLinkedProjects')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editingCustomer={customer}
      />
    </Box>
  );
}
