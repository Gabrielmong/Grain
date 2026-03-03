import { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { uploadImage } from '../../../utils/upload';
import type { CreateProjectImageInput } from '../../../types/project';
import { ProjectImageCategory } from '../../../types/project';

interface ProjectImagesSectionProps {
  images: CreateProjectImageInput[];
  onChange: (images: CreateProjectImageInput[]) => void;
}

const MAX_PER_CATEGORY = 5;

export function ProjectImagesFormSection({ images, onChange }: ProjectImagesSectionProps) {
  const { t } = useTranslation();
  const renderInputRef = useRef<HTMLInputElement>(null);
  const finishedInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<ProjectImageCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const renderImages = images.filter((img) => img.category === ProjectImageCategory.RENDER);
  const finishedImages = images.filter((img) => img.category === ProjectImageCategory.FINISHED);

  const handleUpload = async (files: FileList | null, category: ProjectImageCategory) => {
    if (!files?.length) return;
    const current = category === ProjectImageCategory.RENDER ? renderImages : finishedImages;
    if (current.length + files.length > MAX_PER_CATEGORY) {
      setError(t('projectImages.maxError', { max: MAX_PER_CATEGORY }));
      return;
    }
    setError(null);
    setUploading(category);
    try {
      const uploaded: CreateProjectImageInput[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, 'projects');
        uploaded.push({ url, category });
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError(t('projectImages.uploadError'));
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = (url: string) => {
    onChange(images.filter((img) => img.url !== url));
  };

  const renderSection = (
    category: ProjectImageCategory,
    label: string,
    icon: React.ReactNode,
    inputRef: React.RefObject<HTMLInputElement | null>,
    categoryImages: CreateProjectImageInput[]
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight={600}>{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          ({categoryImages.length}/{MAX_PER_CATEGORY})
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {categoryImages.map((img) => (
          <Box
            key={img.url}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Tooltip title={t('common.remove')}>
              <IconButton
                size="small"
                onClick={() => handleRemove(img.url)}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  p: 0.5,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleUpload(e.target.files, category)}
        onClick={(e) => ((e.target as HTMLInputElement).value = '')}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={uploading === category ? <CircularProgress size={16} /> : <AddPhotoAlternateIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={!!uploading || categoryImages.length >= MAX_PER_CATEGORY}
      >
        {t('projectImages.upload')}
      </Button>
    </Box>
  );

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        {t('projectImages.title')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {renderSection(
        ProjectImageCategory.RENDER,
        t('projectImages.renderImages'),
        <PhotoCameraIcon color="primary" fontSize="small" />,
        renderInputRef,
        renderImages
      )}

      {renderSection(
        ProjectImageCategory.FINISHED,
        t('projectImages.finishedImages'),
        <CheckCircleOutlineIcon color="success" fontSize="small" />,
        finishedInputRef,
        finishedImages
      )}
    </Box>
  );
}
