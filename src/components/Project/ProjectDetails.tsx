import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  GET_PROJECT,
  DELETE_PROJECT,
  GET_FINISHES,
  GET_LUMBERS,
  GET_PROJECTS,
  UPDATE_PROJECT,
} from '../../graphql/operations';
import {
  calculateTotalBoardFootage,
  VARA_TO_INCHES,
  type CreateProjectInput,
  type Project,
} from '../../types/project';
import { useCurrency } from '../../utils/currency';
import { ConfirmDialog } from '../General';
import { ProjectForm } from './ProjectForm';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const formatCurrency = useCurrency();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const {
    data: projectData,
    loading,
    error: projectError,
  } = useQuery(GET_PROJECT, {
    variables: { id: id || '' },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      navigate('/projects');
    },
  });

  const [updateProjectMutation] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECT, variables: { id: id || '' } }],
  });

  const { data: finishesData } = useQuery(GET_FINISHES);
  const { data: lumberData } = useQuery(GET_LUMBERS);

  const activeFinishes = useMemo(() => {
    return (finishesData?.finishes || []).filter((finish: any) => !finish.isDeleted);
  }, [finishesData]);

  const activeLumber = useMemo(() => {
    return (lumberData?.lumbers || []).filter((lumber: any) => !lumber.isDeleted);
  }, [lumberData]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (projectError || !projectData?.project) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')} sx={{ mb: 3 }}>
          Back to Projects
        </Button>
        <Typography variant="h4" color="text.secondary">
          {projectError ? `Error: ${projectError.message}` : 'Project not found'}
        </Typography>
      </Box>
    );
  }

  const project = projectData.project;
  const boards = project?.boards || [];
  const finishes = project?.finishes || [];

  const calculateProjectCost = () => {
    const materialCost = boards.reduce((total, board) => {
      const lumber = board.lumber;
      if (!lumber) return total;

      const lengthInInches = board.length * VARA_TO_INCHES;
      const boardFeet = (board.width * board.thickness * lengthInInches) / 144;
      const totalBF = boardFeet * board.quantity;
      const cost = totalBF * lumber.costPerBoardFoot;

      return total + cost;
    }, 0);

    const finishCost = finishes.reduce((total, finish) => {
      return total + (finish?.price || 0);
    }, 0);

    return {
      materialCost,
      finishCost,
      totalCost: materialCost + finishCost + (project?.laborCost || 0) + (project?.miscCost || 0),
    };
  };

  const { materialCost, finishCost, totalCost } = calculateProjectCost();
  const totalBoardFootage = calculateTotalBoardFootage(project?.boards || []);

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject({ variables: { id: project.id } });
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      setDeleteConfirmOpen(false);
    }
  };

  const handleFormSubmit = async (projectData: CreateProjectInput) => {
    try {
      if (editingProject) {
        await updateProjectMutation({
          variables: {
            id: editingProject.id,
            input: projectData,
          },
        });
      }
      handleFormClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  const handleEdit = () => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setEditingProject(null);
    setFormOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')} sx={{ mb: 3 }}>
          Back to Projects
        </Button>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.5rem', lg: '3rem' },
              }}
            >
              {project.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem', lg: '1.125rem' },
                mt: 1,
              }}
            >
              {project.description}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={handleEdit}
              sx={{
                color: 'primary.main',
                bgcolor: 'rgba(99, 91, 255, 0.08)',
                '&:hover': {
                  bgcolor: 'rgba(99, 91, 255, 0.15)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={handleDelete}
              sx={{
                color: 'error.main',
                bgcolor: 'rgba(223, 27, 65, 0.08)',
                '&:hover': {
                  bgcolor: 'rgba(223, 27, 65, 0.15)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Cost Summary Card */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Project Summary
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Total Board Feet
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {totalBoardFootage.toFixed(2)} BF
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Board Types
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {project.boards.length}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Total Cost
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(totalCost)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Board Details */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Materials ({totalBoardFootage.toFixed(2)} BF total)
          </Typography>
          <Stack spacing={2}>
            {project.boards.map((board: any, idx: number) => {
              const lumber = board.lumber;
              const lengthInInches = board.length * VARA_TO_INCHES;
              const boardFeet = (board.width * board.thickness * lengthInInches) / 144;
              const totalBF = boardFeet * board.quantity;
              const cost = lumber ? totalBF * lumber.costPerBoardFoot : 0;

              return (
                <Paper
                  key={idx}
                  sx={{
                    p: 2.5,
                    bgcolor: 'rgba(99, 91, 255, 0.03)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
                        >
                          {lumber?.name || 'Unknown Wood'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {board.width}" × {board.thickness}" × {board.length} varas (
                          {(lengthInInches / 12).toFixed(2)}')
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {board.quantity} boards
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          Board Feet
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {totalBF.toFixed(2)} BF
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <Box>
                      <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Cost per BF
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {lumber ? formatCurrency(lumber.costPerBoardFoot) : 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Janka Rating
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {lumber?.jankaRating?.toLocaleString() || 'N/A'} lbf
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            Material Cost
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: 'success.main' }}
                          >
                            {formatCurrency(cost)}
                          </Typography>
                        </Box>
                      </Stack>

                      {lumber && lumber?.tags?.length > 0 && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            Good for:
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {lumber.tags.map((tag: string, tagIdx: number) => (
                              <Chip
                                key={tagIdx}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: 'background.default',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Finishes */}
      {project.finishes && project.finishes.length > 0 && (
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Finishes
            </Typography>
            <Stack spacing={2}>
              {project.finishes.map((finish: any) => {
                if (!finish) return null;

                return (
                  <Paper
                    key={finish.id}
                    sx={{
                      p: 2.5,
                      bgcolor: 'rgba(0, 217, 36, 0.03)',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {finish.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {finish.description}
                        </Typography>
                        {finish.tags && finish.tags.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {finish.tags.map((tag: string, idx: number) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: 'background.default',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {formatCurrency(finish.price)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Cost Breakdown */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Cost Breakdown
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" color="text.secondary">
                Materials
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(materialCost)}
              </Typography>
            </Box>
            {finishCost > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="text.secondary">
                  Finishes
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(finishCost)}
                </Typography>
              </Box>
            )}
            {project.laborCost > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="text.secondary">
                  Labor
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(project.laborCost)}
                </Typography>
              </Box>
            )}
            {project.miscCost > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="text.secondary">
                  Miscellaneous
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(project.miscCost)}
                </Typography>
              </Box>
            )}
            {project.additionalNotes && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  Notes:
                </Typography>
                <Typography variant="body2">{project.additionalNotes}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'rgba(0, 217, 36, 0.08)',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Total Cost
              </Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {formatCurrency(totalCost)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <ProjectForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingProject={editingProject}
        lumberOptions={activeLumber}
        finishOptions={activeFinishes}
      />
    </Box>
  );
}
