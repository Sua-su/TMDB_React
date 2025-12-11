import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./BoardDetailPage.css";

function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    loadBoardData();
  }, [boardId]);

  useEffect(() => {
    const currentState = window.history.state?.usr;
    if (currentState?.selectedMovie) {
      setSelectedMovie(currentState.selectedMovie);
      setShowForm(true);
      setFormData({
        title: `[영화 추천] ${currentState.selectedMovie.title}`,
        content: `영화: ${currentState.selectedMovie.title}\n\n`,
      });
    }
    if (currentState?.editPost) {
      const post = currentState.editPost;
      setEditingPost(post);
      setFormData({ title: post.title, content: post.content });
      setShowForm(true);
    }
  }, []);

  const loadBoardData = async () => {
    try {
      const [boardRes, postsRes] = await Promise.all([
        axios.get("/api/boards", { withCredentials: true }),
        axios.get(`/api/boards/${boardId}/posts`, { withCredentials: true }),
      ]);

      const currentBoard = boardRes.data.find(
        (b) => b.id === parseInt(boardId)
      );
      setBoard(currentBoard);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Error loading board:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다");
      return;
    }

    try {
      if (editingPost) {
        await axios.put(`/api/boards/posts/${editingPost.id}`, formData, {
          withCredentials: true,
        });
      } else {
        await axios.post(`/api/boards/${boardId}/posts`, formData, {
          withCredentials: true,
        });
      }

      setFormData({ title: "", content: "" });
      setShowForm(false);
      setEditingPost(null);
      loadBoardData();
    } catch (error) {
      alert("게시글 저장에 실패했습니다");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/boards/posts/${postId}`, {
        withCredentials: true,
      });
      loadBoardData();
    } catch (error) {
      alert("삭제에 실패했습니다");
    }
  };

  const searchMovies = async () => {
    if (!movieSearchQuery.trim()) return;

    try {
      const apiKey = "c12ed457b94399d3c810d10b94e4e4c5";
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${movieSearchQuery}`
      );
      setSearchResults(response.data.results.slice(0, 10));
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
    });
    setFormData({
      ...formData,
      title: `[영화 추천] ${movie.title}`,
      content: formData.content + `\n영화: ${movie.title}\n영화 ID: ${movie.id}\n`,
    });
    setShowMovieSearch(false);
    setMovieSearchQuery("");
    setSearchResults([]);
  };

  if (loading) {
    return <div className="text-center p-5">로딩 중...</div>;
  }

  if (!board) {
    return <div className="text-center p-5">게시판을 찾을 수 없습니다</div>;
  }

  return (
    <div className="board-detail-container">
      <div className="board-header">
        <h2>{board.name}</h2>
        <p className="text-muted">{board.description}</p>
        {user && !showForm && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingPost(null);
              setFormData({ title: "", content: "" });
            }}
          >
            글쓰기
          </button>
        )}
      </div>

      {showForm && (
        <div className="post-form-container">
          <h4>{editingPost ? "게시글 수정" : "새 게시글 작성"}</h4>
          {board?.name === "추천영화" && !editingPost && (
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-info mb-2"
                onClick={() => setShowMovieSearch(!showMovieSearch)}
              >
                <i className="bi bi-film me-2"></i>
                영화 검색
              </button>
              {selectedMovie && (
                <div className="alert alert-success">
                  선택된 영화: {selectedMovie.title}
                </div>
              )}
              {showMovieSearch && (
                <div className="movie-search-box">
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="영화 제목 검색"
                      value={movieSearchQuery}
                      onChange={(e) => setMovieSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && searchMovies()}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={searchMovies}
                    >
                      검색
                    </button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="search-results" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {searchResults.map((movie) => (
                        <div
                          key={movie.id}
                          className="search-result-item d-flex align-items-center p-2 border-bottom"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleMovieSelect(movie)}
                        >
                          {movie.poster_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                              alt={movie.title}
                              style={{ width: "50px", marginRight: "10px" }}
                            />
                          )}
                          <div>
                            <strong>{movie.title}</strong>
                            <br />
                            <small className="text-muted">{movie.release_date?.substring(0, 4)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="제목"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                maxLength="200"
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="10"
                placeholder="내용을 입력하세요"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                maxLength="5000"
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingPost ? "수정" : "작성"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  setFormData({ title: "", content: "" });
                }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-list">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "50%" }}>제목</th>
              <th style={{ width: "15%" }}>작성자</th>
              <th style={{ width: "15%" }}>작성일</th>
              <th style={{ width: "10%" }}>조회</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  작성된 게시글이 없습니다
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr 
                  key={post.id}
                  onClick={() => navigate(`/boards/${boardId}/post/${post.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{posts.length - index}</td>
                  <td>
                    <div className="post-title-cell">
                      <span className="post-title-link">
                        {post.title}
                      </span>
                      {user && user.username === post.author?.username && (
                        <div className="post-actions">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(post);
                            }}
                          >
                            수정
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(post.id);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{post.author?.username}</td>
                  <td>
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td>{post.viewCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BoardDetailPage;
