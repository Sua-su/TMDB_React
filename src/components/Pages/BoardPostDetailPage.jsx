import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./BoardPostDetailPage.css";

function BoardPostDetailPage() {
  const { boardId, postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeInfo, setLikeInfo] = useState({ likeCount: 0, userLiked: false });
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      loadPostDetail();
      loadComments();
      loadLikes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const loadPostDetail = async () => {
    try {
      const response = await axios.get(`/api/boards/posts/${postId}`, {
        withCredentials: true,
      });
      setPost(response.data);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await axios.get(`/api/boards/posts/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadLikes = async () => {
    try {
      const response = await axios.get(`/api/boards/posts/${postId}/likes`, {
        withCredentials: true,
      });
      setLikeInfo(response.data);
    } catch (error) {
      console.error("Error loading likes:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `/api/boards/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setLikeInfo({
        likeCount: response.data.likeCount,
        userLiked: response.data.liked,
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다");
        navigate("/login");
      } else {
        alert("추천 처리에 실패했습니다");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요");
      return;
    }

    try {
      await axios.post(
        `/api/boards/posts/${postId}/comments`,
        { content: commentContent },
        { withCredentials: true }
      );
      setCommentContent("");
      loadComments();
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다");
        navigate("/login");
      } else {
        alert("댓글 작성에 실패했습니다");
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/boards/comments/${commentId}`, {
        withCredentials: true,
      });
      loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("자신의 댓글만 삭제할 수 있습니다");
      } else {
        alert("댓글 삭제에 실패했습니다");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/boards/${boardId}`, { state: { editPost: post } });
  };

  const handleDelete = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/boards/posts/${postId}`, {
        withCredentials: true,
      });
      navigate(`/boards/${boardId}`);
    } catch (error) {
      alert("삭제에 실패했습니다");
    }
  };

  if (loading) {
    return <div className="text-center p-5">로딩 중...</div>;
  }

  if (!post) {
    return <div className="text-center p-5">게시글을 찾을 수 없습니다</div>;
  }

  return (
    <div className="board-post-detail-container">
      <div className="post-header">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span className="author">작성자: {post.author?.username}</span>
          <span className="date">
            {new Date(post.createdAt).toLocaleString("ko-KR")}
          </span>
          <span className="views">조회수: {post.viewCount}</span>
        </div>
        {user && user.username === post.author?.username && (
          <div className="post-actions">
            <button className="btn btn-outline-primary me-2" onClick={handleEdit}>
              수정
            </button>
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        <pre>{post.content}</pre>
      </div>

      <div className="post-footer">
        <button
          className={`btn ${likeInfo.userLiked ? "btn-primary" : "btn-outline-primary"}`}
          onClick={handleLike}
        >
          <i className={`bi ${likeInfo.userLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"} me-2`}></i>
          추천 {likeInfo.likeCount}
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => navigate(`/boards/${boardId}`)}
        >
          목록으로
        </button>
      </div>

      <div className="comments-section">
        <h4>댓글 ({comments.length})</h4>
        
        {user && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="댓글을 입력하세요"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              댓글 작성
            </button>
          </form>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="text-muted text-center">댓글이 없습니다</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author?.username}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString("ko-KR")}
                  </span>
                  {user && user.username === comment.author?.username && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardPostDetailPage;
