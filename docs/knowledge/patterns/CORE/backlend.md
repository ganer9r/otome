# Backend 패턴

## TDD 원칙

### RED → GREEN → REFACTOR
- **RED**: 실패하는 테스트 먼저 작성
- **GREEN**: 최소 코드로 테스트 통과  
- **REFACTOR**: 테스트 통과 유지하며 코드 개선

### 필수 규칙
- 테스트 우선 작성 필수
- describe와 it은 한글 사용

## 도메인 구조

```
/web/src/lib/domain/{domain}/
├── type.ts              # Zod 스키마 + TypeScript 타입
├── query.server.ts      # DB 접근 계층
├── usecase.server.ts    # 서버 비즈니스 로직
├── usecase.ts          # 클라이언트/서버 공용 로직
├── api.client.ts       # API 클라이언트
└── *.spec.ts          # 테스트 파일 (필수!)
```

## 명명 규칙

### query.server.ts (DB 접근)
```typescript
findUser(uid: string): Promise<User | null>      // 단일 조회
fetchUsers(limit: number): Promise<User[]>       // 다중 조회
insertUser(data: InsertUser): Promise<User>      // 생성
updateUser(uid: string, data: UpdateUser): Promise<User>  // 수정
deleteUser(uid: string): Promise<void>           // 삭제
```

### usecase.server.ts (비즈니스 로직)
```typescript
getProfile(uid: string): Promise<Profile>        // 조회 로직
canParticipate(uid: string): Promise<boolean>    // 검증 로직
addLottoEntry(data: LottoEntry): Promise<Result> // 추가 로직
modifyProfile(uid: string, data: Update): Promise<Profile> // 수정 로직
```

## svelteAction API 패턴

### API 엔드포인트
```typescript
import { svelteAction } from '$lib/framework/svelteAction';
import { authMiddleware } from '$lib/framework/middleware/authMiddleware';

export const POST = svelteAction.api({
  middlewares: [authMiddleware],
  form: schema,  // Zod 스키마
  handler: async ({ data, user }) => {
    return { success: true, data: result };
  }
});
```

### Form Action
```typescript
export const actions = {
  submit: svelteAction.form({
    middlewares: [authMiddleware],
    schema,  // Zod 스키마
    handler: async ({ data, user }) => {
      return { success: true, data: result };
    }
  })
};
```

## 테스트 패턴

### 기본 구조
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('도메인명', () => {
  it('한글로 테스트 설명', async () => {
    // Arrange (준비)
    // Act (실행)
    // Assert (검증)
  });
});
```

### DB 연결 테스트
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { supabase } from '$lib/supabase/supabase.server';

describe('DB 테스트', () => {
  let testUid: string;
  let testIds: number[] = [];

  beforeEach(() => {
    testUid = randomUUID();
    testIds = [];
  });

  afterEach(async () => {
    // 테스트 데이터 정리
    if (testIds.length > 0) {
      await supabase.from('table').delete().in('id', testIds);
    }
  });

  it('데이터를 생성한다', async () => {
    const result = await createData({ uid: testUid, value: 100 });
    testIds.push(result.id);  // 정리 대상 추가
    
    // DB에서 실제 조회하여 검증
    const { data } = await supabase
      .from('table')
      .select('*')
      .eq('id', result.id)
      .single();
    
    expect(data).toBeDefined();
  });
});
```

### 모킹 패턴
```typescript
import { vi } from 'vitest';

// Supabase 모킹
vi.mock('$lib/supabase/supabase.server', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData })
    }))
  }
}));
```

## 타입 패턴

### Zod 스키마와 타입
```typescript
import { z } from 'zod';

// Zod 스키마
export const userSchema = z.object({
  uid: z.string().uuid(),
  name: z.string().min(1),
  coins: z.number().nonnegative()
});

// TypeScript 타입
export type User = z.infer<typeof userSchema>;
export type DbUser = Supabase<'users'>;
```

## 날짜 처리 (dayjs 필수)

```typescript
import dayjs from 'dayjs';

// ✅ 올바른 패턴
dayjs().toISOString()
dayjs().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm')
dayjs().add(1, 'day')
dayjs().startOf('day')

// ❌ 금지
new Date()
```

## 필수 규칙

- **TDD**: 테스트 먼저 작성
- **도메인 분리**: 비즈니스 로직은 도메인 내부
- **타입 안전**: any 금지, Zod 검증 필수
- **날짜 처리**: dayjs만 사용
- **테스트 격리**: 각 테스트 독립 실행

## 절대 금지

- ❌ 테스트 없는 비즈니스 로직
- ❌ 테스트 수정으로 문제 해결
- ❌ describe.skip, it.only 커밋
- ❌ new Date() 사용
- ❌ any 타입 사용