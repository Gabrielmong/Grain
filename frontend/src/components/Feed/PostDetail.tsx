import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  Dialog,
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CommentSection } from './CommentSection';
import { ADD_COMMENT, GET_POST, LIKE_POST, UNLIKE_POST } from '../../graphql/operations';
import { formatDistanceToNow } from '../../utils/date';
import { getFingerprint } from '../../utils/fingerprint';

interface PostImage {
  url: string;
  category: string;
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  userId?: string | null;
  userImageData?: string | null;
  isAuthor: boolean;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface PostDetailProps {
  open: boolean;
  onClose: () => void;
  onPostUpdate?: (postId: string, updates: { likeCount: number; isLikedByMe: boolean; commentCount: number }) => void;
  post: {
    id: string;
    userId: string;
    description: string;
    projectName: string;
    username: string;
    createdBy: string;
    createdByImageData?: string | null;
    images: PostImage[];
    likeCount: number;
    commentCount: number;
    isLikedByMe: boolean;
    comments: Comment[];
    createdAt: string;
  } | null;
}

export function PostDetail({ open, onClose, onPostUpdate, post }: PostDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fingerprint = getFingerprint();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(post?.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);
  const [comments, setComments] = useState<Comment[]>(post?.comments ?? []);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // Fetch fresh post data (including comments) on every open
  const { data: freshData } = useQuery(GET_POST, {
    variables: { id: post?.id, fingerprint },
    skip: !post?.id,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (freshData?.post) {
      const p = freshData.post;
      setComments(p.comments ?? []);
      setLiked(p.isLikedByMe ?? false);
      setLikeCount(p.likeCount ?? 0);
    }
  }, [freshData]);

  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      setComments((prev) => {
        const updated = [...prev, { ...data.addComment, replies: [] }];
        const totalComments = updated.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0);
        onPostUpdate?.(post!.id, { likeCount, isLikedByMe: liked, commentCount: totalComments });
        return updated;
      });
      setNewComment('');
      setAddingComment(false);
    },
  });

  if (!post) return null;

  const images = post.images;
  const hasManyImages = images.length > 1;

  const handlePrev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const handleNext = () => setImgIndex((i) => (i + 1) % images.length);

  const handleLike = () => {
    const totalComments = comments.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0);
    if (liked) {
      const newCount = likeCount - 1;
      setLiked(false);
      setLikeCount(newCount);
      unlikePost({ variables: { postId: post.id, fingerprint } });
      onPostUpdate?.(post.id, { likeCount: newCount, isLikedByMe: false, commentCount: totalComments });
    } else {
      const newCount = likeCount + 1;
      setLiked(true);
      setLikeCount(newCount);
      likePost({ variables: { postId: post.id, fingerprint } });
      onPostUpdate?.(post.id, { likeCount: newCount, isLikedByMe: true, commentCount: totalComments });
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated && !authorName.trim()) return;
    setAddingComment(true);
    addCommentMutation({
      variables: {
        postId: post.id,
        input: {
          content: newComment.trim(),
          authorName: isAuthenticated
            ? user ? `${user.firstName} ${user.lastName}`.trim() : ''
            : authorName.trim(),
        },
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && hasManyImages) handlePrev();
    if (e.key === 'ArrowRight' && hasManyImages) handleNext();
  };

  const goToProfile = () => {
    onClose();
    navigate(`/u/${post.username}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: { xs: '100%', md: '90vw' },
          maxWidth: 1100,
          maxHeight: '92vh',
          height: { md: '92vh' },
          m: { xs: 0, md: 2 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Left: Image carousel ── */}
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          height: { xs: 300, md: '100%' },
          bgcolor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {images.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Typography color="grey.600" variant="body2">
              {t('feed.noImages')}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              component="img"
              src={images[imgIndex].url}
              alt={`image-${imgIndex}`}
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />

            {hasManyImages && (
              <>
                <IconButton
                  onClick={handlePrev}
                  size="small"
                  sx={{
                    position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                    color: 'white', bgcolor: 'rgba(0,0,0,0.45)', '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  size="small"
                  sx={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    color: 'white', bgcolor: 'rgba(0,0,0,0.45)', '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>

                {/* Dot indicators */}
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)' }}
                >
                  {images.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setImgIndex(i)}
                      sx={{
                        width: i === imgIndex ? 8 : 6,
                        height: i === imgIndex ? 8 : 6,
                        borderRadius: '50%',
                        bgcolor: i === imgIndex ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </Stack>
              </>
            )}
          </>
        )}
      </Box>

      {/* ── Right panel ── */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', md: '100%' },
          overflow: 'hidden',
          borderLeft: { md: '1px solid' },
          borderColor: { md: 'divider' },
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.5, flexShrink: 0 }}>
          <Avatar
            src={post.createdByImageData || undefined}
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', cursor: 'pointer', fontSize: '0.9rem' }}
            onClick={goToProfile}
          >
            {!post.createdByImageData && post.createdBy.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              noWrap
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, lineHeight: 1.2 }}
              onClick={goToProfile}
            >
              {post.createdBy}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {post.projectName}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider />

        {/* Scrollable body: description + comments */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
          {/* Description as a "caption comment" */}
          <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
            <Avatar
              src={post.createdByImageData || undefined}
              sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0 }}
              onClick={goToProfile}
            >
              {!post.createdByImageData && post.createdBy.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2">
                <Box
                  component="span"
                  fontWeight={700}
                  sx={{ mr: 0.75, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={goToProfile}
                >
                  {post.createdBy}
                </Box>
                {post.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {formatDistanceToNow(post.createdAt)}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Comments (no form — form is pinned at bottom) */}
          <CommentSection
            postId={post.id}
            postUserId={post.userId}
            comments={comments}
            onCommentsChange={(updated) => {
              setComments(updated);
              const total = updated.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0);
              onPostUpdate?.(post.id, { likeCount, isLikedByMe: liked, commentCount: total });
            }}
            embedded
          />
        </Box>

        <Divider />

        {/* Like row */}
        <Box sx={{ px: 2, pt: 1.25, pb: 0.5, flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton size="small" onClick={handleLike} sx={{ p: 0.5, color: liked ? 'error.main' : 'text.primary' }}>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Stack>
          {likeCount > 0 && (
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.25 }}>
              {t('feed.likeCount', { count: likeCount })}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, mb: 0.75 }}>
            {formatDistanceToNow(post.createdAt)}
          </Typography>
        </Box>

        <Divider />

        {/* Inline add-comment bar */}
        <Box sx={{ px: 2, py: 1, flexShrink: 0 }}>
          {!isAuthenticated && (
            <TextField
              placeholder={t('feed.yourName')}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              size="small"
              fullWidth
              variant="standard"
              sx={{ mb: 0.75 }}
            />
          )}
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              placeholder={t('feed.addCommentPlaceholder')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="small"
              fullWidth
              multiline
              maxRows={3}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handlePostComment();
                }
              }}
            />
            <Button
              size="small"
              onClick={handlePostComment}
              disabled={!newComment.trim() || (!isAuthenticated && !authorName.trim()) || addingComment}
              sx={{ textTransform: 'none', fontWeight: 700, minWidth: 'auto', whiteSpace: 'nowrap' }}
            >
              {addingComment ? <CircularProgress size={16} /> : t('feed.post')}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
