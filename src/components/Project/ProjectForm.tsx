import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Project, CreateProjectInput, CreateBoardInput } from '../../types/project';
import type { Lumber } from '../../types/lumber';
import type { Finish } from '../../types/finish';
import BoardInput from '../Lumber/BoardInput';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: CreateProjectInput) => void;
  editingProject?: Project | null;
  lumberOptions: Lumber[];
  finishOptions: Finish[];
}

export function ProjectForm({
  open,
  onClose,
  onSubmit,
  editingProject,
  lumberOptions,
  finishOptions,
}: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [boards, setBoards] = useState<CreateBoardInput[]>([]);
  const [finishIds, setFinishIds] = useState<string[]>([]);
  const [laborCost, setLaborCost] = useState('');
  const [miscCost, setMiscCost] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setBoards([]);
    setFinishIds([]);
    setLaborCost('');
    setMiscCost('');
    setAdditionalNotes('');
  };

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description);
      const cleanBoards = editingProject.boards.map((board) => ({
        width: board.width,
        thickness: board.thickness,
        length: board.length,
        quantity: board.quantity,
        lumberId: board.lumberId,
      }));
      setBoards(cleanBoards);
      const finishIdsFromProject = editingProject?.finishes?.map((finish) => finish.id);
      setFinishIds(finishIdsFromProject || []);
      setLaborCost(editingProject.laborCost.toString());
      setMiscCost(editingProject.miscCost.toString());
      setAdditionalNotes(editingProject.additionalNotes || '');
    } else {
      resetForm();
    }
  }, [editingProject, open]);

  const handleAddBoard = () => {
    const newBoard: CreateBoardInput = {
      width: 0,
      thickness: 0,
      length: 0,
      quantity: 1,
      lumberId: lumberOptions[0]?.id || '',
    };
    setBoards([...boards, newBoard]);
  };

  const handleBoardChange = (index: number, board: CreateBoardInput) => {
    const updatedBoards = [...boards];
    updatedBoards[index] = board;
    setBoards(updatedBoards);
  };

  const handleRemoveBoard = (index: number) => {
    setBoards(boards.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const projectData: CreateProjectInput = {
      name,
      description,
      boards,
      finishIds,
      laborCost: parseFloat(laborCost) || 0,
      miscCost: parseFloat(miscCost) || 0,
      additionalNotes: additionalNotes.trim() || undefined,
    };
    onSubmit(projectData);
    resetForm();
    onClose();
  };

  const isValid =
    name.trim() &&
    description.trim() &&
    boards.length > 0 &&
    boards.every(
      (b) => b.width > 0 && b.thickness > 0 && b.length > 0 && b.quantity > 0 && b.lumberId
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0px 20px 40px rgba(50, 50, 93, 0.15), 0px 12px 24px rgba(0, 0, 0, 0.12)',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 4,
          pt: 4,
          pb: 2,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        {editingProject ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <DialogContent sx={{ px: 4, pb: 2 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Project Details */}
          <TextField
            label="Project Name"
            placeholder="e.g., Kitchen Cabinets"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Description"
            placeholder="Describe the project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            required
            variant="outlined"
          />

          <Divider />

          {/* Boards Section */}
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Boards
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddBoard}
                disabled={lumberOptions.length === 0}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(99, 91, 255, 0.08)',
                  },
                }}
              >
                Add Board
              </Button>
            </Box>

            {boards.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.default',
                }}
              >
                <Typography color="text.secondary">
                  No boards added yet. Click "Add Board" to get started.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {boards.map((board, index) => (
                  <BoardInput
                    key={index}
                    board={board}
                    index={index}
                    lumberOptions={lumberOptions}
                    onChange={handleBoardChange}
                    onRemove={handleRemoveBoard}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Divider />

          {/* Finishes Section */}
          <FormControl fullWidth>
            <InputLabel>Finishes (optional)</InputLabel>
            <Select
              multiple
              value={finishIds}
              onChange={(e) =>
                setFinishIds(
                  typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                )
              }
              input={<OutlinedInput label="Finishes (optional)" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const finish = finishOptions.find((f) => f.id === id);
                    return (
                      <Chip
                        key={id}
                        label={finish?.name || id}
                        size="small"
                        sx={{ bgcolor: 'background.default' }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {finishOptions.map((finish) => (
                <MenuItem key={finish.id} value={finish.id}>
                  {finish.name} - ₡{finish.price.toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          {/* Costs Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Additional Costs
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Labor Cost (₡)"
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  inputProps={{ step: '0.01', min: '0' }}
                  fullWidth
                />
                <TextField
                  label="Miscellaneous Cost (₡)"
                  type="number"
                  value={miscCost}
                  onChange={(e) => setMiscCost(e.target.value)}
                  inputProps={{ step: '0.01', min: '0' }}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Additional Notes"
                placeholder="Hardware, shipping, etc..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4, pt: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.secondary',
              bgcolor: 'action.hover',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={!isValid}
          sx={{
            background: isValid ? 'linear-gradient(135deg, #635BFF 0%, #7A73FF 100%)' : undefined,
            px: 4,
            '&:hover': {
              background: isValid ? 'linear-gradient(135deg, #4D47CC 0%, #635BFF 100%)' : undefined,
            },
          }}
        >
          {editingProject ? 'Update Project' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
