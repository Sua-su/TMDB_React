import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ReviewDetail = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  
  const [review, setReview] = useState(null);
  const [replies, setReplies] = useState([]);
  
  // 댓글 입력 상태
  const [replyContent, setReplyContent] = useState('');
  const [evaluation, setEvaluation] = useState('GOOD'); // 기본값: 추천

  const userId = localStorage.getItem('userId'); // 현재 로그인한 사용자

  // --- 스타일 (Atomize 테마: #2A2A2A / #53ef12) ---
  const styles = {
    container: { backgroundColor: '#2A2A2A', minHeight: '100vh', padding: '40px', color: 'white', fontFamily: 'Helvetica, Arial, sans-serif' },
    
    // 네비게이션 & 버튼 영역
    topNav: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    backBtn: { background: 'transparent', color: '#aaa', border: '1px solid #aaa', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' },
    actionBtnGroup: { display: 'flex', gap: '10px' },
    editBtn: { backgroundColor: '#444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' },
    delBtn: { backgroundColor: '#ff5555', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' },

    // 리뷰 본문 카드
    boardCard: { backgroundColor: '#333', padding: '40px', borderRadius: '15px', borderLeft: '6px solid #53ef12', marginBottom: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', position: 'relative' },
    title: { fontSize: '2rem', color: '#53ef12', marginBottom: '15px', fontWeight: 'bold' },
    meta: { color: '#888', fontSize: '0.9rem', marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' },
    content: { fontSize: '1.1rem', lineHeight: '1.8', minHeight: '100px', whiteSpace: 'pre-wrap' },

    // 댓글 영역
    replySection: { marginTop: '20px' },
    replyHeader: { color: '#53ef12', borderBottom: '2px solid #53ef12', paddingBottom: '10px', marginBottom: '30px', display: 'inline-block' },
    
    // 댓글 입력창
    inputArea: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', backgroundColor: '#383838', padding: '20px', borderRadius: '10px' },
    evalBtnGroup: { display: 'flex', gap: '10px' },
    evalBtn: (isSelected, type) => ({
      flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s',
      border: isSelected ? (type === 'GOOD' ? '2px solid #53ef12' : '2px solid #ff5555') : '1px solid #555',
      backgroundColor: isSelected ? (type === 'GOOD' ? 'rgba(83, 239, 18, 0.1)' : 'rgba(255, 85, 85, 0.1)') : '#2A2A2A',
      color: isSelected ? (type === 'GOOD' ? '#53ef12' : '#ff5555') : '#aaa',
    }),
    textArea: { padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#222', color: 'white', fontSize: '1rem', resize: 'none', height: '80px', outline: 'none' },
    submitBtn: { backgroundColor: '#53ef12', color: '#2A2A2A', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },

    // 댓글 리스트 아이템
    replyItem: { backgroundColor: '#383838', padding: '20px', borderRadius: '10px', marginBottom: '15px', display: 'flex', gap: '20px', alignItems: 'flex-start' },
    badge: (type) => ({
      minWidth: '70px', height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '12px',
      backgroundColor: type === 'GOOD' ? 'rgba(83, 239, 18, 0.1)' : 'rgba(255, 85, 85, 0.1)',
      color: type === 'GOOD' ? '#53ef12' : '#ff5555',
      border: type === 'GOOD' ? '1px solid #53ef12' : '1px solid #ff5555', fontWeight: 'bold'
    }),
  };

  // --- 데이터 로드 ---
  useEffect(() => {
    fetchReviewDetail();
    fetchReplies();
  }, [boardNo]);

  const fetchReviewDetail = () => {
    axios.get(`http://localhost:8080/api/review/detail/${boardNo}`)
      .then(res => setReview(res.data))
      .catch(err => console.error("Load Failed", err));
  };

  const fetchReplies = () => {
    axios.get(`http://localhost:8080/api/reply/list/${boardNo}`)
      .then(res => setReplies(res.data));
  };

  // --- 핸들러 ---
  // 1. 댓글 작성
  const handleSubmitReply = () => {
    if (!userId) return alert('로그인이 필요합니다.');
    if (!replyContent.trim()) return alert('내용을 입력해주세요.');

    axios.post('http://localhost:8080/api/reply/write', {
      boardNo: boardNo,
      memberId: userId,
      replyContent: replyContent,
      evaluation: evaluation
    }).then(() => {
      setReplyContent('');
      setEvaluation('GOOD');
      fetchReplies();
    });
  };

  // 2. 게시글 삭제
  const handleDeleteReview = () => {
    if(window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/api/review/${boardNo}`)
        .then(res => {
          if(res.data.status === 'success') {
            alert('삭제되었습니다.');
            navigate('/review'); // 목록으로 이동
          } else {
            alert('삭제 실패');
          }
        })
        .catch(err => alert('에러 발생: ' + err));
    }
  };

  // 3. 게시글 수정 (학습용: 간단히 알림만 or 수정 페이지 이동 로직 추가 가능)
  const handleEditReview = () => {
    navigate(`/review/edit/${boardNo}`);
  };

  if (!review) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* 상단 네비게이션 */}
      <div style={styles.topNav}>
        <button style={styles.backBtn} onClick={() => navigate('/review')}>&lt; 목록으로</button>
        
        {/* 본인 글일 경우에만 수정/삭제 버튼 노출 */}
        {userId === review.memberId && (
          <div style={styles.actionBtnGroup}>
            <button style={styles.editBtn} onClick={handleEditReview}>수정</button>
            <button style={styles.delBtn} onClick={handleDeleteReview}>삭제</button>
          </div>
        )}
      </div>

      {/* 리뷰 본문 */}
      <div style={styles.boardCard}>
        <div style={styles.title}>{review.boardTitle}</div>
        <div style={styles.meta}>
          <span>Writer: <b>{review.memberId}</b></span>
          <span>{review.regDate}</span>
        </div>
        <div style={styles.content}>{review.boardContent}</div>
      </div>

      {/* 댓글 섹션 */}
      <div style={styles.replySection}>
        <h3 style={styles.replyHeader}>Comments ({replies.length})</h3>

        {/* 댓글 입력창 */}
        {userId ? (
          <div style={styles.inputArea}>
            <div style={{color:'#aaa', marginBottom:'10px', fontSize:'0.9rem'}}>이 영화를 추천하시나요?</div>
            <div style={styles.evalBtnGroup}>
              <button style={styles.evalBtn(evaluation === 'GOOD', 'GOOD')} onClick={() => setEvaluation('GOOD')}>
                👍 추천 (GOOD)
              </button>
              <button style={styles.evalBtn(evaluation === 'BAD', 'BAD')} onClick={() => setEvaluation('BAD')}>
                👎 비추천 (BAD)
              </button>
            </div>
            <textarea 
              style={styles.textArea} 
              placeholder="리뷰에 대한 생각이나 영화에 대한 짧은 평을 남겨주세요."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button style={styles.submitBtn} onClick={handleSubmitReply}>평가 등록</button>
          </div>
        ) : (
          <div style={{padding:'30px', textAlign:'center', color:'#777', background:'#333', borderRadius:'10px', marginBottom:'30px'}}>
            로그인 후 평가를 남길 수 있습니다.
          </div>
        )}

        {/* 댓글 목록 */}
        {replies.map((reply) => (
          <div key={reply.replyNo} style={styles.replyItem}>
            <div style={styles.badge(reply.evaluation)}>
              <div style={{fontSize: '1.8rem'}}>{reply.evaluation === 'GOOD' ? '👍' : '👎'}</div>
              <div style={{fontSize: '0.7rem'}}>{reply.evaluation}</div>
            </div>
            <div style={{flex: 1}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                <span style={{fontWeight:'bold', color:'#ddd'}}>{reply.memberId}</span>
                <span style={{fontSize:'0.8rem', color:'#777'}}>{reply.regDate}</span>
              </div>
              <div style={{color:'#ccc', lineHeight:'1.4'}}>{reply.replyContent}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewDetail;