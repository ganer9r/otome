# svelteAction.api 패턴

## Metadata
- Created: 2025-10-30
- Usage: 1
- Status: REVIEW
- Last Used: 2025-10-30
- Project: otome

## 문제
SvelteKit API 엔드포인트에서 타입 안전한 요청/응답 처리와 Zod 검증이 필요

## 해결책

### 1. Zod 스키마 정의
```typescript
// src/lib/domain/auth/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.')
});
```

### 2. API 엔드포인트
```typescript
// src/routes/api/auth/login/+server.ts
import { svelteAction } from '$lib/framework/svelteAction';
import { loginSchema } from '$lib/domain/auth/schemas';
import { login } from '$lib/domain/auth/usecase.server';

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

### 3. API 클라이언트
```typescript
// src/lib/domain/auth/api.client.ts
import { ApiClient } from '$lib/framework/apiClient';
import type { POST as PostLogin } from '$routes/api/auth/login/+server';

export class AuthApi extends ApiClient {
  async login(email: string, password: string) {
    return await this.post<typeof PostLogin>(
      '/api/auth/login',
      { email, password }
    );
  }
}
```

### 4. 클라이언트 사용
```typescript
// src/routes/auth/+page.svelte
const authApi = new AuthApi(fetch);
const result = await authApi.login(email, password);
// result는 완벽한 타입 추론됨
```

## 장점
- Zod 자동 검증
- typeof 추론으로 완벽한 타입 안전성
- 에러 핸들링 통합
- 재사용 가능한 클라이언트

## 주의사항
- form 파라미터는 Zod 스키마만 가능
- typeof 추론 시 엔드포인트 import 필요
- ApiClient 상속 필수

## 비교: Form Actions vs API 패턴
| 특징 | Form Actions | API 패턴 |
|------|--------------|----------|
| 타입 추론 | 제한적 | 완벽 |
| Progressive Enhancement | O | X |
| 클라이언트 재사용 | X | O |
| 복잡한 로직 | 어려움 | 쉬움 |

## 관련 패턴
- 도메인 레이어 패턴
- API 클라이언트 상속 패턴
