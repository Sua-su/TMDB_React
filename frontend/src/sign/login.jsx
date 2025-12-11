import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    memberId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 입력 시 에러 메시지 클리어
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.memberId || !formData.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.memberId, formData.password);
      
      if (result.success) {
        alert('로그인 성공!');
        localStorage.setItem('token', result.data);
        localStorage.setItem('user', JSON.stringify(result.data));
        navigate('/main');
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      console.error('로그인 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>로그인</h1>
          <p>계속하려면 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="memberId">아이디</label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              placeholder="아이디를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/findPassword">비밀번호를 잊으셨나요?</Link>
          <span>|</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
