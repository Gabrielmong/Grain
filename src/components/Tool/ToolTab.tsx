import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  GET_TOOLS,
  CREATE_TOOL,
  UPDATE_TOOL,
  DELETE_TOOL,
  RESTORE_TOOL,
} from '../../graphql/operations';
import { ToolForm } from './ToolForm';
import { ToolList } from './ToolList';
import { ToolTable } from './ToolTable';
import { ConfirmDialog, ViewLayout } from '../General';
import type { Tool, CreateToolInput } from '../../types/tool';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '../../hooks/useQueryParams';

export function ToolTab() {
  const { t } = useTranslation();
  const { getParam, removeParam } = useQueryParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_TOOLS, {
    variables: { includeDeleted: showDeleted },
  });

  const [createTool] = useMutation(CREATE_TOOL, {
    refetchQueries: [{ query: GET_TOOLS, variables: { includeDeleted: showDeleted } }],
  });

  const [updateToolMutation] = useMutation(UPDATE_TOOL, {
    refetchQueries: [{ query: GET_TOOLS, variables: { includeDeleted: showDeleted } }],
  });

  const [deleteTool] = useMutation(DELETE_TOOL, {
    refetchQueries: [{ query: GET_TOOLS, variables: { includeDeleted: showDeleted } }],
  });

  const [restoreToolMutation] = useMutation(RESTORE_TOOL, {
    refetchQueries: [{ query: GET_TOOLS, variables: { includeDeleted: showDeleted } }],
  });

  const allTools = data?.tools || [];
  const activeTools = allTools.filter((item: Tool) => !item.isDeleted);
  const deletedTools = allTools.filter((item: Tool) => item.isDeleted);
  const displayedTools = showDeleted ? allTools : activeTools;

  // Check for query param to auto-open form
  useEffect(() => {
    const action = getParam('action');
    if (action === 'new') {
      setEditingTool(null);
      setFormOpen(true);
      removeParam('action');
    }
  }, [getParam, removeParam]);

  const handleAddClick = () => {
    setEditingTool(null);
    setFormOpen(true);
  };

  const handleEditClick = (tool: Tool) => {
    setEditingTool(tool);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTool(null);
  };

  const handleFormSubmit = async (toolData: CreateToolInput) => {
    try {
      if (editingTool) {
        await updateToolMutation({
          variables: {
            id: editingTool.id,
            input: toolData,
          },
        });
      } else {
        await createTool({
          variables: {
            input: toolData,
          },
        });
      }
      handleFormClose();
    } catch (error) {
      console.error('Error saving tool:', error);
    }
  };

  const handleDelete = (id: string) => {
    setToolToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toolToDelete) return;

    try {
      await deleteTool({ variables: { id: toolToDelete } });
      setDeleteConfirmOpen(false);
      setToolToDelete(null);
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setToolToDelete(null);
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreToolMutation({ variables: { id } });
    } catch (error) {
      console.error('Error restoring tool:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading tools: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <>
      <ViewLayout
        title={t('tools.title')}
        subtitle={t('tools.subtitle')}
        onAddClick={handleAddClick}
        addButtonText={t('tools.add')}
        emptyTitle={t('tools.emptyTitle')}
        emptySubtitle={t('tools.emptySubtitle')}
        isEmpty={activeTools.length === 0 && !showDeleted}
        showDeleted={showDeleted}
        onShowDeletedChange={setShowDeleted}
        deletedCount={deletedTools.length}
        cardView={
          <ToolList
            tools={displayedTools}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        }
        tableView={
          <ToolTable
            tools={displayedTools}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        }
      />

      <ToolForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingTool={editingTool}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title={t('common.delete')}
        message={t('tools.deleteConfirmMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        severity="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
