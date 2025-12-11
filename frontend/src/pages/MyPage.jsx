import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { movieApi } from '../api/movieApi';
import Header from '../components/common/Header';
import './MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'comments'

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchMyComments();
  }, [isAuthenticated, navigate]);

  const fetchMyComments = async () => {
    setLoading(true);
    try {
      const comments = await movieApi.getUserComments();
      setMyComments(comments);
    } catch (error) {
      console.error('Error fetching my comments:', error);
      setMyComments([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mypage">
      <Header />
      <div className="mypage-container">
        <div className="mypage-sidebar">
          <div className="profile-section">
            <div className="profile-avatar">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <h2 className="profile-name">{user.name || '사용자'}</h2>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="menu-section">
            <button
              className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              내 정보
            </button>
            <button
              className={`menu-item ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              내가 쓴 댓글
            </button>
          </div>
        </div>

        <div className="mypage-content">
          {activeTab === 'info' && (
            <div className="info-section">
              <h2>내 정보</h2>
              <div className="info-card">
                <div className="info-item">
                  <span className="info-label">이름:</span>
                  <span className="info-value">{user.name || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">이메일:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">가입일:</span>
                  <span className="info-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="comments-section">
              <h2>내가 쓴 댓글</h2>
              {loading ? (
                <div className="loading">로딩 중...</div>
              ) : myComments.length > 0 ? (
                <div className="comments-list">
                  {myComments.map(comment => (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-movie">
                        {comment.movie?.title || '영화'}
                      </div>
                      <p className="comment-content">{comment.content}</p>
                      <div className="comment-meta">
                        <span>👍 {comment.likes || 0}</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>아직 작성한 댓글이 없습니다.</p>
                  <button onClick={() => navigate('/main')}>영화 보러가기</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
