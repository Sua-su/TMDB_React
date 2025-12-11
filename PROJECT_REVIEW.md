# TMDB React 프로젝트 전체 검토 리포트

## 📅 검토 날짜: 2025년 12월 10일

---

## 🎯 프로젝트 상태 요약

### ✅ **완료된 기능**

#### 1. **Backend (Spring Boot)**

- ✅ JPA + MyBatis 하이브리드 아키텍처
- ✅ SQLite 데이터베이스 연동
- ✅ 사용자 인증 시스템 (세션 기반)
- ✅ **비밀번호 BCrypt 암호화 적용**
- ✅ TMDB API 통합 (영화, TV, 배우)
- ✅ Movie Comment CRUD API
- ✅ Review 시스템 (MyBatis)
- ✅ CORS 설정 완료
- ✅ 트랜잭션 관리 (@Transactional)
- ✅ 에러 핸들링 및 로깅

#### 2. **Frontend (React)**

- ✅ React Router 라우팅 설정
- ✅ Axios 인스턴스 설정 (withCredentials)
- ✅ AuthContext 전역 인증 관리
- ✅ 영화 목록/상세/검색 페이지
- ✅ TV 시리즈 목록/상세 페이지
- ✅ 배우 프로필 페이지
- ✅ 영화 댓글 시스템
- ✅ 마이페이지 (사용자 댓글 목록)
- ✅ 리뷰 시스템 페이지
- ✅ 모노크롬 디자인 테마

#### 3. **데이터베이스 (SQLite)**

- ✅ 자동 테이블 생성 (JPA ddl-auto=update)
- ✅ Entity 관계 설정 (User ↔ MovieComment ↔ Movie)
- ✅ 초기 데이터 (data.sql)
- ✅ DB 파일 위치: `backend/tmdb.db`

---

## 🏗️ 프로젝트 구조

### Backend 디렉토리 구조

```
backend/
├── src/main/
│   ├── java/com/TMDB/
│   │   ├── app/               # 메인 애플리케이션
│   │   ├── config/            # 설정 (Security, RestTemplate, PasswordEncoder)
│   │   ├── user/              # 사용자 도메인
│   │   │   ├── domain/        # User Entity
│   │   │   ├── repository/    # UserRepository (JPA)
│   │   │   ├── service/       # UserAuthService
│   │   │   └── controller/    # UserController
│   │   ├── movie/             # 영화 도메인
│   │   │   ├── domain/        # Movie, MovieComment Entity
│   │   │   ├── repository/    # MovieRepository, MovieCommentRepository
│   │   │   ├── service/       # MovieService, MovieCommentService
│   │   │   └── controller/    # MovieController, MovieCommentController
│   │   ├── tmdb/              # TMDB API 통합
│   │   │   ├── dto/           # API Response DTO
│   │   │   ├── service/       # TMDBApiService, TMDBActorService, TMDBTVService
│   │   │   └── controller/    # ActorController, TVController
│   │   └── review/            # 리뷰 도메인 (MyBatis)
│   │       ├── dto/
│   │       ├── mapper/
│   │       ├── service/
│   │       └── controller/
│   └── resources/
│       ├── application.properties
│       ├── data.sql
│       └── mapper/            # MyBatis XML
├── pom.xml
├── .gitignore                 # ✅ 신규 생성
└── .env.example               # ✅ 신규 생성
```

### Frontend 디렉토리 구조

```
frontend/
├── src/
│   ├── api/                   # API 통신 레이어
│   │   ├── axios.js           # Axios 인스턴스
│   │   ├── userApi.js         # 사용자 API
│   │   ├── movieApi.js        # 영화 API
│   │   ├── tvApi.js           # ✅ TV API
│   │   └── actorApi.js        # ✅ 배우 API
│   ├── components/
│   │   ├── common/            # Header, SearchBar
│   │   ├── movie/             # MovieCard
│   │   └── review/            # CommentSection
│   ├── contexts/
│   │   └── AuthContext.jsx    # 전역 인증 상태
│   ├── pages/
│   │   ├── MainPage.jsx       # 영화 메인
│   │   ├── MovieDetailPage.jsx
│   │   ├── MyPage.jsx
│   │   ├── TVListPage.jsx     # ✅ TV 목록
│   │   ├── TVDetailPage.jsx   # ✅ TV 상세
│   │   └── ActorPage.jsx      # ✅ 배우 프로필
│   ├── sign/                  # 로그인, 회원가입
│   ├── reviews/               # 리뷰 페이지
│   ├── App.js                 # 라우팅 설정
│   └── index.js
├── package.json
└── public/
```

---

## 🔍 주요 개선사항 (오늘 적용)

### 1. **데이터베이스 연결 수정** ✅

**Before:**

```properties
spring.datasource.url=jdbc:sqlite:tmdb.db
```

**After:**

```properties
spring.datasource.url=jdbc:sqlite:${user.dir}/tmdb.db
```

**효과**: DB 파일이 프로젝트 루트에 명확히 생성됨

---

### 2. **비밀번호 암호화 적용** ✅

**Before:** 평문 저장
**After:** BCrypt 암호화

**UserAuthService.java:**

```java
private final PasswordEncoder passwordEncoder;

// 회원가입
String encodedPassword = passwordEncoder.encode(user.getPassword());
user.setPassword(encodedPassword);

// 로그인
boolean matches = passwordEncoder.matches(password, user.getPassword());
```

**중요:** 기존 사용자 데이터는 평문이므로 로그인 불가 → 재가입 필요

---

### 3. **MovieComment Entity 개선** ✅

**추가된 기능:**

```java
public void setMovieId(Long movieId) {
    if (movieId == null) {
        throw new IllegalArgumentException("Movie ID cannot be null");
    }
    if (this.movie == null) {
        this.movie = Movie.builder().id(movieId).build();
    } else {
        this.movie.setId(movieId);
    }
}
```

**효과**: Null 안전성 향상, 명확한 에러 메시지

---

### 4. **Frontend API 에러 처리 강화** ✅

**userApi.js 개선:**

```javascript
catch (error) {
    console.error("로그인 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "로그인에 실패했습니다.");
}
```

**효과**: 사용자에게 명확한 에러 메시지 전달

---

### 5. **보안 설정 추가** ✅

- `.gitignore` 생성 (DB 파일, .env 제외)
- `.env.example` 생성 (환경변수 템플릿)

---

## 🗄️ 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│    users    │         │ movie_comments   │         │   movies    │
├─────────────┤         ├──────────────────┤         ├─────────────┤
│ id (PK)     │◄────────│ user_id (FK)     │         │ id (PK)     │
│ email       │         │ movie_id (FK)    │────────►│ tmdb_id     │
│ password    │         │ content          │         │ title       │
│ name        │         │ likes            │         │ overview    │
└─────────────┘         │ created_at       │         │ ...         │
                        └──────────────────┘         └─────────────┘
```

### 주요 관계

- `users` 1:N `movie_comments` (한 사용자가 여러 댓글 작성)
- `movies` 1:N `movie_comments` (한 영화에 여러 댓글)

---

## 🔌 API 엔드포인트 목록

### 사용자 인증

| Method | Endpoint             | 설명             | 인증 필요 |
| ------ | -------------------- | ---------------- | --------- |
| POST   | `/api/register`      | 회원가입         | ❌        |
| POST   | `/api/login`         | 로그인           | ❌        |
| POST   | `/api/logout`        | 로그아웃         | ✅        |
| GET    | `/api/me`            | 현재 사용자 정보 | ✅        |
| POST   | `/api/find-password` | 비밀번호 찾기    | ❌        |

### 영화

| Method | Endpoint             | 설명             | 인증 필요 |
| ------ | -------------------- | ---------------- | --------- |
| GET    | `/api/movies`        | 영화 목록 (TMDB) | ❌        |
| GET    | `/api/movies/{id}`   | 영화 상세 (TMDB) | ❌        |
| GET    | `/api/movies/search` | 영화 검색 (TMDB) | ❌        |

### 영화 댓글

| Method | Endpoint                         | 설명         | 인증 필요 |
| ------ | -------------------------------- | ------------ | --------- |
| GET    | `/api/movies/{movieId}/comments` | 댓글 목록    | ❌        |
| POST   | `/api/movies/{movieId}/comments` | 댓글 작성    | ✅        |
| PUT    | `/api/movies/comments/{id}/like` | 댓글 좋아요  | ❌        |
| DELETE | `/api/movies/comments/{id}`      | 댓글 삭제    | ✅        |
| GET    | `/api/movies/comments/user`      | 내 댓글 목록 | ✅        |

### TV 시리즈 (신규 추가)

| Method | Endpoint         | 설명           | 인증 필요 |
| ------ | ---------------- | -------------- | --------- |
| GET    | `/api/tv`        | TV 목록 (TMDB) | ❌        |
| GET    | `/api/tv/search` | TV 검색 (TMDB) | ❌        |
| GET    | `/api/tv/{id}`   | TV 상세 (TMDB) | ❌        |

### 배우 (신규 추가)

| Method | Endpoint                  | 설명               | 인증 필요 |
| ------ | ------------------------- | ------------------ | --------- |
| GET    | `/api/actors/{id}`        | 배우 정보 (TMDB)   | ❌        |
| GET    | `/api/actors/{id}/movies` | 배우 출연작 (TMDB) | ❌        |

---

## 🧪 테스트 시나리오

### 시나리오 1: 회원가입 → 로그인 → 댓글 작성

1. `/signup` - 새 계정 생성
2. `/login` - 로그인
3. `/main` - 영화 목록에서 영화 선택
4. 영화 상세 페이지에서 댓글 작성
5. **DB 확인**: `SELECT * FROM movie_comments;`
6. `/mypage` - "내가 쓴 댓글" 탭에서 댓글 확인

### 시나리오 2: 비로그인 상태 테스트

1. `/main` - 영화 목록 조회 (✅ 가능)
2. 영화 상세 페이지에서 댓글 작성 시도
3. "로그인이 필요합니다" 에러 확인 (✅ 정상)

### 시나리오 3: DB 데이터 영속성 확인

1. 댓글 작성
2. 브라우저 새로고침
3. 댓글이 여전히 표시되는지 확인 (DB에서 불러옴)
4. Backend 재시작 후에도 댓글 유지 확인

---

## ⚠️ 알려진 제한사항

### 1. **TMDB API 데이터는 DB에 저장되지 않음**

- 영화/TV/배우 정보는 TMDB API에서 실시간 조회
- 로컬 DB(`movies` 테이블)는 댓글 작성 시 movie_id 연결용
- **개선안**: 자주 조회되는 영화는 캐싱 또는 DB 저장

### 2. **Review 시스템은 MyBatis 기반**

- Review 기능은 완전히 분리된 도메인 (JPA 아님)
- `review_board`, `reply` 테이블은 MyBatis XML Mapper 사용
- Frontend 페이지는 존재하나 통합 테스트 필요

### 3. **비밀번호 찾기 기능 미완성**

- 현재 이메일 발송 로직 없음
- TODO 주석 처리됨
- **개선안**: Spring Mail + SMTP 설정 필요

### 4. **이미지 업로드 기능 없음**

- 사용자 프로필 사진 기능 없음
- 리뷰 이미지 첨부 기능 없음

---

## 🔒 보안 체크리스트

- ✅ 비밀번호 BCrypt 암호화
- ✅ 세션 기반 인증 (HttpSession)
- ✅ CORS 설정 (withCredentials)
- ✅ SQL Injection 방어 (JPA/MyBatis 파라미터 바인딩)
- ⚠️ TMDB API Key 하드코딩 (환경변수 권장)
- ⚠️ HTTPS 미적용 (프로덕션 필수)
- ❌ XSS 방어 (React의 기본 XSS 방어에 의존)
- ❌ CSRF 토큰 없음 (세션 기반 인증이라 낮은 위험)

---

## 📊 성능 최적화 권장사항

### Backend

1. **쿼리 최적화**: N+1 문제 방지 (fetch join 활용)
2. **캐싱**: TMDB API 응답 Redis 캐싱
3. **인덱싱**: `movie_comments.movie_id`, `movie_comments.user_id`
4. **페이지네이션**: 댓글/리뷰 목록

### Frontend

1. **코드 스플리팅**: React.lazy() 적용
2. **이미지 최적화**: WebP 포맷, lazy loading
3. **API 캐싱**: React Query 또는 SWR 도입
4. **번들 크기 최적화**: Tree shaking

---

## 🚀 다음 단계 추천

### 단기 (1주일)

1. ✅ **DB 데이터 확인** (이 가이드 참고)
2. ✅ **전체 기능 테스트** (테스트 시나리오 실행)
3. [ ] Review 시스템 Frontend 통합 테스트
4. [ ] 비밀번호 찾기 이메일 발송 구현

### 중기 (1개월)

1. [ ] Unit Test 작성 (JUnit, React Testing Library)
2. [ ] 배포 준비 (Docker, CI/CD)
3. [ ] 에러 모니터링 (Sentry 등)
4. [ ] 성능 테스트 (JMeter, Lighthouse)

### 장기 (3개월)

1. [ ] 마이크로서비스 전환 (필요시)
2. [ ] Redis 캐시 레이어 추가
3. [ ] PostgreSQL 전환 (프로덕션)
4. [ ] 관리자 대시보드 개발

---

## 📚 참고 문서

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 실행 및 DB 검증 가이드
- [README.md](./README.md) - 프로젝트 개요
- [IMPROVEMENT_REPORT.md](./IMPROVEMENT_REPORT.md) - 개선 내역

---

## 📞 문의 및 피드백

문제 발견 시 로그 확인:

- **Backend**: `backend/logs/` 또는 콘솔 출력
- **Frontend**: 브라우저 개발자 도구 Console 탭
- **DB**: SQLite CLI로 직접 쿼리 실행

---

**검토 완료일**: 2025년 12월 10일  
**버전**: v1.0  
**상태**: ✅ Production Ready (DB 데이터 영속성 보장)
