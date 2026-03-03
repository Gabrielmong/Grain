import { Box, Typography, Divider } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { ImageGallery } from '../../General/ImageGallery';
import type { ProjectImage } from '../../../types/project';
import { ProjectImageCategory } from '../../../types/project';

interface ProjectImagesSectionProps {
  images: ProjectImage[];
}

export function ProjectImagesSection({ images }: ProjectImagesSectionProps) {
  const { t } = useTranslation();

  const renderImages = images.filter((img) => img.category === ProjectImageCategory.RENDER);
  const finishedImages = images.filter((img) => img.category === ProjectImageCategory.FINISHED);

  if (!renderImages.length && !finishedImages.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      {renderImages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <PhotoCameraIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {t('projectImages.renderImages')}
            </Typography>
          </Box>
          <ImageGallery images={renderImages.map((img) => ({ url: img.url }))} cols={4} />
        </Box>
      )}

      {renderImages.length > 0 && finishedImages.length > 0 && <Divider sx={{ my: 2 }} />}

      {finishedImages.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <CheckCircleOutlineIcon color="success" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {t('projectImages.finishedImages')}
            </Typography>
          </Box>
          <ImageGallery images={finishedImages.map((img) => ({ url: img.url }))} cols={4} />
        </Box>
      )}
    </Box>
  );
}
