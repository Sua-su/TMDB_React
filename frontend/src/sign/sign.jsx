import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // 같은 CSS 파일을 사용
import { register } from '../api/userApi';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 비밀번호 확인 체크
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMatch(password === confirmPassword || confirmPassword === '');
    }

    // 입력 시 에러 메시지 클리어
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    // 필수 항목 체크
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setError('필수 항목을 모두 입력해주세요.');
      return false;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    // 비밀번호 길이 체크
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }

    // 비밀번호 확인 체크
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    // 전화번호 형식 체크 (선택사항이지만 입력했을 경우)
    if (formData.phone && !/^[0-9-+().\s]+$/.test(formData.phone)) {
      setError('올바른 전화번호 형식을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Spring Boot API 호출
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name
      };
      
      const result = await register(userData);
      
      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        setError(result.message || '회원가입에 실패했습니다.');
      }
      
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('회원가입 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>회원가입</h2>
          <p>새 계정을 만들어주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
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
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="010-1234-5678 (선택사항)"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="최소 6자 이상"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              disabled={isLoading}
              style={{
                borderColor: !passwordMatch ? '#f56565' : '#e1e5e9'
              }}
            />
            {!passwordMatch && formData.confirmPassword && (
              <small style={{ color: '#f56565', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                비밀번호가 일치하지 않습니다.
              </small>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !passwordMatch}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="signup-link">
            <span>이미 계정이 있으신가요? </span>
            <button 
              type="button"
              onClick={() => navigate('/login')}
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
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;