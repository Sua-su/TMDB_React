import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BoardListPage.css";

function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const response = await axios.get("/api/boards", {
        withCredentials: true,
      });
      setBoards(response.data);
    } catch (error) {
      console.error("Error loading boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeBoards = async () => {
    try {
      await axios.post(
        "/api/boards/init",
        {},
        {
          withCredentials: true,
        }
      );
      loadBoards();
    } catch (error) {
      console.error("Error initializing boards:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-5">로딩 중...</div>;
  }

  if (boards.length === 0) {
    return (
      <div className="board-list-container text-center">
        <h3>게시판이 없습니다</h3>
        <button className="btn btn-primary mt-3" onClick={initializeBoards}>
          게시판 초기화
        </button>
      </div>
    );
  }

  return (
    <div className="board-list-container">
      <h2>게시판</h2>
      <div className="row">
        {boards.map((board) => (
          <div key={board.id} className="col-md-4 mb-4">
            <Link to={`/boards/${board.id}`} className="text-decoration-none">
              <div className="board-card">
                <h4>{board.name}</h4>
                <p className="text-muted">{board.description}</p>
                <div className="board-stats">
                  <span>게시글 {board.posts?.length || 0}개</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardListPage;
