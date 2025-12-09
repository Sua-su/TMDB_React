import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('userId') !== null; 

  // 영화 이름 매핑용 (Write 페이지와 동일하게 맞춤)
  const getMovieTitle = (mvNo) => {
    const movies = {
      1: "오징어 게임 2",
      2: "미키 17",
      3: "캡틴 아메리카: BNW",
      4: "검은 수녀들",
      5: "하얼빈"
    };
    return movies[mvNo] || "알 수 없는 영화";
  };

  const styles = {
    container: { backgroundColor: '#2A2A2A', minHeight: '100vh', padding: '40px', color: 'white' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '20px' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#53ef12' },
    writeButton: { backgroundColor: '#53ef12', color: '#2A2A2A', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
    
    // 카드 스타일
    card: { backgroundColor: '#333', padding: '25px', marginBottom: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', borderLeft: '5px solid #53ef12', cursor: 'pointer', transition: '0.3s' },
    movieBadge: { display: 'inline-block', backgroundColor: '#53ef12', color: '#2A2A2A', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' },
    cardTitle: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' },
    cardInfo: { fontSize: '0.9rem', color: '#aaa' }
  };

  useEffect(() => {
    // [변경] 특정 영화 번호 없이 전체 리스트 호출
    axios.get('http://localhost:8080/api/review/list')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Reviews</h1>
        {isLoggedIn && (
          <button style={styles.writeButton} onClick={() => navigate('/review/write')}>
            리뷰 작성하기
          </button>
        )}
      </div>

      <div>
        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>등록된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review) => (
            <div 
              key={review.boardNo} 
              style={styles.card}
              onClick={() => navigate(`/review/${review.boardNo}`)} // 상세페이지 이동
            >
              {/* 영화 제목 뱃지 */}
              <span style={styles.movieBadge}>
                🎬 {getMovieTitle(review.mvNo)}
              </span>
              
              <div style={styles.cardTitle}>{review.boardTitle}</div>
              <div style={styles.cardInfo}>
                작성자: {review.memberId} | 날짜: {review.regDate}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;