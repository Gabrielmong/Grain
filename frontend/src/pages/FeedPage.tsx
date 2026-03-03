import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { GET_FEED } from '../graphql/operations';
import { PostCard } from '../components/Feed/PostCard';
import { PostDetail } from '../components/Feed/PostDetail';
import { Appbar } from '../components/Appbar';
import { getFingerprint } from '../utils/fingerprint';

const PAGE_SIZE = 12;

export default function FeedPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [postUpdates, setPostUpdates] = useState<Record<string, { likeCount: number; isLikedByMe: boolean; commentCount: number }>>({});
  const fingerprint = getFingerprint();

  const { data, loading, error, fetchMore } = useQuery(GET_FEED, {
    variables: { page: 1, limit: PAGE_SIZE, fingerprint },
    notifyOnNetworkStatusChange: true,
  });

  const rawPosts = data?.feed || [];
  const posts = rawPosts.map((p: any) =>
    postUpdates[p.id] ? { ...p, ...postUpdates[p.id] } : p
  );

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchMore({
      variables: { page: nextPage, limit: PAGE_SIZE, fingerprint },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          feed: [...prev.feed, ...fetchMoreResult.feed],
        };
      },
    });
    setPage(nextPage);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Appbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            {t('feed.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('feed.subtitle')}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        {loading && posts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('feed.empty')}
            </Typography>
          </Box>
        ) : (
          <>
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

            {posts.length >= page * PAGE_SIZE && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : t('feed.loadMore')}
                </Button>
              </Box>
            )}
          </>
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
