# Task: LLM 유틸리티 구현
# Folder: llm-utility-implementation

## 요구사항 요약
Cloudflare AI Gateway 기반 스크립트 생성 인프라 구축
- 체인 방식 프롬프트 빌더
- 템플릿 로더 (캐싱)
- AI 클라이언트
- 타입 안전성 확보

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 및 확인
- [x] 인터페이스 설계 검증

### Phase 1: Core Infrastructure (4개)
- [x] `/lib/llm/types.ts` 작성 (LLMModel, EngineConfig, LLMResponse)
- [x] `/lib/llm/template-loader.ts` 작성 (load, preloadAll, clearCache)
- [x] `/lib/llm/aiClient.ts` 작성 (CloudflareAIClient, generate 메서드)
- [x] `/lib/llm/builder/` 폴더 생성

### Phase 2: Script Prompt Builder (1개)
- [x] `/lib/llm/builder/script-prompt-builder.ts` 작성 (체인 메서드: setEngine, setSystemPrompt, setProfile, request, getEngine)

### Phase 3: Environment Setup (1개)
- [x] `.env.example` 업데이트 (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_AI_TOKEN, CLOUDFLARE_GATEWAY_ID)

## 최종 구조
```
/lib/llm/
├── types.ts
├── template-loader.ts
├── aiClient.ts
├── builder/
│   └── script-prompt-builder.ts
└── prompt/
    └── script_chat.md (기존)
```

## 사용 예시
```typescript
const messages = new ScriptPromptBuilder()
  .setSystemPrompt('script_chat.md')
  .setProfile('NPC + User 정보')
  .request('대화 장면 생성');

const response = await client.generate(messages, engine);
```
