# Task: 인증 시스템 구축
# Folder: authentication-system

## 요구사항 요약
- **Supabase 이메일/비밀번호 인증** 사용
- **public.app_user** 테이블에 사용자 저장
- **인증 플로우**: Supabase Auth 완료 → app_user 생성 → 가입 완료
- **authMiddleware/+page.server.ts**: app_user 기준으로 체크
- **app_user 없으면 튕겨내기**
- **모든 스키마는 character_system.sql에 추가**

## 데이터 모델

### app_user 테이블
```sql
CREATE TABLE "public"."app_user" (
  "id" uuid DEFAULT uuid_generate_v7() NOT NULL,
  "uid" uuid NOT NULL,           -- Supabase Auth UID
  "email" text NOT NULL,
  "nickname" text,
  "profile_img" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("uid"),
  UNIQUE ("email")
);
```

### 인증 플로우
1. 이메일/비밀번호로 Supabase Auth 회원가입
2. app_user 테이블에 레코드 생성
3. 로그인 시 app_user 존재 확인
4. app_user 없으면 `/auth/signup` 리다이렉트
5. 보호된 라우트는 app_user 필수

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 완료
- [x] 데이터베이스 설계 완료

### Phase 1: Database (3개) ✅
- [x] character_system.sql에 app_user 테이블 추가
- [x] app_user RLS 정책 설정 (server-only access)
- [x] Supabase 타입 생성 (gen types)

### Phase 2: Backend Core (5개)
- [x] hooks.server.ts 구현 (Supabase 클라이언트 + authGuard)
- [x] app.d.ts 타입 확장 (AppUser, safeGetSession)
- [x] types.ts 생성 (AppUser 타입 정의)
- [x] user 도메인 - usecase.server.ts (findUser, createUser)
- [x] authMiddleware 업데이트 (app_user 체크)

### Phase 3: Frontend Auth (6개)
- [x] 루트 레이아웃 수정 (+layout.server.ts)
- [x] 로그인 페이지 (/auth/+page.svelte)
- [x] 로그인 액션 (/auth/+page.server.ts)
- [x] 회원가입 페이지 (/auth/signup/+page.svelte)
- [x] 회원가입 액션 (/auth/signup/+page.server.ts)
- [x] 사용자 스토어 생성 (userStore.ts)

### Phase 4: Route Protection (5개)
- [x] Phase 3 코드 검증 (pnpm check + 타입 에러 수정)
- [x] User domain TDD 테스트 작성 및 실행
- [x] /characters 라우트 보호 (+layout.server.ts)
- [x] 로그인/회원가입 플로우 테스트
- [x] 보호된 라우트 접근 제어 검증

## 생성/수정될 파일

### Database
- `supabase/migrations/20251028174001_character_system.sql` (수정)

### Backend
- `src/hooks.server.ts` (수정)
- `src/app.d.ts` (수정)
- `src/lib/types.ts` (생성)
- `src/lib/domain/user/usecase.server.ts` (생성)
- `src/lib/domain/user/query.server.ts` (생성)
- `src/lib/framework/middleware/authMiddleware.ts` (수정)

### Frontend
- `src/routes/+layout.server.ts` (생성)
- `src/routes/auth/+page.svelte` (생성)
- `src/routes/auth/+page.server.ts` (생성)
- `src/routes/auth/signup/+page.svelte` (생성)
- `src/routes/auth/signup/+page.server.ts` (생성)
- `src/routes/characters/+layout.server.ts` (생성)
- `src/lib/stores/userStore.ts` (생성)

## 작업 예상 시간
- Phase 1: 30분
- Phase 2: 1시간
- Phase 3: 1시간
- Phase 4: 30분
- **총 예상 시간**: 3시간
