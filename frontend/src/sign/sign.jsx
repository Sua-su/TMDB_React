import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; // Reusing login page styles
import { register } from '../api/userApi';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { memberId, name, email, password, confirmPassword } = formData;
    if (!memberId || !name || !email || !password || !confirmPassword) {
      setError('필수 항목을 모두 입력해주세요.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    // 아이디 숫자 검증 추가
    const memberIdRegex = /^[a-zA-Z0-9]+$/;
    if (!memberIdRegex.test(memberId)) {
      setError('아이디는 영문과 숫자만 가능합니다.');
      return false;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        memberId: formData.memberId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      const result = await register(userData);
      
      if (result.success) {
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        setError(result.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
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
            <label htmlFor="memberId">아이디 *</label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              placeholder="사용할 아이디를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
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
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || (formData.password !== formData.confirmPassword)}
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="login-footer">
          <span>이미 계정이 있으신가요? </span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;