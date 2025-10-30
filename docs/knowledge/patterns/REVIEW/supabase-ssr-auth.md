# Supabase SSR 인증 패턴

## Metadata
- Created: 2025-10-30
- Usage: 1
- Status: REVIEW
- Last Used: 2025-10-30
- Project: otome

## 문제
SvelteKit SSR 환경에서 Supabase 인증을 구현할 때 쿠키 기반 세션 관리가 필요

## 해결책

### 1. hooks.server.ts 설정
```typescript
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
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

  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    if (!session) return { session: null, user: null };

    const user = await findUser(session.user.id);
    if (!user) return { session, user: null };

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};
```

### 2. app.d.ts 타입 정의
```typescript
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

### 3. authGuard 미들웨어
```typescript
const authGuard: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/app')) {
    const { session, user } = await event.locals.safeGetSession();
    if (!session || !user) {
      return redirect(302, '/auth');
    }
    event.locals.session = session;
    event.locals.user = user;
  }
  return resolve(event);
};

export const handle = sequence(supabase, authGuard);
```

## 장점
- 서버/클라이언트 세션 공유
- 타입 안전성
- 자동 쿠키 관리
- SSR 지원

## 주의사항
- filterSerializedResponseHeaders 필수
- safeGetSession에서 app_user 검증 필요
- cookies.set 시 path: '/' 설정

## 관련 패턴
- API 클라이언트 패턴
- 도메인 레이어 패턴
