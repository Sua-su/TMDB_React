import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewEdit = () => {
  const { boardNo } = useParams(); // URL에서 글 번호 가져오기
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');

  // 스타일 (기존 테마 유지)
  const styles = {
    container: { backgroundColor: '#2A2A2A', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' },
    formCard: { backgroundColor: '#333', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', borderLeft: '5px solid #53ef12' },
    label: { display: 'block', marginBottom: '10px', color: '#53ef12', fontWeight: 'bold' },
    input: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#222', color: 'white', fontSize: '1rem' },
    textarea: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#222', color: 'white', fontSize: '1rem', height: '150px', resize: 'none' },
    submitBtn: { width: '100%', backgroundColor: '#53ef12', color: '#2A2A2A', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
    cancelBtn: { width: '100%', backgroundColor: '#444', color: '#aaa', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }
  };

  // 1. 기존 데이터 불러오기 (가장 중요한 부분!)
  useEffect(() => {
    axios.get(`http://localhost:8080/api/review/detail/${boardNo}`)
      .then(res => {
        // 가져온 데이터를 state에 넣어서 입력창을 채움
        setTitle(res.data.boardTitle);
        setContent(res.data.boardContent);
        
        // 본인이 아니면 튕겨내기 (보안)
        if(res.data.memberId !== userId) {
            alert('수정 권한이 없습니다.');
            navigate('/review');
        }
      })
      .catch(err => console.error(err));
  }, [boardNo, userId, navigate]);

  // 2. 수정 요청 보내기
  const handleUpdate = (e) => {
    e.preventDefault();

    axios.put('http://localhost:8080/api/review/edit', {
      boardNo: boardNo,       // 어떤 글인지 알려줘야 함 (WHERE절)
      boardTitle: title,      // 바꿀 제목
      boardContent: content   // 바꿀 내용
    }).then(res => {
      if (res.data.status === 'success') {
        alert('수정 완료!');
        navigate(`/review/${boardNo}`); // 상세 페이지로 복귀
      } else {
        alert('수정 실패');
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#53ef12' }}>Review Edit</h2>
        
        <form onSubmit={handleUpdate}>
          <div>
            <label style={styles.label}>제목</label>
            <input 
              style={styles.input}
              type="text" 
              value={title} // 여기가 채워져 있음
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={styles.label}>내용</label>
            <textarea 
              style={styles.textarea}
              value={content} // 여기가 채워져 있음
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>수정 완료</button>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate(-1)}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewEdit;