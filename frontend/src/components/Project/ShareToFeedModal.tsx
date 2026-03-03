import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { CREATE_OR_UPDATE_POST, GET_MY_POST } from '../../graphql/operations';
import type { ProjectImage } from '../../types/project';
import { ProjectImageCategory } from '../../types/project';

interface ShareToFeedModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectImages: ProjectImage[];
}

export function ShareToFeedModal({
  open,
  onClose,
  projectId,
  projectImages,
}: ShareToFeedModalProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [showRenderImages, setShowRenderImages] = useState(true);
  const [showFinishedImages, setShowFinishedImages] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [error, setError] = useState('');

  const hasRenderImages = projectImages.some((img) => img.category === ProjectImageCategory.RENDER);
  const hasFinishedImages = projectImages.some(
    (img) => img.category === ProjectImageCategory.FINISHED
  );

  const { data: existingPostData, loading: loadingPost } = useQuery(GET_MY_POST, {
    variables: { projectId },
    skip: !open,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (existingPostData?.myPost) {
      const post = existingPostData.myPost;
      setDescription(post.description);
      setShowRenderImages(post.showRenderImages);
      setShowFinishedImages(post.showFinishedImages);
      setIsHidden(post.isHidden);
    } else if (!loadingPost) {
      setDescription('');
      setShowRenderImages(true);
      setShowFinishedImages(true);
      setIsHidden(false);
    }
  }, [existingPostData, loadingPost]);

  const [createOrUpdatePost, { loading: savingPost }] = useMutation(CREATE_OR_UPDATE_POST, {
    onError: (err) => setError(err.message),
  });

  const handleSubmit = async () => {
    setError('');
    try {
      await createOrUpdatePost({
        variables: {
          projectId,
          input: { description, showRenderImages, showFinishedImages, isHidden },
        },
      });
      onClose();
    } catch {
      // errors already set via onError callbacks
    }
  };

  const saving = savingPost;
  const isEditing = Boolean(existingPostData?.myPost);
  const isValid = description.trim().length > 0;

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
      <DialogTitle sx={{ px: 4, pt: 4, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <DynamicFeedIcon sx={{ color: 'secondary.main' }} />
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {isEditing ? t('feed.editPost') : t('feed.shareToFeed')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 2 }}>
        {loadingPost ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label={t('feed.postDescription')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              placeholder={t('feed.postDescriptionPlaceholder')}
            />

            {(hasRenderImages || hasFinishedImages) && (
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('feed.imageVisibility')}
                </Typography>
                {hasRenderImages && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showRenderImages}
                        onChange={(e) => setShowRenderImages(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={t('feed.showRenderImages')}
                  />
                )}
                {hasFinishedImages && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showFinishedImages}
                        onChange={(e) => setShowFinishedImages(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={t('feed.showFinishedImages')}
                  />
                )}
              </Stack>
            )}

            {!hasRenderImages && !hasFinishedImages && (
              <Alert severity="info">{t('feed.noImagesWarning')}</Alert>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={isHidden}
                  onChange={(e) => setIsHidden(e.target.checked)}
                  color="warning"
                />
              }
              label={
                <Stack>
                  <Typography variant="body2">{t('feed.hideFromFeed')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('feed.hideFromFeedHelp')}
                  </Typography>
                </Stack>
              }
            />
          </Stack>
        )}
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
          disabled={!isValid || saving || loadingPost}
          sx={{
            background: isValid ? 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' : undefined,
            px: 4,
            '&:hover': {
              background: isValid ? 'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%)' : undefined,
            },
          }}
        >
          {saving ? (
            <CircularProgress size={20} color="inherit" />
          ) : isEditing ? (
            t('feed.updatePost')
          ) : (
            t('feed.publishPost')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
