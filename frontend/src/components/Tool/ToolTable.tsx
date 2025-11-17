import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { IconButton, Avatar, Box, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import BuildIcon from '@mui/icons-material/Build';
import type { Tool } from '../../types/tool';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../utils/currency';

interface ToolTableProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export function ToolTable({ tools, onEdit, onDelete, onRestore }: ToolTableProps) {
  const { t } = useTranslation();
  const formatCurrency = useCurrency();

  const columns: GridColDef<Tool>[] = [
    {
      field: 'imageData',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.value ? (
            <Avatar
              src={params.value}
              variant="rounded"
              sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }}
            />
          ) : (
            <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              <BuildIcon fontSize="small" />
            </Avatar>
          )}
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: t('tools.name'),
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'description',
      headerName: t('tools.description'),
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'function',
      headerName: t('tools.function'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'price',
      headerName: t('tools.price'),
      width: 120,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'serialNumber',
      headerName: t('tools.serialNumber'),
      width: 150,
      renderCell: (params) => (
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{params.value || '-'}</Box>
      ),
    },
    {
      field: 'isDeleted',
      headerName: 'Status',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <Chip label={t('lumber.deleted')} size="small" color="error" />
        ) : (
          <Chip label={t('lumber.active')} size="small" color="success" />
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!params.row.isDeleted ? (
            <>
              <IconButton onClick={() => onEdit(params.row)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => onDelete(params.row.id)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => onRestore(params.row.id)} size="small">
              <RestoreIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={tools}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderColor: 'divider',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'background.default',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-footerContainer': {
            borderColor: 'divider',
          },
        }}
      />
    </Box>
  );
}
