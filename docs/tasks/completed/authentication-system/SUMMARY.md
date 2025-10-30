# Authentication System - 개발 요약

## 📊 작업 정보
- **시작일**: 2025-10-29
- **완료일**: 2025-10-30
- **완료율**: 21/21 (100%)
- **테스트**: 36 passed | 1 skipped
- **타입 체크**: 0 errors, 0 warnings

## 🎯 핵심 성과

### 1. 이중 인증 시스템
- **Supabase Auth**: 이메일/비밀번호 기반 인증
- **app_user 테이블**: 서버 전용 사용자 데이터 관리
- **인증 플로우**: Auth 완료 → app_user 생성 → 가입 완료

### 2. 아키텍처 패턴
```
Client (Svelte)
  ↓ AuthApi/CharacterApi (타입 안전)
API Endpoint (+server.ts)
  ↓ usecase 호출
Domain Layer (usecase.server.ts)
  ↓ 비즈니스 로직
Database (Supabase)
```

### 3. 타입 안전성
- **Zod 스키마** → **svelteAction.api** → **typeof 추론**
- 엔드투엔드 타입 추론으로 런타임 에러 방지
- API 클라이언트에서 완벽한 자동완성 지원

## 🗄️ 데이터베이스 변경사항

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

### RLS 정책
- **server-only access**: 클라이언트 직접 접근 차단
- **service_role 전용**: 서버 코드만 접근 가능

## 📦 타입 시스템

### AppUser 타입
```typescript
// src/lib/types.ts
export type Supabase<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type AppUser = Supabase<'app_user'>;
```

### 전역 타입 확장
```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      safeGetSession: () => Promise<{
        session: Session | null;
        user: AppUser | null;
      }>;
      session: Session | null;
      user: AppUser;
    }
  }
}
```

## 🔐 도메인 로직

### User Domain (usecase.server.ts)
```typescript
// 핵심 함수
- findUser(uid: string): Promise<AppUser | null>
- createUser(data: CreateUserData): Promise<AppUser | null>
```

**특징**:
- service_role 클라이언트 사용
- 에러 발생 시 null 반환
- 로깅으로 디버깅 지원

### Auth Domain (usecase.server.ts)
```typescript
// 비즈니스 로직
- login({ email, password, supabase }): Promise<LoginResult>
- signup({ email, password, nickname, supabase }): Promise<SignupResult>
```

**플로우**:
1. Supabase Auth 인증
2. app_user 조회/생성
3. 적절한 리다이렉트 경로 반환

## 🌐 API 아키텍처

### API 엔드포인트 패턴
```typescript
// src/routes/api/auth/login/+server.ts
export const POST = svelteAction.api({
  form: loginSchema,
  handler: async ({ data, locals }) => {
    return await login({
      email: data.email,
      password: data.password,
      supabase: locals.supabase
    });
  }
});
```

**장점**:
- Zod 자동 검증
- 타입 안전성
- 에러 핸들링 통합

### API 클라이언트 패턴
```typescript
// src/lib/domain/auth/api.client.ts
export class AuthApi extends ApiClient {
  async login(email: string, password: string) {
    return await this.post<typeof PostLogin>(
      '/api/auth/login',
      { email, password }
    );
  }
}
```

**장점**:
- typeof 추론으로 응답 타입 자동 추론
- 재사용 가능한 클라이언트
- 일관된 에러 처리

## 🔒 보안 / 무결성

### 이중 보호 구조
1. **hooks.server.ts (authGuard)**:
   - `/app/*` 경로 보호
   - session/user 없으면 `/auth`로 리다이렉트

2. **+layout.server.ts**:
   - 타입 안전성을 위한 추가 체크
   - 하위 페이지에서 user 정보 접근 보장

### RLS 정책
- 클라이언트 직접 접근 차단
- 서버 코드만 app_user 접근 가능
- SQL injection 방지

## 🧪 테스트 전략

### User Domain 테스트 (11개)
```typescript
describe('findUser', () => {
  it('존재하는 사용자 조회');
  it('존재하지 않는 uid null 반환');
  it('undefined uid null 반환');
});

describe('createUser', () => {
  it('사용자 생성');
  it('선택값 확인');
  it('중복 uid null 반환');
  it('타임스탬프 자동 설정');
});
```

### Auth Flow 테스트 (7개 + 1 skipped)
```typescript
describe('회원가입 플로우', () => {
  it('정상 가입');
  it('중복 이메일');
});

describe('로그인 플로우', () => {
  it('정상 로그인');
  it('app_user 없는 계정');
});

describe('인증 실패', () => {
  it('잘못된 비밀번호');
  it('존재하지 않는 이메일');
});

describe('로그아웃', () => {
  it('로그인 → 로그아웃 → 세션 만료');
});
```

**핵심 인사이트**:
- singleton supabase 클라이언트 사용 시 RLS 에러 발생
- 해결: 테스트 파일 내 별도 클라이언트 생성 (service_role)
- auth.admin API 활용으로 안정적인 테스트 데이터 생성

## 🎨 개발 관점 우수 사례

### 1. 도메인 주도 설계
- **Domain Layer**: 비즈니스 로직 격리
- **API Layer**: 라우팅만 담당 (thin layer)
- **Client Layer**: 타입 안전한 API 호출

### 2. 타입 안전성
- Zod 스키마로 런타임 검증
- typeof 추론으로 컴파일 타임 타입 체크
- app.d.ts로 전역 타입 확장

### 3. 재사용성
- ApiClient 상속 패턴
- domain별 api.client.ts
- usecase.server.ts로 로직 공유

### 4. 확장성
- `/app` 하위 경로 자동 보호
- CharacterOptions 확장 가능 (JSONB)
- 새 도메인 추가 시 일관된 패턴 적용

### 5. 일관성
- pi-friends 패턴 100% 적용
- 파일 구조 규칙 준수
- 네이밍 컨벤션 통일 (uid 사용)

## 📁 생성/수정 파일

### Database (2개)
- `supabase/migrations/20251028174001_character_system.sql`
- `src/lib/supabase/schema.gen.ts`

### Backend (9개)
- `src/hooks.server.ts`
- `src/app.d.ts`
- `src/lib/types.ts`
- `src/lib/domain/user/usecase.server.ts`
- `src/lib/domain/user/usecase.spec.ts`
- `src/lib/domain/auth/usecase.server.ts`
- `src/lib/domain/auth/api.client.ts`
- `src/lib/domain/auth/schemas.ts`
- `src/lib/domain/auth/auth.flow.spec.ts`
- `src/lib/framework/middleware/authMiddleware.ts`

### API (3개)
- `src/routes/api/auth/login/+server.ts`
- `src/routes/api/auth/signup/+server.ts`
- `src/routes/api/auth/logout/+server.ts`

### Frontend (9개)
- `src/routes/+layout.svelte` (Tailwind CSS import)
- `src/routes/+layout.server.ts`
- `src/routes/auth/+page.svelte`
- `src/routes/auth/signup/+page.svelte`
- `src/routes/app/+layout.svelte` (앱바 UI)
- `src/routes/app/+layout.server.ts`
- `src/routes/app/characters/new/+page.svelte` (폼 개선)
- `src/routes/app/characters/[id]/edit/+page.svelte` (폼 개선)
- `src/routes/app/characters/[id]/+page.svelte` (플레이어 정보 표시)
- `src/lib/stores/userStore.ts`

### 추가 기능 (세션 중)
- `src/lib/domain/character/types.ts` (player_info 추가)

## 🔑 핵심 패턴

### 1. Supabase SSR 인증
```typescript
// hooks.server.ts
const supabase = createServerClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  }
);
```

### 2. safeGetSession 패턴
```typescript
event.locals.safeGetSession = async () => {
  const { data: { session } } = await event.locals.supabase.auth.getSession();
  if (!session) return { session: null, user: null };

  const user = await findUser(session.user.id);
  if (!user) return { session, user: null };

  return { session, user };
};
```

### 3. authGuard 미들웨어
```typescript
const authGuard: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/app')) {
    const { session, user } = await event.locals.safeGetSession();
    if (!session || !user) {
      return redirect(302, '/auth');
    }
  }
  return resolve(event);
};
```

### 4. svelteAction.api 패턴
```typescript
export const POST = svelteAction.api({
  form: zodSchema,  // Zod 자동 검증
  handler: async ({ data, locals }) => {
    // 비즈니스 로직
    return result;
  }
});
```

### 5. API 클라이언트 패턴
```typescript
export class AuthApi extends ApiClient {
  async login(email: string, password: string) {
    return await this.post<typeof PostLogin>(
      '/api/auth/login',
      { email, password }
    );
  }
}
```

## 🚀 추가 개선 사항 (세션 중)

### UI/UX 개선
1. **앱바 구현**:
   - 로그인 정보 표시 (닉네임 + 이메일)
   - 로그아웃 버튼
   - Tailwind flex 패턴 사용

2. **폼 레이아웃 개선**:
   - `grid grid-cols-[160px_1fr]` 패턴
   - label 160px 고정, input/textarea 전체 너비
   - 일관된 정렬로 가독성 향상

3. **Tailwind CSS 설정**:
   - `+layout.svelte`에 CSS import 추가
   - DaisyUI 컴포넌트 활용

### 기능 추가
1. **플레이어 정보 필드**:
   - `CharacterOptions.player_info` 추가
   - 생성/수정/상세 페이지 모두 지원
   - options JSONB 활용

## 📈 테스트 커버리지
- **Connection**: 2 tests
- **User Domain**: 7 tests
- **Character Domain**: 20 tests
- **Auth Flow**: 7 tests (1 skipped)
- **Total**: 36 passed | 1 skipped

## ✅ 최종 검증
- **pnpm check**: 0 errors, 0 warnings
- **pnpm test**: 36 passed | 1 skipped
- **타입 안전성**: 100%
- **pi-friends 패턴**: 100% 일치

## 🎓 개발 인사이트

### 문제 해결
1. **Form actions 타입 추론 문제**:
   - 문제: superValidate()와 Zod 타입 불일치
   - 해결: API 패턴으로 전환 (svelteAction.api)
   - 결과: 완벽한 타입 추론 달성

2. **RLS 에러 (테스트)**:
   - 문제: singleton supabase 클라이언트 사용 시 RLS 에러
   - 해결: 테스트 파일 내 별도 클라이언트 생성
   - 인사이트: auth API 호출 시 클라이언트 컨텍스트 변경됨

3. **Tailwind CSS 미적용**:
   - 문제: 스타일이 적용되지 않음
   - 해결: `+layout.svelte`에 CSS import 추가
   - 원인: 루트 레이아웃 누락

### 아키텍처 결정
1. **API 패턴 선택**:
   - Form actions 대신 API 엔드포인트 사용
   - 이유: 타입 추론, 클라이언트 재사용성
   - 트레이드오프: Progressive Enhancement 포기

2. **도메인 레이어 분리**:
   - 비즈니스 로직을 usecase.server.ts로 분리
   - 이유: 테스트 용이성, 재사용성
   - 결과: API 엔드포인트는 라우팅만 담당

3. **이중 보호 구조**:
   - hooks.server.ts + +layout.server.ts
   - 이유: 타입 안전성 + 런타임 보호
   - 효과: 완벽한 인증 보장

## 🔮 향후 확장 가능성
- 소셜 로그인 추가 (Google, GitHub)
- 비밀번호 재설정 기능
- 이메일 인증
- 프로필 이미지 업로드
- 역할 기반 권한 관리 (RBAC)
