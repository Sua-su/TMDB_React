import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewWrite = () => {
  const navigate = useNavigate();
  
  // 영화 목록 (학습용 더미 데이터)
  // 실제로는 DB나 API에서 가져온 리스트를 써야 합니다.
  const movies = [
    { id: 1, title: "오징어 게임 2" },
    { id: 2, title: "미키 17" },
    { id: 3, title: "캡틴 아메리카: 브레이브 뉴 월드" },
    { id: 4, title: "검은 수녀들" },
    { id: 5, title: "하얼빈" }
  ];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMvNo, setSelectedMvNo] = useState(movies[0].id); // 기본값: 첫번째 영화

  // 로그인 체크
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/review');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      memberId: localStorage.getItem('userId'),
      boardTitle: title,
      boardContent: content,
      mvNo: parseInt(selectedMvNo) // 선택한 영화 번호 전송
    };

    try {
      const response = await axios.post('http://localhost:8080/api/review/write', data);
      if (response.data.status === 'success') {
        alert('리뷰가 등록되었습니다!');
        navigate('/review');
      } else {
        alert('등록 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 에러');
    }
  };

  // 스타일 (Atomize 테마)
  const styles = {
    container: { backgroundColor: '#2A2A2A', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' },
    formCard: { backgroundColor: '#333', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', borderTop: '5px solid #53ef12' },
    label: { display: 'block', marginBottom: '10px', color: '#53ef12', fontWeight: 'bold' },
    input: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#222', color: 'white', fontSize: '1rem' },
    select: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#222', color: 'white', fontSize: '1rem', cursor: 'pointer' },
    textarea: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#222', color: 'white', fontSize: '1rem', height: '150px', resize: 'none' },
    submitBtn: { width: '100%', backgroundColor: '#53ef12', color: '#2A2A2A', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
    backBtn: { marginTop: '15px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline', width: '100%' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#53ef12' }}>Review Write</h2>
        
        <form onSubmit={handleSubmit}>
          {/* 영화 선택 박스 */}
          <div>
            <label style={styles.label}>영화 선택</label>
            <select 
              style={styles.select}
              value={selectedMvNo}
              onChange={(e) => setSelectedMvNo(e.target.value)}
            >
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>제목</label>
            <input 
              style={styles.input}
              type="text" 
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={styles.label}>내용</label>
            <textarea 
              style={styles.textarea}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>등록하기</button>
        </form>
        
        <button style={styles.backBtn} onClick={() => navigate('/review')}>
          목록으로 취소
        </button>
      </div>
    </div>
  );
};

export default ReviewWrite;