import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import { GET_USER_POSTS, GET_USER_PROFILE } from '../graphql/operations';
import { PostCard } from '../components/Feed/PostCard';
import { PostDetail } from '../components/Feed/PostDetail';
import { Appbar } from '../components/Appbar';
import { getFingerprint } from '../utils/fingerprint';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [postUpdates, setPostUpdates] = useState<Record<string, { likeCount: number; isLikedByMe: boolean; commentCount: number }>>({});
  const fingerprint = getFingerprint();

  const { data: profileData, loading: loadingProfile } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    skip: !username,
  });

  const { data: postsData, loading: loadingPosts, error } = useQuery(GET_USER_POSTS, {
    variables: { username, fingerprint },
    skip: !username,
  });

  const profile = profileData?.userProfile;
  const rawPosts = postsData?.userPosts || [];
  const posts = rawPosts.map((p: any) =>
    postUpdates[p.id] ? { ...p, ...postUpdates[p.id] } : p
  );

  const loading = loadingProfile || loadingPosts;

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile && !loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{t('userProfile.notFound')}</Alert>
      </Container>
    );
  }

  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : '?';
  const imageData: string | null = profile?.imageData ?? null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Appbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {profile && (
          <>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                src={imageData || undefined}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  bgcolor: 'primary.main',
                }}
              >
                {!imageData && initials}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  @{profile.username}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {posts.length} {t('userProfile.posts')}
                  </Typography>
                  {profile.completedProjectsCount > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {profile.completedProjectsCount} {t('userProfile.completedProjects')}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
            <Divider sx={{ mb: 4 }} />
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        {loadingPosts && posts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('userProfile.noPosts')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post: any) => (
              <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PostCard
                  id={post.id}
                  description={post.description}
                  projectName={post.projectName}
                  username={post.username}
                  createdBy={post.createdBy}
                  createdByImageData={post.createdByImageData}
                  images={post.images}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  isLikedByMe={post.isLikedByMe}
                  createdAt={post.createdAt}
                  onClick={() => setSelectedPost(post)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <PostDetail
        key={selectedPost?.id || 'none'}
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        onPostUpdate={(postId, updates) =>
          setPostUpdates((prev) => ({ ...prev, [postId]: updates }))
        }
        post={selectedPost}
      />
    </Box>
  );
}
