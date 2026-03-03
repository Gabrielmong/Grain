import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { LikeButton } from './LikeButton';
import { formatDistanceToNow } from '../../utils/date';

interface PostImage {
  url: string;
  category: string;
}

interface PostCardProps {
  id: string;
  description: string;
  projectName: string;
  username: string;
  createdBy: string;
  createdByImageData?: string | null;
  images: PostImage[];
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  onClick?: () => void;
}

export function PostCard({
  id,
  description,
  projectName,
  username,
  createdBy,
  createdByImageData,
  images,
  likeCount,
  commentCount,
  isLikedByMe,
  createdAt,
  onClick,
}: PostCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const coverImage = images[0];

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardActionArea onClick={onClick}>
        {coverImage ? (
          <CardMedia
            component="img"
            height="220"
            image={coverImage.url}
            alt={projectName}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 220,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.disabled">
              {t('feed.noImages')}
            </Typography>
          </Box>
        )}

        <CardContent sx={{ pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {projectName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={() => navigate(`/u/${username}`)}
            sx={{ cursor: 'pointer' }}
          >
            <Avatar
              sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}
              src={createdByImageData || undefined}
            >
              {!createdByImageData && createdBy.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {createdBy}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.disabled">
            {formatDistanceToNow(createdAt)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
          <LikeButton
            key={`${id}-${likeCount}-${isLikedByMe}`}
            postId={id}
            likeCount={likeCount}
            isLikedByMe={isLikedByMe}
          />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {commentCount}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
