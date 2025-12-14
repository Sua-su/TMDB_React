import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./CommentList.css";

function CommentList({ reviewId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadComments();
  }, [reviewId]);

  const loadComments = async () => {
    try {
      const response = await axios.get(`/api/comments/review/${reviewId}`, {
        withCredentials: true,
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `/api/comments/review/${reviewId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      loadComments();
    } catch (error) {
      alert("댓글 작성에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      await axios.put(
        `/api/comments/${commentId}`,
        { content },
        { withCredentials: true }
      );
      setEditingComment(null);
      loadComments();
    } catch (error) {
      alert("댓글 수정에 실패했습니다");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/comments/${commentId}`, {
        withCredentials: true,
      });
      loadComments();
    } catch (error) {
      alert("삭제에 실패했습니다");
    }
  };

  return (
    <div className="comment-section">
      <h6 className="mb-3">댓글 {comments.length}개</h6>

      {user && (
        <form onSubmit={handleSubmit} className="comment-form mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength="500"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !newComment.trim()}
            >
              작성
            </button>
          </div>
        </form>
      )}

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            {editingComment?.id === comment.id ? (
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={editingComment.content}
                  onChange={(e) =>
                    setEditingComment({
                      ...editingComment,
                      content: e.target.value,
                    })
                  }
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    handleUpdate(comment.id, editingComment.content)
                  }
                >
                  저장
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingComment(null)}
                >
                  취소
                </button>
              </div>
            ) : (
              <>
                <div className="comment-header">
                  <strong>{comment.user?.username || "익명"}</strong>
                  <small className="text-muted ms-2">
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                  </small>
                </div>
                <div className="comment-content">{comment.content}</div>
                {user && user.username === comment.user?.username && (
                  <div className="comment-actions">
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => setEditingComment(comment)}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => handleDelete(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentList;
