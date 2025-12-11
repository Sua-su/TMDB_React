# TMDB React 프로젝트 - 실행 및 데이터베이스 검증 가이드

## 📋 프로젝트 개요

Spring Boot (Backend) + React (Frontend) 기반의 TMDB 영화 정보 플랫폼

## 🔧 기술 스택

- **Backend**: Spring Boot 3.5.7, Java 21, JPA + MyBatis, SQLite
- **Frontend**: React 19.1.1, React Router 7.10.1, Axios 1.13.2
- **Database**: SQLite (자동 생성: `tmdb.db`)

---

## 🚀 프로젝트 실행 방법

### 1️⃣ Backend 실행

```bash
cd /Users/su/Documents/TMDB_React/backend

# Maven으로 실행
./mvnw spring-boot:run

# 또는 IDE에서 TMDBApplication.java 실행
```

**실행 확인:**

- 포트: `http://localhost:8080`
- 로그에서 `Started TMDBApplication` 메시지 확인
- SQLite DB 파일이 프로젝트 루트에 `tmdb.db` 생성됨

### 2️⃣ Frontend 실행

```bash
cd /Users/su/Documents/TMDB_React/frontend

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm start
```

**실행 확인:**

- 포트: `http://localhost:3000`
- 자동으로 브라우저가 열림

---

## 🗄️ 데이터베이스 검증

### DB 파일 위치 확인

```bash
cd /Users/su/Documents/TMDB_React/backend
ls -la tmdb.db
```

### SQLite CLI로 DB 확인

```bash
# SQLite CLI 설치 (Mac)
brew install sqlite

# DB 접속
sqlite3 tmdb.db

# 테이블 목록 확인
.tables

# 테이블 구조 확인
.schema users
.schema movies
.schema movie_comments

# 데이터 조회
SELECT * FROM users;
SELECT * FROM movies;
SELECT * FROM movie_comments;

# 종료
.exit
```

### 예상 테이블 구조

#### 1. `users` 테이블

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT
);
```

#### 2. `movies` 테이블

```sql
CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER UNIQUE,
    title TEXT NOT NULL,
    overview TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    release_date DATE,
    vote_average REAL,
    vote_count INTEGER,
    popularity REAL,
    original_language TEXT,
    adult INTEGER,
    created_at TIMESTAMP
);
```

#### 3. `movie_comments` 테이블

```sql
CREATE TABLE movie_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## ✅ 기능 테스트 체크리스트

### 1. 회원가입 & 로그인

- [ ] `/signup` - 새 계정 생성
- [ ] `/login` - 로그인
- [ ] 로그인 후 사용자 이름 표시 확인
- [ ] **DB 검증**: `SELECT * FROM users;` 에서 신규 사용자 확인

### 2. 영화 목록 & 검색

- [ ] `/main` - TMDB API에서 영화 목록 불러오기
- [ ] 검색 기능 테스트
- [ ] 영화 카드 클릭 → 상세 페이지 이동
- [ ] **DB 검증**: `SELECT * FROM movies;` 에서 조회된 영화 저장 확인

### 3. 영화 댓글 (DB 저장 확인 핵심!)

- [ ] 영화 상세 페이지에서 댓글 작성
- [ ] 댓글 작성 후 새로고침해도 댓글 유지되는지 확인
- [ ] 좋아요 버튼 클릭
- [ ] **DB 검증**:
  ```sql
  SELECT mc.id, mc.content, mc.likes, mc.created_at,
         u.name as user_name, m.title as movie_title
  FROM movie_comments mc
  JOIN users u ON mc.user_id = u.id
  JOIN movies m ON mc.movie_id = m.id
  ORDER BY mc.created_at DESC;
  ```

### 4. 마이페이지

- [ ] `/mypage` - 내 정보 확인
- [ ] "내가 쓴 댓글" 탭에서 댓글 목록 표시
- [ ] **DB 검증**:
  ```sql
  SELECT * FROM movie_comments WHERE user_id = 1;
  ```

### 5. TV 시리즈

- [ ] `/tv` - TV 시리즈 목록
- [ ] TV 상세 페이지 이동

### 6. 배우 프로필

- [ ] `/actor/:id` - 배우 상세 페이지
- [ ] 출연 작품 목록 표시

---

## 🐛 트러블슈팅

### 1. DB 파일이 생성되지 않음

**원인**: Backend가 실행되지 않았거나, DB 경로 문제
**해결**:

```bash
# application.properties 확인
spring.datasource.url=jdbc:sqlite:${user.dir}/tmdb.db

# Backend 로그 확인
# "Hibernate: create table..." 메시지가 있어야 함
```

### 2. 댓글이 DB에 저장되지 않음

**원인**: 세션 없음 (로그인 안 함) 또는 트랜잭션 롤백
**해결**:

- 반드시 로그인 후 테스트
- Backend 로그에서 에러 메시지 확인
- `@Transactional` 어노테이션 확인

### 3. "401 Unauthorized" 에러

**원인**: 세션 쿠키가 전달되지 않음
**해결**:

```javascript
// axios.js에서 withCredentials 확인
withCredentials: true;
```

### 4. CORS 에러

**원인**: Backend에서 Frontend Origin 허용 안 함
**해결**:

```java
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
```

### 5. 비밀번호 로그인 실패 (기존 사용자)

**원인**: BCrypt 암호화 적용 후 기존 평문 비밀번호와 불일치
**해결**:

```sql
-- 기존 데이터 삭제 후 재가입
DELETE FROM users;
```

---

## 📊 DB 데이터 확인 쿼리 모음

### 사용자별 댓글 수

```sql
SELECT u.email, u.name, COUNT(mc.id) as comment_count
FROM users u
LEFT JOIN movie_comments mc ON u.id = mc.user_id
GROUP BY u.id;
```

### 영화별 댓글 수

```sql
SELECT m.title, COUNT(mc.id) as comment_count
FROM movies m
LEFT JOIN movie_comments mc ON m.id = mc.movie_id
GROUP BY m.id
ORDER BY comment_count DESC;
```

### 최근 댓글 5개

```sql
SELECT u.name, m.title, mc.content, mc.likes, mc.created_at
FROM movie_comments mc
JOIN users u ON mc.user_id = u.id
JOIN movies m ON mc.movie_id = m.id
ORDER BY mc.created_at DESC
LIMIT 5;
```

### 좋아요가 많은 댓글

```sql
SELECT u.name, m.title, mc.content, mc.likes
FROM movie_comments mc
JOIN users u ON mc.user_id = u.id
JOIN movies m ON mc.movie_id = m.id
ORDER BY mc.likes DESC
LIMIT 10;
```

---

## 🔐 보안 참고사항

1. **비밀번호 암호화**: BCryptPasswordEncoder 적용 완료
2. **세션 관리**: HttpSession 사용, 30분 타임아웃
3. **TMDB API Key**: 현재 하드코딩되어 있음 (환경변수 전환 권장)
4. **SQL Injection**: JPA/MyBatis 사용으로 기본 방어

---

## 📝 추가 개발 권장사항

1. **환경변수 분리**: `.env` 파일로 API Key 관리
2. **페이지네이션**: 댓글 목록이 많아질 경우 페이징 처리
3. **이미지 최적화**: TMDB 이미지 CDN 활용
4. **에러 바운더리**: React Error Boundary 추가
5. **로딩 상태 개선**: Skeleton UI 적용
6. **테스트 코드**: Unit Test & Integration Test 작성

---

## 📞 문의사항

문제 발생 시 Backend 로그와 Browser Console 로그를 함께 확인하세요.
