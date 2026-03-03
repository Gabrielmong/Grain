import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ImageGalleryProps {
  images: { url: string; label?: string }[];
  cols?: number;
}

export function ImageGallery({ images, cols = 3 }: ImageGalleryProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const effectiveCols = isMobile ? 2 : cols;

  const handleOpen = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const handlePrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const handleNext = () => setIndex((i) => (i + 1) % images.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <>
      <ImageList cols={effectiveCols} gap={8}>
        {images.map((img, i) => (
          <ImageListItem
            key={i}
            sx={{ cursor: 'pointer', borderRadius: 2, overflow: 'hidden' }}
            onClick={() => handleOpen(i)}
          >
            <img
              src={img.url}
              alt={img.label || `image-${i}`}
              loading="lazy"
              style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        onKeyDown={handleKeyDown}
        PaperProps={{ sx: { bgcolor: 'black', position: 'relative' } }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>

        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'white', zIndex: 1 }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', color: 'white', zIndex: 1 }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}

        <DialogContent sx={{ p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <Box
            component="img"
            src={images[index].url}
            alt={images[index].label || `image-${index}`}
            sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
