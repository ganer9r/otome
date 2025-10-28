# 아키텍처 결정 사항

## 프로젝트 구조

### 모노레포 구조
```
/app/              # Flutter 모바일 앱
/web/              # SvelteKit 웹앱  
/supabase/         # 데이터베이스
```

### 웹 애플리케이션 구조
```
/web/src/
├── routes/
│   ├── app/            # 사용자 앱 화면
│   │   ├── main/       # 메인 기능
│   │   ├── me/         # 마이페이지
│   │   ├── plays/      # 게임 (로또 등)
│   │   └── rewards/    # 보상 시스템
│   ├── api/            # API 엔드포인트
│   └── auth/           # 인증 관련
├── lib/
│   ├── (ui)/           # 공통 UI 컴포넌트
│   ├── domain/         # 도메인별 비즈니스 로직
│   ├── framework/      # 프레임워크 유틸리티
│   ├── stores/         # Svelte 스토어
│   ├── supabase/       # DB 클라이언트 & 타입
│   └── types.ts        # 공통 타입 정의
└── assets/             # 정적 리소스
    ├── images/
    └── icon/
```

### 도메인 구조 (DDD)
```
/web/src/lib/domain/{domain}/
├── type.ts              # 도메인 타입 정의
├── query.server.ts      # 데이터 접근 로직
├── usecase.server.ts    # 서버사이드 유스케이스
├── usecase.ts           # 클라이언트 유스케이스
├── api.client.ts        # API 클라이언트
└── *.spec.ts           # 테스트 파일
```

### 데이터베이스 구조
```
/supabase/
├── migrations/          # SQL 마이그레이션 파일
├── functions/          # Edge Functions
├── seed.sql           # 시드 데이터
└── config.toml        # Supabase 설정
```

### Flutter 앱 구조
```
/app/lib/
├── screens/           # 화면 컴포넌트
├── widgets/          # 재사용 위젯
├── services/         # 서비스 레이어
├── models/           # 데이터 모델
└── controllers/      # GetX 컨트롤러
```

## 핵심 기술 스택

### Frontend
- **Svelte 5 Runes** - 반응성 시스템
- **SvelteKit** - 풀스택 프레임워크
- **Tailwind CSS + DaisyUI** - 스타일링

### Backend
- **SvelteKit** - API 엔드포인트
- **Supabase** - 데이터베이스 & 인증
- **svelteAction** - API 프레임워크

### Mobile
- **Flutter** - 크로스플랫폼 앱
- **WebView** - 웹앱 통합
- **GetX** - 상태 관리

## 개발 원칙

### TDD (Test-Driven Development)
- RED → GREEN → REFACTOR 사이클
- 비즈니스 로직 필수
- UI 컴포넌트 제외

### Soft Delete
- 모든 테이블에 `deleted_at` 컬럼
- 데이터 복구 가능
- GDPR 대응은 별도 처리

### 타입 안전성
- TypeScript 엄격 모드
- Zod 스키마 검증
- Supabase 타입 자동 생성

## 명명 규칙

### 데이터베이스
- `uid` 사용 (user_id 대신)
- 인덱스: `{table}__{column}__idx`
- 제약: `{table}__{column}__fk`

### 메서드
- `findXXX`: 단일 조회
- `fetchXXX`: 복수 조회
- `insertXXX`: 생성
- `updateXXX`: 수정
- `deleteXXX`: 삭제

### API
- `getXXX`: 조회 로직
- `canXXX`: 검증 로직
- `addXXX`: 추가 로직
- `modifyXXX`: 수정 로직

## 날짜 처리
- **dayjs** 전용
- `new Date()` 절대 금지
- UTC 저장, 한국 시간 표시

## CSS 규칙
- PostCSS + Tailwind 필수
- `@reference "$styles/app.css"` 필수
- DaisyUI 컴포넌트 활용

## 절대 금지사항
- ❌ CASCADE (DB)
- ❌ CHECK 제약 (DB)
- ❌ new Date() 사용
- ❌ Svelte 4 문법
- ❌ 직접 fetch 호출