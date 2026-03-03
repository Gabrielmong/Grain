import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import { ADD_COMMENT, EDIT_COMMENT, DELETE_COMMENT } from '../../graphql/operations';
import { formatDistanceToNow } from '../../utils/date';

export interface Comment {
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

interface CommentSectionProps {
  postId: string;
  postUserId: string;
  comments: Comment[];
  onCommentsChange: (comments: Comment[]) => void;
  /** When true, hides the add-comment form (parent handles top-level comments) */
  embedded?: boolean;
}

const EDIT_WINDOW_MS = 10 * 60 * 1000;

function canEditComment(comment: Comment, myUserId?: string): boolean {
  if (!myUserId || comment.userId !== myUserId) return false;
  return Date.now() - new Date(comment.createdAt).getTime() < EDIT_WINDOW_MS;
}

function canDeleteComment(comment: Comment, myUserId?: string, postUserId?: string): boolean {
  if (!myUserId) return false;
  return comment.userId === myUserId || postUserId === myUserId;
}

interface CommentRowProps {
  comment: Comment;
  myUserId?: string;
  postUserId: string;
  isReply?: boolean;
  onReply: (comment: Comment) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

function CommentRow({ comment, myUserId, postUserId, isReply = false, onReply, onEdit, onDelete }: CommentRowProps) {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const showMenu = canEditComment(comment, myUserId) || canDeleteComment(comment, myUserId, postUserId);
  const wasEdited = comment.updatedAt !== comment.createdAt;

  const handleSaveEdit = () => {
    if (!editContent.trim() || editContent === comment.content) {
      setEditing(false);
      return;
    }
    setSaving(true);
    onEdit(comment.id, editContent.trim());
    setEditing(false);
    setSaving(false);
  };

  return (
    <Box sx={{ pl: isReply ? 5 : 0 }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={comment.userImageData || undefined}
          sx={{
            width: isReply ? 26 : 32, height: isReply ? 26 : 32,
            fontSize: '0.75rem', bgcolor: 'primary.main', flexShrink: 0,
          }}
        >
          {!comment.userImageData && comment.authorName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: isReply ? '0.8rem' : '0.875rem' }}>
              {comment.authorName}
            </Typography>
            {comment.isAuthor && (
              <Chip
                label={t('feed.author')}
                size="small"
                color="primary"
                sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700 }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(comment.createdAt)}
            </Typography>
            {wasEdited && (
              <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                ({t('feed.edited')})
              </Typography>
            )}
          </Stack>

          {editing ? (
            <Box sx={{ mt: 0.5 }}>
              <TextField
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                multiline
                size="small"
                fullWidth
                autoFocus
              />
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Button size="small" variant="contained" onClick={handleSaveEdit} disabled={saving}>
                  {saving ? <CircularProgress size={14} /> : t('feed.saveEdit')}
                </Button>
                <Button size="small" onClick={() => { setEditing(false); setEditContent(comment.content); }}>
                  {t('feed.cancelEdit')}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ mt: 0.2, fontSize: isReply ? '0.8rem' : '0.875rem', wordBreak: 'break-word' }}
            >
              {comment.content}
            </Typography>
          )}

          {!editing && !isReply && (
            <Button
              size="small"
              startIcon={<ReplyIcon sx={{ fontSize: '0.8rem !important' }} />}
              onClick={() => onReply(comment)}
              sx={{ mt: 0.25, textTransform: 'none', fontSize: '0.7rem', color: 'text.secondary', p: 0, minWidth: 0 }}
            >
              {t('feed.reply')}
            </Button>
          )}
        </Box>

        {showMenu && !editing && (
          <>
            <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0.25, flexShrink: 0 }}>
              <MoreVertIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              {canEditComment(comment, myUserId) && (
                <MenuItem dense onClick={() => { setMenuAnchor(null); setEditing(true); }}>
                  <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>{t('feed.edit')}</ListItemText>
                </MenuItem>
              )}
              {canDeleteComment(comment, myUserId, postUserId) && (
                <MenuItem dense onClick={() => { setMenuAnchor(null); onDelete(comment.id); }} sx={{ color: 'error.main' }}>
                  <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText>{t('feed.delete')}</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Stack>

      {!isReply && comment.replies && comment.replies.length > 0 && (
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          {comment.replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              myUserId={myUserId}
              postUserId={postUserId}
              isReply
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export function CommentSection({
  postId,
  postUserId,
  comments,
  onCommentsChange,
  embedded = false,
}: CommentSectionProps) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [error, setError] = useState('');

  const myUserId = user?.id;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedComments = useMemo(() => {
    const sorted = [...comments].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [comments, sortOrder]);

  const update = (updater: (prev: Comment[]) => Comment[]) => {
    onCommentsChange(updater(comments));
  };

  const [addComment, { loading: addLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      const newComment: Comment = data.addComment;
      if (newComment.parentId) {
        update((prev) =>
          prev.map((c) =>
            c.id === newComment.parentId
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          )
        );
      } else {
        update((prev) => [...prev, { ...newComment, replies: [] }]);
      }
      setContent('');
      setReplyTo(null);
      setError('');
    },
    onError: (err) => setError(err.message),
  });

  const [editComment] = useMutation(EDIT_COMMENT, {
    onError: (err) => setError(err.message),
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onError: (err) => setError(err.message),
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    if (!isAuthenticated && !authorName.trim()) return;
    setError('');
    addComment({
      variables: {
        postId,
        input: {
          content: content.trim(),
          authorName: isAuthenticated
            ? user ? `${user.firstName} ${user.lastName}`.trim() : ''
            : authorName.trim(),
          ...(replyTo ? { parentId: replyTo.id } : {}),
        },
      },
    });
  };

  const handleEdit = (id: string, newContent: string) => {
    const updateInList = (list: Comment[]): Comment[] =>
      list.map((c) => {
        if (c.id === id) return { ...c, content: newContent, updatedAt: new Date().toISOString() };
        if (c.replies) return { ...c, replies: updateInList(c.replies) };
        return c;
      });
    update(updateInList);
    editComment({ variables: { id, content: newContent } });
  };

  const handleDelete = (id: string) => {
    const remove = (list: Comment[]): Comment[] =>
      list
        .filter((c) => c.id !== id)
        .map((c) => (c.replies ? { ...c, replies: remove(c.replies) } : c));
    update(remove);
    deleteComment({ variables: { id } });
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <Box>
      {!embedded && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('feed.comments')} ({totalCount})
          </Typography>
          {comments.length > 1 && (
            <ToggleButtonGroup
              value={sortOrder}
              exclusive
              onChange={(_, v) => { if (v) setSortOrder(v); }}
              size="small"
            >
              <ToggleButton value="asc" sx={{ fontSize: '0.7rem', py: 0.25, px: 1 }}>
                {t('feed.sortOldest')}
              </ToggleButton>
              <ToggleButton value="desc" sx={{ fontSize: '0.7rem', py: 0.25, px: 1 }}>
                {t('feed.sortNewest')}
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Stack>
      )}

      {embedded && comments.length > 1 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={(_, v) => { if (v) setSortOrder(v); }}
            size="small"
          >
            <ToggleButton value="asc" sx={{ fontSize: '0.65rem', py: 0.25, px: 0.75 }}>
              {t('feed.sortOldest')}
            </ToggleButton>
            <ToggleButton value="desc" sx={{ fontSize: '0.65rem', py: 0.25, px: 0.75 }}>
              {t('feed.sortNewest')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}

      <Stack spacing={2.5} sx={{ mb: embedded ? 0 : 3 }}>
        {sortedComments.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('feed.noComments')}
          </Typography>
        )}
        {sortedComments.map((comment, index) => (
          <Box key={comment.id}>
            <CommentRow
              comment={comment}
              myUserId={myUserId}
              postUserId={postUserId}
              onReply={(c) => { setReplyTo(c); setContent(''); }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {index < sortedComments.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>

      {/* Full add-comment form — shown only in non-embedded mode */}
      {!embedded && (
        <Box sx={{ mt: 3 }}>
          {replyTo && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
              <ReplyIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {t('feed.replyingTo', { name: replyTo.authorName })}
              </Typography>
              <Button size="small" onClick={() => setReplyTo(null)} sx={{ textTransform: 'none', minWidth: 0 }}>
                {t('feed.cancelEdit')}
              </Button>
            </Stack>
          )}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            {replyTo ? t('feed.addReply') : t('feed.addComment')}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
          <Stack spacing={1.5}>
            {!isAuthenticated && (
              <TextField
                label={t('feed.yourName')}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                size="small"
                fullWidth
              />
            )}
            <TextField
              label={replyTo ? t('feed.yourReply') : t('feed.yourComment')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={replyTo ? 2 : 3}
              fullWidth
              size="small"
            />
            <Box>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!content.trim() || (!isAuthenticated && !authorName.trim()) || addLoading}
                size="small"
              >
                {addLoading ? <CircularProgress size={18} /> : replyTo ? t('feed.postReply') : t('feed.postComment')}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Inline reply composer shown inside embedded modal */}
      {embedded && replyTo && (
        <Box sx={{ mt: 2, p: 1.25, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
            <ReplyIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {t('feed.replyingTo', { name: replyTo.authorName })}
            </Typography>
            <IconButton size="small" onClick={() => setReplyTo(null)} sx={{ p: 0 }}>
              <CloseIcon sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Stack>
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
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
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              placeholder={t('feed.yourReply')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              size="small"
              fullWidth
              multiline
              maxRows={3}
              variant="standard"
              autoFocus
              InputProps={{ disableUnderline: true }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                if (e.key === 'Escape') setReplyTo(null);
              }}
            />
            <Button
              size="small"
              onClick={handleSubmit}
              disabled={!content.trim() || (!isAuthenticated && !authorName.trim()) || addLoading}
              sx={{ textTransform: 'none', fontWeight: 700, minWidth: 'auto' }}
            >
              {addLoading ? <CircularProgress size={14} /> : t('feed.post')}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
