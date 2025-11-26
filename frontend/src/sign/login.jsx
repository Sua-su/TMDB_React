import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { login } from '../api/userApi';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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

    

    // 기본 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // Spring Boot API 호출
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        alert('로그인 성공!');
        // 메인 페이지로 이동
        navigate('/main');
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
      
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
      console.error('로그인 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          
          <p>계속하려면 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
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
          <div className="forgot-password">
            <button 
              type="button"
              onClick={() => navigate('/findPassword')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
          <div className="signup-link">
            <span>계정이 없으신가요? </span>
            <button 
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              회원가입
            </button>
          </div>
        </div>


            {/* 구글 카카오 API임시 */}
        {/* <div className="divider">
          <span>또는</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <span>🔍</span>
            Google로 로그인
          </button>
          <button className="social-button kakao">
            <span>💬</span>
            카카오로 로그인
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
