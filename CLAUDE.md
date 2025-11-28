# 🎯 Pi-Friends AI 가이드

**언어**: 항상 한국어로 응답

## 🎯 핵심 원칙

1. **사용자 지시 최우선**
2. **간결하고 명확한 응답**
3. **실용적인 접근**

## 🤖 전문 영역별 에이전트

```yaml
database-engineer: 테이블/스키마/마이그레이션/RLS/SQL
backend-developer: API/비즈니스로직/TDD/도메인/usecase
frontend-developer: UI/Svelte/반응형/컴포넌트/Store
reward-designer: Pi/Coin/보상/인센티브/게임경제
```

## 🗄️ 데이터베이스 작업

### 필수 규칙
- 모든 테이블에 `id`, `created_at`, `updated_at` 포함
- RLS 정책 필수 설정
- 마이그레이션 파일로만 스키마 변경

### 명령어
```bash
# 마이그레이션 생성
supabase migration new {feature_name}

# 마이그레이션 적용
supabase migration up

# 타입 생성
supabase gen types typescript --local > web/src/lib/supabase/schema.gen.ts
```

### 마이그레이션 패턴
```sql
-- 테이블 생성
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (true);

-- 인덱스
CREATE INDEX idx_table_column ON table_name(column);
```

## 🔧 개발 명령어

```bash
# Supabase
supabase start
supabase status
supabase migration new {name}
supabase migration up
supabase db reset

# Web
pnpm --filter web dev
pnpm --filter web test
pnpm --filter web check

# Flutter
flutter run
flutter test
```

## 🚫 금지사항

- ❌ TodoWrite 도구 사용
- ❌ 불필요한 장황한 설명
- ❌ 사용자 확인 없이 과도한 변경

## 💡 작업 스타일

- ✅ 핵심만 간결하게
- ✅ 코드 먼저, 설명은 필요시만
- ✅ 파일 경로는 절대 경로로 (예: `/src/lib/...`)
- ✅ 변경사항은 라인 번호와 함께 명시
