# 영화 리뷰 사이트 (Movie Review Site)

TMDB API를 활용한 영화 리뷰 및 커뮤니티 사이트입니다.

## 🎬 주요 기능

### 1. 회원 관리

- **회원가입**: 아이디, 이메일, 비밀번호로 가입
- **로그인/로그아웃**: 세션 기반 인증
- **사용자 정보**: 작성한 리뷰, 댓글, 게시글 관리

### 2. 영화 검색 및 정보

- TMDB API를 통한 실시간 영화 데이터
- 영화 제목, 장르, 개봉일, 배우별 검색
- 영화 상세 정보 (줄거리, 평점, 장르, 러닝타임 등)

### 3. 영화 리뷰 시스템

- **리뷰 작성**: 1-10점 평점과 텍스트 리뷰 작성
- **리뷰 수정/삭제**: 본인이 작성한 리뷰만 수정/삭제 가능
- **리뷰 목록**: 각 영화별 리뷰 목록 조회
- **댓글 기능**: 리뷰에 댓글 작성, 수정, 삭제

### 4. 커뮤니티 게시판

- **자유게시판**: 자유로운 이야기
- **추천영화**: 재미있게 본 영화 추천
- **질문게시판**: 궁금한 것을 물어보는 공간
- 게시글 작성, 수정, 삭제, 조회수 카운트

## 🛠 기술 스택

### Backend

- **Java 17** + **Spring Boot 3.0.6**
- **Spring Security**: 세션 기반 인증
- **Spring Data JPA**: ORM
- **SQLite**: 데이터베이스
- **Maven**: 빌드 도구

### Frontend

- **React 18**
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트
- **Bootstrap 5**: UI 프레임워크

### 데이터베이스 구조

- **users**: 사용자 정보
- **movie_reviews**: 영화 리뷰
- **comments**: 리뷰 댓글
- **boards**: 게시판 카테고리
- **board_posts**: 게시판 글

## 📦 설치 및 실행

### 1. 백엔드 실행

```bash
cd /Users/su/Documents/TMDB_project
./mvnw spring-boot:run
```

백엔드 서버가 `http://localhost:8080`에서 실행됩니다.

### 2. 프론트엔드 실행

```bash
cd /Users/su/Documents/TMDB_project/movie-app
npm install  # 처음 한 번만
npm start
```

프론트엔드가 `http://localhost:3000`에서 실행되고 자동으로 브라우저가 열립니다.

## 📝 사용 방법

### 1. 회원가입 및 로그인

1. 홈페이지 접속 (`http://localhost:3000`)
2. 우측 상단 "회원가입" 클릭
3. 아이디(3자 이상), 이메일, 비밀번호(6자 이상) 입력
4. 로그인 페이지에서 로그인

### 2. 영화 검색 및 리뷰 작성

1. 상단 메뉴에서 "영화 검색" 클릭
2. 영화 제목, 장르, 개봉일, 배우로 검색
3. 영화 카드 클릭하여 상세 페이지 이동
4. "리뷰 작성" 버튼 클릭
5. 평점(1-10)과 리뷰 내용(10-2000자) 작성
6. "작성" 버튼으로 리뷰 저장

### 3. 리뷰에 댓글 달기

1. 영화 상세 페이지의 리뷰 목록에서 "댓글 보기" 클릭
2. 댓글 입력란에 내용 작성 (최대 500자)
3. "작성" 버튼 클릭

### 4. 게시판 이용

1. 상단 메뉴에서 "게시판" 클릭
2. 원하는 게시판 선택 (자유게시판, 추천영화, 질문게시판)
3. "글쓰기" 버튼으로 게시글 작성
4. 제목(최대 200자)과 내용(최대 5000자) 입력
5. 게시글 제목 클릭하여 상세 보기

### 5. 게시판 초기화 (처음 실행 시)

1. "게시판" 메뉴 클릭
2. "게시판 초기화" 버튼 클릭
3. 3개의 기본 게시판이 생성됩니다

## 🔧 API 엔드포인트

### 인증 관련

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 로그인한 사용자 정보

### 리뷰 관련

- `GET /api/reviews/movie/{movieId}` - 특정 영화의 리뷰 목록
- `GET /api/reviews/user/{userId}` - 특정 사용자의 리뷰 목록
- `POST /api/reviews` - 리뷰 작성 (로그인 필요)
- `PUT /api/reviews/{id}` - 리뷰 수정 (작성자만)
- `DELETE /api/reviews/{id}` - 리뷰 삭제 (작성자만)

### 댓글 관련

- `GET /api/comments/review/{reviewId}` - 리뷰의 댓글 목록
- `POST /api/comments/review/{reviewId}` - 댓글 작성 (로그인 필요)
- `PUT /api/comments/{id}` - 댓글 수정 (작성자만)
- `DELETE /api/comments/{id}` - 댓글 삭제 (작성자만)

### 게시판 관련

- `GET /api/boards` - 전체 게시판 목록
- `GET /api/boards/{boardId}/posts` - 특정 게시판의 게시글 목록
- `POST /api/boards/{boardId}/posts` - 게시글 작성 (로그인 필요)
- `PUT /api/boards/posts/{postId}` - 게시글 수정 (작성자만)
- `DELETE /api/boards/posts/{postId}` - 게시글 삭제 (작성자만)
- `POST /api/boards/init` - 게시판 초기화 (개발용)

## 📊 데이터베이스

모든 데이터는 프로젝트 루트의 `movie_database.db` SQLite 파일에 저장됩니다.

### 데이터베이스 초기화

데이터를 초기화하려면 `movie_database.db` 파일을 삭제하고 서버를 재시작하세요.

```bash
rm movie_database.db
./mvnw spring-boot:run
```

## 🔐 보안

- 비밀번호는 BCrypt로 암호화되어 저장
- 세션 기반 인증 (Spring Security + Spring Session JDBC)
- CORS 설정으로 localhost:3000만 허용
- 리뷰, 댓글, 게시글은 작성자만 수정/삭제 가능

## 🐛 디버깅

### 데이터베이스 확인

- `http://localhost:8080/debug/purchases` - Purchase 테이블 조회

### 로그 확인

백엔드 터미널에서 SQL 쿼리와 Hibernate 로그를 확인할 수 있습니다.

## 🎨 주요 화면

1. **홈**: 영화 검색 및 사이트 소개
2. **로그인/회원가입**: 사용자 인증
3. **영화 검색**: TMDB 영화 검색
4. **영화 상세**: 영화 정보 + 리뷰 + 댓글
5. **게시판 목록**: 게시판 카테고리
6. **게시판 상세**: 게시글 목록 및 작성

## 📱 반응형 디자인

Bootstrap 5를 사용하여 모바일, 태블릿, 데스크탑 모두 지원합니다.

## 🚀 향후 개선 사항

- 좋아요/싫어요 기능
- 사용자 프로필 페이지
- 영화 즐겨찾기
- 리뷰 정렬 기능 (최신순, 평점순)
- 게시글 검색 기능
- 이미지 업로드
- 관리자 페이지

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
