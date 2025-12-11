import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';
import './CommentSection.css';

const CommentSection = ({ movieId }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieApi.getMovieComments(movieId);
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }
    
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const savedComment = await movieApi.createComment(movieId, newComment);
      setComments([savedComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) {
      if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    try {
      await movieApi.likeComment(commentId);
      const updatedComments = comments.map(comment => 
        comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('추천에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await movieApi.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-title">댓글 ({comments.length})</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성해주세요..."
            className="comment-textarea"
            rows="4"
            required
          />
          <button type="submit" className="comment-submit">작성</button>
        </form>
      ) : (
        <div className="login-prompt">
          댓글을 작성하려면 <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>로그인</span>이 필요합니다.
        </div>
      )}
      
      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.user?.name || comment.user?.email || '익명'}</span>
                  <span className="comment-date">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-actions">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className="like-button"
                  >
                    👍 {comment.likes || 0}
                  </button>
                  {user && comment.user && user.id === comment.user.id && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="delete-button"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-comments">첫 댓글을 작성해보세요!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;