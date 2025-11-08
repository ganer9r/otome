# Task: LLM 스크립트 생성 페이지
# Folder: llm-script-generation-page

## 요구사항 요약
캐릭터별로 LLM을 활용한 스크립트를 생성하고 DB에 저장하는 페이지 구현
- 경로: app/characters/[id]/script
- 캐릭터 정보 + 유저 정보를 프로필로 활용
- 사용자 요청(prompt) 입력 → 스크립트 생성 → DB 저장 → 결과 표시

## 데이터 모델
**scripts 테이블**
- id, uid, character_id, prompt, content, model, tokens_used, created_at

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 및 확인
- [x] 데이터베이스 설계 검증

### Phase 1: Database (3개)
- [x] scripts 테이블 마이그레이션 작성 (id, uid, character_id, prompt, content, model, tokens_used, created_at)
- [x] RLS 정책 설정 (server-only access)
- [x] 타입 생성 (supabase gen types)

### Phase 2: Backend - Domain Layer (4개)
- [x] `/lib/domain/script/types.ts` 작성 (Script, GenerateScriptParams 타입)
- [x] `/lib/domain/script/usecase.server.ts` 작성 (generateAndSaveScript 함수)
- [x] `/lib/domain/script/api.client.ts` 작성 (generateScript API 클라이언트)
- [x] 유틸 함수 작성 (buildCharacterProfile - 캐릭터+유저 정보 조합)

### Phase 3: Backend - API Endpoint (2개)
- [x] `POST /api/scripts/generate` 엔드포인트 구현
- [x] Zod 스키마 검증 추가 (characterId, prompt)

### Phase 4: Frontend - Script Page (5개)
- [x] `/routes/app/characters/[id]/script/+page.server.ts` 작성 (캐릭터 정보 로드)
- [x] `/routes/app/characters/[id]/script/+page.svelte` 기본 구조 작성
- [x] 요청 입력 폼 컴포넌트 구현 (textarea + 생성 버튼)
- [x] 결과 표시 영역 구현 (생성된 스크립트 출력)
- [x] 로딩 상태 및 에러 처리 추가

### Phase 5: Integration (1개)
- [x] 전체 플로우 테스트 (캐릭터 선택 → 요청 → 생성 → 저장 → 표시)

## 최종 구조
```
/lib/domain/script/
├── types.ts
├── usecase.server.ts
└── api.client.ts

/routes/api/scripts/
└── generate/+server.ts

/routes/app/characters/[id]/script/
├── +page.server.ts
└── +page.svelte

/supabase/migrations/
└── [timestamp]_scripts_table.sql
```

## 사용 플로우
1. 사용자가 `/app/characters/abc123/script` 접속
2. 캐릭터 정보 자동 로드
3. 요청 입력 ("첫 만남 장면 만들어줘")
4. 생성 버튼 클릭
5. API 호출 → LLM 생성 → DB 저장
6. 결과 화면에 표시
