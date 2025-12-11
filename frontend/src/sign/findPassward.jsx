import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { findPassword } from '../api/userApi';

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundPassword, setFoundPassword] = useState('');

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

    // 이름과 이메일 입력 확인
    if (!formData.name || !formData.email) {
      setError('이름과 이메일을 모두 입력해주세요.');
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
      const result = await findPassword(formData.name, formData.email);
      
      if (result.success) {
        // 일치하는 사용자를 찾았을 때
        alert(result.message || '계정을 찾았습니다. 임시 비밀번호가 이메일로 발송됩니다.');
        setFoundPassword('success'); // 성공 표시용
      } else {
        // 일치하는 사용자를 찾지 못했을 때
        setError(result.message || '입력하신 이름과 이메일에 해당하는 계정을 찾을 수 없습니다.');
      }
      
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('비밀번호 찾기에 실패했습니다. 다시 시도해주세요.');
      }
      console.error('비밀번호 찾기 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (foundPassword) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h2>비밀번호 찾기 완료</h2>
            <p>계정을 찾았습니다</p>
          </div>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <div style={{ 
              fontSize: '3rem', 
              color: '#667eea', 
              marginBottom: '20px' 
            }}>
              ✅
            </div>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <p style={{ 
                color: '#666', 
                marginBottom: '10px'
              }}>
                <strong>이름:</strong> {formData.name}
              </p>
              <p style={{ 
                color: '#666', 
                marginBottom: '15px'
              }}>
                <strong>이메일:</strong> {formData.email}
              </p>
              <p style={{ 
                color: '#333', 
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                임시 비밀번호가 이메일로 발송됩니다.
              </p>
            </div>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#888' 
            }}>
              이메일을 확인하신 후, 로그인 후 비밀번호를 변경하시기 바랍니다.
            </p>
          </div>

          <button 
            type="button" 
            className="login-button"
            onClick={handleBackToLogin}
          >
            로그인 페이지로 돌아가기
          </button>

          <div className="login-footer">
            <div className="signup-link">
              <button 
                type="button"
                onClick={() => setFoundPassword('')}
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
                다른 계정으로 다시 찾기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>비밀번호 찾기</h2>
          <p>가입하신 이름과 이메일을 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="가입하신 이름을 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="가입하신 이메일을 입력하세요"
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
                비밀번호 찾는 중...
              </>
            ) : (
              '비밀번호 찾기'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="signup-link">
            <span>이미 계정 정보를 기억하셨나요? </span>
            <button 
              type="button"
              onClick={handleBackToLogin}
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

export default FindPasswordPage;
