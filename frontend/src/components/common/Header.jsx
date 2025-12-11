import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      alert('로그아웃되었습니다.');
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/main" className="logo">
          <h1>TMDB</h1>
        </Link>
        <nav className="nav">
          <Link to="/main" className="nav-link">영화</Link>
          <Link to="/tv" className="nav-link">TV</Link>
          <Link to="/reviews" className="nav-link">리뷰</Link>
          {isAuthenticated ? (
            <>
              <Link to="/mypage" className="nav-link user-info">
                {user?.name || user?.memberId}님
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">로그인</Link>
              <Link to="/signup" className="nav-link">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;