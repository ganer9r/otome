# Task: 캐릭터 시스템 구현
# Folder: character-system

## 요구사항 요약

**목표**: 사용자가 여러 개의 캐릭터를 생성/관리할 수 있는 시스템 구현

**핵심 기능**:
- 캐릭터 CRUD (생성, 조회, 수정, 삭제)
- 1:N 관계 (사용자 → 캐릭터)
- UUID v7 기반 ID 생성
- JSONB를 활용한 유연한 옵션 확장

**데이터 구조**:
- name: 캐릭터 이름
- info: 캐릭터 정보
- settings: 캐릭터 설정
- introduction: 캐릭터 도입부
- options: { chapter_guidelines: "..." } (확장 가능)

**보안**:
- RLS 활성화, 클라이언트 직접 접근 차단
- 모든 데이터 접근은 서버 API를 통해서만 (service_role)

---

## 📋 Master TodoList

### Phase 0: Modeling (4/4) ✅
- [x] 요구사항 분석 및 확인
- [x] 데이터베이스 설계 검증
- [x] 네이밍 컨벤션 확정
- [x] 파일 구조 설계

---

### Phase 1: Database (4개 작업)
**담당**: database-engineer

- [x] 마이그레이션 파일 생성
  - 명령어 실행: `supabase migration new character_system`
  - 생성된 파일: `supabase/migrations/YYYYMMDDHHMMSS_character_system.sql`
  - 이 파일에 다음 작업들의 SQL을 모두 작성

- [x] SQL 작성
  - **uuid_generate_v7() 함수 추가** (pi-friends 패턴)
    ```sql
    CREATE OR REPLACE FUNCTION "public"."uuid_generate_v7"() RETURNS "uuid"
    LANGUAGE "plpgsql" AS $$
    -- pi-friends의 uuid v7 함수 전체 복사
    $$;
    ```

  - **characters 테이블 생성**
    ```sql
    CREATE TABLE IF NOT EXISTS "public"."characters" (
      "id" uuid DEFAULT "public"."uuid_generate_v7"() NOT NULL,
      "uid" uuid NOT NULL,
      "name" text NOT NULL,
      "info" text,
      "settings" text,
      "introduction" text,
      "options" jsonb DEFAULT '{}'::jsonb,
      "created_at" timestamptz DEFAULT now() NOT NULL,
      "updated_at" timestamptz DEFAULT now() NOT NULL,
      CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
    );
    ```

  - **인덱스 생성**
    ```sql
    CREATE INDEX "characters__uid_created_at__idx"
      ON "public"."characters"
      USING btree ("uid", "created_at" DESC);
    ```

  - **RLS 활성화 (정책 없음 - 서버만 접근)**
    ```sql
    ALTER TABLE "public"."characters" ENABLE ROW LEVEL SECURITY;
    -- RLS 정책 생성하지 않음 → 클라이언트 직접 접근 차단
    -- 서버에서 service_role로만 접근 가능
    ```

  - **권한 부여**
    ```sql
    GRANT ALL ON TABLE "public"."characters" TO service_role;
    -- anon, authenticated에는 권한 부여 안 함
    ```

- [x] 마이그레이션 적용
  - 명령어 실행: `supabase migration up`
  - Supabase 로컬 DB에 테이블 생성 확인
  - RLS 활성화 확인 (클라이언트 접근 차단 확인)

- [x] TypeScript 타입 생성
  - 명령어 실행: `supabase gen types typescript --local > src/lib/supabase/schema.gen.ts`
  - schema.gen.ts에서 characters 타입 확인
  - `src/lib/domain/character/types.ts` 작성
    ```typescript
    import type { Database } from '$lib/supabase/schema.gen';

    // Supabase 생성 타입 재사용
    export type Character = Database['public']['Tables']['characters']['Row'];
    export type InsertCharacter = Database['public']['Tables']['characters']['Insert'];
    export type UpdateCharacter = Database['public']['Tables']['characters']['Update'];

    // 필요 시 추가 DTO (선택사항)
    export interface CreateCharacterDto {
      name: string;
      info?: string;
      settings?: string;
      introduction?: string;
      options?: {
        chapter_guidelines?: string;
      };
    }

    export type UpdateCharacterDto = Partial<CreateCharacterDto>;
    ```

---

### Phase 2: Backend (TDD) (11개 작업)
**담당**: backend-developer

#### 2-1. Usecase 테스트 작성 (Red)
- [x] `src/lib/domain/character/usecase.spec.ts` 생성
  - Supabase 연결 설정 (service_role 키 사용)
  - 테스트용 사용자 UID 준비

- [x] addCharacter 테스트 작성
  - UUID v7 생성 확인 (시간순 정렬 가능한지)
  - 캐릭터 생성 성공
  - options jsonb 저장 확인
  - name 필수값 확인

- [x] getCharacters 테스트 작성
  - 사용자별 캐릭터 목록 조회
  - 생성일자 내림차순 정렬 확인
  - 빈 배열 반환 확인 (데이터 없을 때)

- [x] getCharacter 테스트 작성
  - ID로 단일 캐릭터 조회
  - 존재하지 않는 ID는 null 반환
  - 타인 캐릭터도 조회 가능 (서버 로직에서 uid 검증)

- [x] updateCharacter 테스트 작성
  - 부분 업데이트 확인
  - options jsonb 업데이트 확인
  - updated_at 자동 업데이트 확인
  - 타인 캐릭터 수정 시 에러

- [x] deleteCharacter 테스트 작성
  - 캐릭터 삭제 성공
  - 타인 캐릭터 삭제 시 에러

#### 2-2. Usecase 구현 (Green)
- [x] `src/lib/domain/character/usecase.server.ts` 작성
  ```typescript
  import { uuidv7 } from 'uuidv7';
  import type { SupabaseClient } from '@supabase/supabase-js';
  import type { Character, CreateCharacterDto, UpdateCharacterDto } from './types';

  // addCharacter: uuidv7() 생성, DB 삽입, uid 검증
  export async function addCharacter(
    supabase: SupabaseClient,
    uid: string,
    dto: CreateCharacterDto
  ): Promise<Character> { ... }

  // getCharacters: uid 필터, created_at DESC 정렬
  export async function getCharacters(
    supabase: SupabaseClient,
    uid: string
  ): Promise<Character[]> { ... }

  // getCharacter: ID 조회, uid 검증
  export async function getCharacter(
    supabase: SupabaseClient,
    uid: string,
    id: string
  ): Promise<Character | null> { ... }

  // updateCharacter: 부분 업데이트, uid 검증
  export async function updateCharacter(
    supabase: SupabaseClient,
    uid: string,
    id: string,
    dto: UpdateCharacterDto
  ): Promise<Character> { ... }

  // deleteCharacter: 삭제, uid 검증
  export async function deleteCharacter(
    supabase: SupabaseClient,
    uid: string,
    id: string
  ): Promise<void> { ... }
  ```

- [x] 모든 테스트 통과 확인
  - 명령어: `pnpm test src/lib/domain/character/usecase.spec.ts`

#### 2-3. API 엔드포인트 구현
- [x] `src/routes/api/characters/+server.ts` 생성
  ```typescript
  import { addCharacter, getCharacters } from '$lib/domain/character/usecase.server';

  // POST: 캐릭터 생성
  export async function POST({ request, locals }) {
    const user = locals.user;
    if (!user) return new Response(null, { status: 401 });

    const dto = await request.json();
    const character = await addCharacter(locals.supabase, user.uid, dto);

    return new Response(JSON.stringify(character), { status: 201 });
  }

  // GET: 캐릭터 목록
  export async function GET({ locals }) {
    const user = locals.user;
    if (!user) return new Response(null, { status: 401 });

    const characters = await getCharacters(locals.supabase, user.uid);

    return new Response(JSON.stringify(characters), { status: 200 });
  }
  ```

- [x] `src/routes/api/characters/[id]/+server.ts` 생성
  ```typescript
  import { getCharacter, updateCharacter, deleteCharacter } from '$lib/domain/character/usecase.server';

  // GET: 단일 조회
  export async function GET({ params, locals }) {
    const user = locals.user;
    if (!user) return new Response(null, { status: 401 });

    const character = await getCharacter(locals.supabase, user.uid, params.id);
    if (!character) return new Response(null, { status: 404 });

    return new Response(JSON.stringify(character), { status: 200 });
  }

  // PATCH: 수정
  export async function PATCH({ params, request, locals }) {
    const user = locals.user;
    if (!user) return new Response(null, { status: 401 });

    const dto = await request.json();
    const character = await updateCharacter(locals.supabase, user.uid, params.id, dto);

    return new Response(JSON.stringify(character), { status: 200 });
  }

  // DELETE: 삭제
  export async function DELETE({ params, locals }) {
    const user = locals.user;
    if (!user) return new Response(null, { status: 401 });

    await deleteCharacter(locals.supabase, user.uid, params.id);

    return new Response(null, { status: 204 });
  }
  ```

#### 2-4. API Client 작성
- [x] `src/lib/domain/character/api.client.ts` 생성
  ```typescript
  import type { Character, CreateCharacterDto, UpdateCharacterDto } from './types';

  export class CharacterApiClient {
    constructor(private fetch: typeof fetch) {}

    async createCharacter(dto: CreateCharacterDto): Promise<Character> {
      const res = await this.fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      if (!res.ok) throw new Error('Failed to create character');
      return res.json();
    }

    async getCharacters(): Promise<Character[]> {
      const res = await this.fetch('/api/characters');
      if (!res.ok) throw new Error('Failed to fetch characters');
      return res.json();
    }

    async getCharacter(id: string): Promise<Character> {
      const res = await this.fetch(`/api/characters/${id}`);
      if (!res.ok) throw new Error('Failed to fetch character');
      return res.json();
    }

    async updateCharacter(id: string, dto: UpdateCharacterDto): Promise<Character> {
      const res = await this.fetch(`/api/characters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      if (!res.ok) throw new Error('Failed to update character');
      return res.json();
    }

    async deleteCharacter(id: string): Promise<void> {
      const res = await this.fetch(`/api/characters/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete character');
    }
  }
  ```

---

### Phase 3: Frontend (7개 작업)
**담당**: frontend-developer

- [x] 캐릭터 목록 페이지 생성
  - `src/routes/characters/+page.svelte`
    - CharacterApiClient 사용하지 않음 (SSR 데이터 사용)
    - 캐릭터 카드 목록 표시 (Grid 레이아웃)
    - "새 캐릭터 만들기" 버튼

  - `src/routes/characters/+page.server.ts`
    ```typescript
    import { getCharacters } from '$lib/domain/character/usecase.server';
    import type { PageServerLoad } from './$types';

    export const load: PageServerLoad = async ({ locals }) => {
      const user = locals.user;
      if (!user) throw redirect(302, '/login');

      const characters = await getCharacters(locals.supabase, user.uid);

      return { characters };
    };
    ```

- [x] 캐릭터 생성 페이지
  - `src/routes/characters/new/+page.svelte`
    - CharacterApiClient 사용
    - 폼: name, info, settings, introduction, chapter_guidelines
    - API POST 요청 (createCharacter)
    - 생성 후 목록으로 리다이렉트 (`goto('/characters')`)

- [x] 캐릭터 상세 페이지
  - `src/routes/characters/[id]/+page.svelte`
    - 읽기 모드로 캐릭터 정보 표시
    - 수정/삭제 버튼
    - Svelte 5 Runes로 상태 관리

  - `src/routes/characters/[id]/+page.server.ts`
    ```typescript
    import { getCharacter } from '$lib/domain/character/usecase.server';
    import type { PageServerLoad } from './$types';

    export const load: PageServerLoad = async ({ params, locals }) => {
      const user = locals.user;
      if (!user) throw redirect(302, '/login');

      const character = await getCharacter(locals.supabase, user.uid, params.id);
      if (!character) throw error(404, 'Character not found');

      return { character };
    };
    ```

- [x] 캐릭터 수정 기능
  - 수정 모드 토글 (Svelte 5 Runes)
  - 폼에 기존 데이터 채우기
  - CharacterApiClient.updateCharacter 호출
  - 낙관적 업데이트 적용

- [x] 캐릭터 삭제 기능
  - 삭제 확인 모달 (DaisyUI)
  - CharacterApiClient.deleteCharacter 호출
  - 삭제 후 목록으로 리다이렉트

- [x] UI 컴포넌트 작성
  - `src/routes/characters/(ui)/CharacterCard.svelte`
    ```svelte
    <script lang="ts">
      import type { Character } from '$lib/domain/character/types';

      let { character, onClick }: {
        character: Character;
        onClick?: () => void
      } = $props();
    </script>

    <div class="card bg-base-100 shadow-xl" on:click={onClick}>
      <div class="card-body">
        <h2 class="card-title">{character.name}</h2>
        <p>{character.info}</p>
      </div>
    </div>
    ```

  - `src/routes/characters/(ui)/CharacterForm.svelte`
    ```svelte
    <script lang="ts">
      import type { Character } from '$lib/domain/character/types';

      let {
        initialData = undefined,
        onSubmit
      }: {
        initialData?: Partial<Character>;
        onSubmit: (data: any) => void
      } = $props();

      let name = $state(initialData?.name || '');
      let info = $state(initialData?.info || '');
      let settings = $state(initialData?.settings || '');
      let introduction = $state(initialData?.introduction || '');
      let chapterGuidelines = $state(initialData?.options?.chapter_guidelines || '');
    </script>

    <form on:submit|preventDefault={() => onSubmit({
      name, info, settings, introduction,
      options: { chapter_guidelines: chapterGuidelines }
    })}>
      <!-- 폼 필드들 -->
    </form>
    ```

- [x] 반응형 디자인 적용
  - Tailwind CSS 그리드
  - 모바일: 1열, 태블릿: 2열, 데스크톱: 3열
  - DaisyUI 컴포넌트 활용

---

### Phase 4: 통합 & 검증 (3개 작업)
**담당**: 메인 Claude

- [x] 전체 시스템 통합 테스트
  - Supabase DB 테이블 확인
  - RLS 활성화 확인 (클라이언트 직접 접근 차단)
  - API 엔드포인트 동작 확인
  - UI 플로우 전체 확인 (생성 → 조회 → 수정 → 삭제)
  - API Client ↔ API ↔ Usecase 연결 확인

- [x] 테스트 커버리지 확인
  - 명령어: `pnpm test src/lib/domain/character/usecase.spec.ts`
  - 모든 테스트 통과 확인
  - API 응답 검증
  - 서버 전용 접근 확인

- [~] Git 커밋
  - `git add .`
  - 커밋 메시지: "feat: implement character system with CRUD operations"

---

## 기술 스택
- **Database**: PostgreSQL (Supabase), UUID v7
- **Backend**: SvelteKit, TypeScript, TDD (Vitest)
- **Frontend**: Svelte 5 (Runes), Tailwind CSS, DaisyUI
- **API Layer**: CharacterApiClient (fetch wrapper)
- **Security**: RLS 활성화 (서버 전용 접근)
- **Tools**: Supabase CLI, pnpm, uuidv7

## 파일 구조
```
src/
├── lib/
│   ├── domain/
│   │   └── character/
│   │       ├── types.ts              # Supabase 타입 재사용
│   │       ├── usecase.server.ts     # 비즈니스 로직
│   │       ├── usecase.spec.ts       # TDD 테스트
│   │       └── api.client.ts         # API 클라이언트
│   └── supabase/
│       └── schema.gen.ts             # Supabase 타입 (자동 생성)
└── routes/
    ├── characters/
    │   ├── (ui)/                     # UI 컴포넌트
    │   │   ├── CharacterCard.svelte
    │   │   └── CharacterForm.svelte
    │   ├── +page.svelte              # 목록 페이지
    │   ├── +page.server.ts           # 목록 SSR
    │   ├── new/
    │   │   └── +page.svelte          # 생성 페이지
    │   └── [id]/
    │       ├── +page.svelte          # 상세/수정 페이지
    │       └── +page.server.ts       # 상세 SSR
    └── api/
        └── characters/
            ├── +server.ts            # POST, GET (목록)
            └── [id]/
                └── +server.ts        # GET, PATCH, DELETE

supabase/
└── migrations/
    └── YYYYMMDDHHMMSS_character_system.sql
```

## 데이터 흐름
```
Frontend (Svelte)
  → CharacterApiClient (클라이언트 액션)
    → API Endpoint (/api/characters)
      → Usecase (비즈니스 로직)
        → Supabase DB (service_role, RLS 활성화)

+page.server.ts (SSR)
  → Usecase (비즈니스 로직)
    → Supabase DB (service_role, RLS 활성화)
```

## 보안 전략
- **RLS 활성화**: 클라이언트 직접 접근 차단
- **서버 전용**: 모든 DB 쿼리는 서버에서 service_role로 실행
- **UID 검증**: usecase 레이어에서 소유권 검증
- **인증 확인**: API 엔드포인트에서 locals.user 확인

## 예상 소요 시간
- Phase 1: 1시간
- Phase 2: 2.5-3.5시간
- Phase 3: 2-3시간
- Phase 4: 30분
- **총 예상**: 6-8시간
