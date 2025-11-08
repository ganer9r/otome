# Task: 캐릭터 챕터 생성 기능
# Folder: character-chapter-generation

## 요구사항 요약
- **캐릭터별 AI 기반 챕터 생성** (30개 챕터)
- **1:1 관계**: character ↔ chapters (character_id UNIQUE)
- **JSON 배열 저장**: data 필드에 챕터 배열 저장
  - type: "meet" (만남) / "chat" (채팅) 구분
  - order, title, description, content 포함
- **Soft delete 패턴**: deleted_at으로 재생성 가능
- **요청 정보 저장**: prompt, model 저장

## 데이터 모델

### chapters 테이블
```sql
CREATE TABLE chapters (
  id uuid PRIMARY KEY,
  uid uuid NOT NULL,
  character_id uuid UNIQUE NOT NULL,  -- 1:1 관계
  data jsonb NOT NULL,  -- 챕터 배열
  prompt text NOT NULL,  -- 사용자 요청
  model text NOT NULL,  -- 사용 모델
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz  -- soft delete
);

-- 인덱스
CREATE INDEX idx_chapters_uid_created ON chapters(uid, created_at DESC);
CREATE INDEX idx_chapters_character_deleted ON chapters(character_id, deleted_at);
```

### 챕터 JSON 구조
```typescript
{
  order: number;      // 1-30
  type: "meet" | "chat";  // 만남/채팅 구분
  title: string;
  description: string;
  content: string;
}
```

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 완료
- [x] 데이터베이스 설계 확정

### Phase 1: Database (5개) ✅
- [x] chapters 테이블 마이그레이션 작성
- [x] 인덱스 추가 (uid + created_at DESC, character_id + deleted_at)
- [x] RLS 정책 설정 (서버 전용 접근)
- [x] 마이그레이션 실행
- [x] TypeScript 타입 생성 (schema.gen.ts)

### Phase 2: Backend (8개)
- [x] Chapter 도메인 타입 정의 (src/lib/domain/chapter/types.ts)
- [x] 챕터 생성용 시스템 프롬프트 템플릿 작성 (src/lib/llm/prompts/chapter_generate.md)
- [x] Chapter 프롬프트 빌더 작성 (src/lib/llm/builder/chapter-prompt-builder.ts)
- [x] generateAndSaveChapters usecase 구현 (soft delete 로직 포함)
- [x] Chapter API 클라이언트 작성 (src/lib/domain/chapter/api.client.ts)
- [x] Usecase 테스트 - 챕터 생성
- [x] Usecase 테스트 - 재생성 (soft delete 검증)
- [x] 에러 처리 로직 추가

### Phase 3: API (1개)
- [x] POST /api/chapters/generate 엔드포인트 (characterId, prompt 검증)

### Phase 4: Frontend (4개)
- [x] 챕터 생성 페이지 (src/routes/app/characters/[id]/chapters/+page.svelte)
- [x] 챕터 생성 폼 컴포넌트
- [x] 챕터 목록 표시 (30개, type별 아이콘 구분)
- [x] 로딩/에러 상태 처리

### Phase 5: Testing (2개)
- [~] 통합 테스트 (생성 → 재생성 흐름)
- [ ] UI 동작 검증 (30개 챕터 표시, meet/chat 구분)

## 참고사항
- 스크립트 생성 패턴 참고: src/lib/domain/script/
- LLM 클라이언트: src/lib/llm/aiClient.ts
- 프롬프트 빌더 패턴: src/lib/llm/builder/script-prompt-builder.ts
