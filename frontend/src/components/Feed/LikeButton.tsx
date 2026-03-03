import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { IconButton, Typography, Box, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { LIKE_POST, UNLIKE_POST } from '../../graphql/operations';
import { getFingerprint } from '../../utils/fingerprint';

interface LikeButtonProps {
  postId: string;
  likeCount: number;
  isLikedByMe: boolean;
}

export function LikeButton({ postId, likeCount, isLikedByMe: initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const fingerprint = getFingerprint();

  const [likePost, { loading: liking }] = useMutation(LIKE_POST, {
    onCompleted: (data) => {
      setLiked(true);
      setCount(data.likePost.likeCount);
    },
  });

  const [unlikePost, { loading: unliking }] = useMutation(UNLIKE_POST, {
    onCompleted: (data) => {
      setLiked(false);
      setCount(data.unlikePost.likeCount);
    },
  });

  const loading = liking || unliking;

  const handleToggle = () => {
    if (loading) return;
    if (liked) {
      unlikePost({ variables: { postId, fingerprint } });
    } else {
      likePost({ variables: { postId, fingerprint } });
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton
        onClick={handleToggle}
        size="small"
        disabled={loading}
        sx={{
          color: liked ? 'error.main' : 'text.secondary',
          p: 0.5,
        }}
      >
        {loading ? (
          <CircularProgress size={18} />
        ) : liked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {count}
      </Typography>
    </Box>
  );
}
