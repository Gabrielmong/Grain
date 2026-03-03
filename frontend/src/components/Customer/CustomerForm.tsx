import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Autocomplete,
  Chip,
} from '@mui/material';
import { GET_PROJECTS } from '../../graphql/operations';
import type { Customer, CreateCustomerInput } from '../../types/customer';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerInput) => void;
  editingCustomer?: Customer | null;
}

export function CustomerForm({ open, onClose, onSubmit, editingCustomer }: CustomerFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { includeDeleted: false },
    skip: !open,
  });

  const projectOptions = (projectsData?.projects || []).map((p: any) => ({
    id: p.id,
    label: p.name,
  }));

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSelectedProjectIds([]);
  };

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email || '');
      setPhone(editingCustomer.phone || '');
      setNotes(editingCustomer.notes || '');
      setSelectedProjectIds(editingCustomer.projects?.map((p) => p.id) || []);
    } else {
      resetForm();
    }
  }, [editingCustomer, open]);

  const handleSubmit = () => {
    onSubmit({
      name,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      projectIds: selectedProjectIds.length > 0 ? selectedProjectIds : undefined,
    });
    resetForm();
    onClose();
  };

  const isValid = name.trim().length > 0;

  const selectedProjects = projectOptions.filter((p: any) => selectedProjectIds.includes(p.id));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0px 20px 40px rgba(50, 50, 93, 0.15), 0px 12px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ px: 4, pt: 4, pb: 2 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {editingCustomer ? t('customers.editCustomer') : t('customers.addCustomer')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 2 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label={t('customers.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={t('customers.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            type="email"
          />
          <TextField
            label={t('customers.phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <TextField
            label={t('customers.notes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Autocomplete
            multiple
            options={projectOptions}
            getOptionLabel={(option) => option.label}
            value={selectedProjects}
            onChange={(_, newValue) => setSelectedProjectIds(newValue.map((v: any) => v.id))}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.label} size="small" {...getTagProps({ index })} key={option.id} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label={t('customers.linkedProjects')} />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={!isValid}
          sx={{
            background: isValid ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' : undefined,
            px: 4,
          }}
        >
          {editingCustomer ? t('customers.updateCustomer') : t('customers.createCustomer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
