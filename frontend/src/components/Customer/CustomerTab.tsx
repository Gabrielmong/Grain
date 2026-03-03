import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  GET_CUSTOMERS,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  RESTORE_CUSTOMER,
} from '../../graphql/operations';
import type { Customer, CreateCustomerInput } from '../../types/customer';
import { ConfirmDialog, ViewLayout } from '../General';
import { CustomerList } from './CustomerList';
import { CustomerForm } from './CustomerForm';

export function CustomerTab() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('name-asc');

  const { data, loading, error } = useQuery(GET_CUSTOMERS, {
    variables: { includeDeleted: showDeleted },
  });

  const [createCustomer] = useMutation(CREATE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS, variables: { includeDeleted: showDeleted } }],
  });

  const [updateCustomerMutation] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS, variables: { includeDeleted: showDeleted } }],
  });

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS, variables: { includeDeleted: showDeleted } }],
  });

  const [restoreCustomerMutation] = useMutation(RESTORE_CUSTOMER, {
    refetchQueries: [{ query: GET_CUSTOMERS, variables: { includeDeleted: showDeleted } }],
  });

  const allCustomers: Customer[] = data?.customers || [];
  const activeCustomers = allCustomers.filter((c) => !c.isDeleted);
  const deletedCustomers = allCustomers.filter((c) => c.isDeleted);
  const displayedCustomers = showDeleted ? allCustomers : activeCustomers;

  const sortOptions = [
    { value: 'name-asc', label: t('customers.sortNameAsc') },
    { value: 'name-desc', label: t('customers.sortNameDesc') },
  ];

  const filteredAndSorted = useMemo(() => {
    let filtered = [...displayedCustomers];
    if (searchValue) {
      const q = searchValue.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
      );
    }
    const [, direction] = sortValue.split('-');
    filtered.sort((a, b) => {
      const av = a.name.toLowerCase();
      const bv = b.name.toLowerCase();
      return direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return filtered;
  }, [displayedCustomers, searchValue, sortValue]);

  const handleAddClick = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingCustomer(null);
  };

  const handleFormSubmit = async (data: CreateCustomerInput) => {
    try {
      if (editingCustomer) {
        await updateCustomerMutation({ variables: { id: editingCustomer.id, input: data } });
      } else {
        await createCustomer({ variables: { input: data } });
      }
      handleFormClose();
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleDelete = (id: string) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer({ variables: { id: customerToDelete } });
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreCustomerMutation({ variables: { id } });
    } catch (err) {
      console.error('Error restoring customer:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading customers: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <>
      <ViewLayout
        title={t('customers.title')}
        subtitle={t('customers.subtitle')}
        onAddClick={handleAddClick}
        addButtonText={t('customers.add')}
        emptyTitle={t('customers.emptyTitle')}
        emptySubtitle={t('customers.emptySubtitle')}
        isEmpty={activeCustomers.length === 0 && !showDeleted}
        showDeleted={showDeleted}
        onShowDeletedChange={setShowDeleted}
        deletedCount={deletedCustomers.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={sortOptions}
        searchPlaceholder={t('customers.searchPlaceholder')}
        cardView={
          <CustomerList
            customers={filteredAndSorted}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        }
        tableView={
          <CustomerList
            customers={filteredAndSorted}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        }
      />

      <CustomerForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingCustomer={editingCustomer}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title={t('common.delete')}
        message={t('customers.deleteConfirmMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        severity="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteConfirmOpen(false); setCustomerToDelete(null); }}
      />
    </>
  );
}
