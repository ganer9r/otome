# 요리 조합 게임 시스템 설계

## 📋 개요

### 게임 컨셉
- **장르**: 조합 수집 게임 (Little Alchemy 스타일)
- **규모**: 약 500개 아이템 (재료 + 요리)
- **등급**: G ~ SSR (10단계)
- **조합**: 재료 1~2개 + 조리기구

### 핵심 메커니즘
1. 재료를 조합해서 요리 생성
2. 요리를 재료로 사용 가능 (체인 조합)
3. 확률적 바리에이션 (실패/성공)
4. 단계적 재료 해금

---

## 🎮 등급 시스템

### 등급 구조 (10단계)
```
G  (40개)   - 기본 재료 (쌀, 계란, 소고기 등)
F  (100개)  - 1차 가공 (밥, 계란 후라이 등)
E  (100개)  - 기본 요리 (볶음밥, 김치찌개 등)
D  (80개)   - 전문 요리 (돈가스, 짜장면 등)
C  (60개)   - 고급 요리 (스테이크, 랍스터 등)
B  (40개)   - 프리미엄 요리
A  (30개)   - 럭셔리 요리
R  (25개)   - 레어 요리 (미슐랭급)
SR (8개)    - 슈퍼 레어
SSR (2개)   - 전설급

총 485개 (확장 가능)
```

### 등급별 특징
- **G등급**: 초기 지급, 기본 재료
- **F~E**: 초중반 컨텐츠 (54%)
- **D~C**: 중반 컨텐츠 (32%)
- **B~A**: 후반 컨텐츠 (13%)
- **R~SSR**: 엔드게임 (7%)

---

## 🗄️ 데이터베이스 구조

### 전체 관계도
```
recipes (조합 방법)
  ├─ ingredient_ids[] ──→ ingredients (재료 소모)
  └─ result_ingredient_id ──→ ingredients (결과 오픈)
       ↓ (선택사항)
  dishes (바리에이션: 실패/성공)
```

---

## 📊 테이블 상세

### 1. ingredients (재료 + 요리)

```sql
CREATE TABLE ingredients (
  id                      VARCHAR PRIMARY KEY,
  name                    VARCHAR NOT NULL,
  grade                   VARCHAR NOT NULL,       -- 'G', 'F', ..., 'SSR'
  tags                    JSON,                   -- ['한식', '육류', '고급']
  price                   INT,
  unlocked                BOOLEAN DEFAULT FALSE,
  image_url               VARCHAR,
  image_prompt            TEXT,                   -- LLM 이미지 생성용
  created_at              TIMESTAMP DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 고유 ID (예: 'g001', 'f010', 'r001')
- `name`: 표시 이름 (예: '쌀', '계란 후라이', '전복죽')
- `grade`: 등급 (G/F/E/D/C/B/A/R/SR/SSR)
- `tags`: 유연한 분류 (한식/양식/중식, 육류/채소, 고급/기본 등)
- `price`: 기본 가격
- `unlocked`: 오픈 여부
- `image_url`: 이미지 경로
- `image_prompt`: AI 이미지 생성 프롬프트

**예시 데이터:**
```json
{
  "id": "g001",
  "name": "쌀",
  "grade": "G",
  "tags": ["곡물", "한식재료", "일식재료", "기본"],
  "price": 100,
  "unlocked": true,
  "image_url": "rice.png",
  "image_prompt": "white rice grains, top view, cartoon style"
}

{
  "id": "f010",
  "name": "계란 후라이",
  "grade": "F",
  "tags": ["한식", "양식", "기본요리"],
  "price": 200,
  "unlocked": false,
  "image_url": "fried_egg.png",
  "image_prompt": "golden fried egg, sunny side up, top view, cartoon"
}
```

---

### 2. recipes (조합 레시피)

```sql
CREATE TABLE recipes (
  id                      VARCHAR PRIMARY KEY,
  ingredient_ids          JSON,                   -- ['g001', 'g002']
  cooking_tool            VARCHAR,                -- '냄비', '프라이팬', '오븐', NULL
  result_ingredient_id    VARCHAR REFERENCES ingredients(id),
  price                   INT,                    -- 기본 가격 (바리에이션 계산용)
  image_url               VARCHAR,
  name                    VARCHAR,
  unlocked                BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMP DEFAULT NOW()
);
```

**필드 설명:**
- `id`: 레시피 ID (예: 'recipe_f010')
- `ingredient_ids`: 필요한 재료 배열 (1~2개)
- `cooking_tool`: 조리기구 ('냄비', '프라이팬', '오븐', NULL)
- `result_ingredient_id`: 결과로 오픈되는 ingredient
- `price`: 기본 가격 (dishes.price_multiplier 계산 기준)
- `image_url`: 기본 결과 이미지
- `name`: 레시피 이름
- `unlocked`: 레시피 오픈 여부

**예시 데이터:**
```json
{
  "id": "recipe_f001",
  "ingredient_ids": ["g001", "g026"],
  "cooking_tool": "냄비",
  "result_ingredient_id": "f001",
  "price": 150,
  "image_url": "cooked_rice.png",
  "name": "밥",
  "unlocked": true
}

{
  "id": "recipe_f010",
  "ingredient_ids": ["g002"],
  "cooking_tool": "프라이팬",
  "result_ingredient_id": "f010",
  "price": 200,
  "image_url": "fried_egg.png",
  "name": "계란 후라이",
  "unlocked": true
}
```

---

### 3. dishes (바리에이션 - 2단계)

```sql
CREATE TABLE dishes (
  id                      VARCHAR PRIMARY KEY,
  recipe_id               VARCHAR REFERENCES recipes(id),
  is_success              BOOLEAN,                -- false=실패, true=성공
  name                    VARCHAR NOT NULL,
  image_url               VARCHAR,                -- nullable (없으면 ingredients 사용)
  image_prompt            TEXT,                   -- nullable
  price_multiplier        DECIMAL(3,2),           -- 0.5, 1.0, 1.5
  probability             DECIMAL(3,2),           -- 0.2, 0.7, 0.1 (합=1.0)
  created_at              TIMESTAMP DEFAULT NOW()
);
```

**필드 설명:**
- `id`: dish ID (예: 'f010_burnt', 'f010_normal', 'f010_perfect')
- `recipe_id`: 어떤 레시피로 만들어지는지
- `is_success`: 성공 여부 (false=실패작, true=성공작)
- `name`: 바리에이션 이름
- `image_url`: 특수 이미지 (없으면 ingredients.image_url 사용)
- `image_prompt`: AI 이미지 생성 프롬프트
- `price_multiplier`: 가격 배율 (recipes.price × multiplier)
- `probability`: 나올 확률 (낮은 순 정렬 → 희귀부터 체크)

**예시 데이터:**
```json
{
  "id": "f010_burnt",
  "recipe_id": "recipe_f010",
  "is_success": false,
  "name": "탄 계란 후라이",
  "image_url": "burnt_egg.png",
  "image_prompt": "burnt fried egg, black edges",
  "price_multiplier": 0.5,
  "probability": 0.2
}

{
  "id": "f010_normal",
  "recipe_id": "recipe_f010",
  "is_success": true,
  "name": "계란 후라이",
  "image_url": null,
  "image_prompt": null,
  "price_multiplier": 1.0,
  "probability": 0.7
}

{
  "id": "f010_perfect",
  "recipe_id": "recipe_f010",
  "is_success": true,
  "name": "완벽한 계란 후라이",
  "image_url": "perfect_egg.png",
  "image_prompt": "perfect golden fried egg",
  "price_multiplier": 1.5,
  "probability": 0.1
}
```

---

## 🎯 게임 로직

### 기본 흐름 (1단계 - dishes 없음)

```javascript
function executeRecipe(recipeId, userId) {
  const recipe = getRecipe(recipeId)

  // 1. 재료 확인
  if (!hasIngredients(userId, recipe.ingredient_ids)) {
    return { error: '재료 부족' }
  }

  // 2. 재료 소모
  consumeIngredients(userId, recipe.ingredient_ids)

  // 3. 결과 생성 (100% 성공)
  const result = {
    ingredient_id: recipe.result_ingredient_id,
    name: recipe.name,
    image_url: recipe.image_url,
    price: recipe.price
  }

  // 4. ingredient 오픈
  unlockIngredient(userId, result.ingredient_id)

  return result
}
```

### 바리에이션 로직 (2단계 - dishes 추가)

```javascript
function executeRecipeWithVariation(recipeId, userId) {
  const recipe = getRecipe(recipeId)

  // 재료 확인 & 소모 (동일)
  if (!hasIngredients(userId, recipe.ingredient_ids)) {
    return { error: '재료 부족' }
  }
  consumeIngredients(userId, recipe.ingredient_ids)

  // 바리에이션 선택
  const dishes = getDishes(recipeId)
    .sort((a, b) => a.probability - b.probability)  // 낮은 확률부터

  const rand = Math.random()
  let cumulative = 0
  let selectedDish = null

  for (const dish of dishes) {
    cumulative += dish.probability
    if (rand <= cumulative) {
      selectedDish = dish
      break
    }
  }

  // 결과 생성
  const ingredient = getIngredient(recipe.result_ingredient_id)
  const result = {
    dish_id: selectedDish.id,
    ingredient_id: recipe.result_ingredient_id,
    name: selectedDish.name,
    image_url: selectedDish.image_url || recipe.image_url,
    price: recipe.price * selectedDish.price_multiplier,
    is_success: selectedDish.is_success
  }

  // ingredient 오픈 & dish 기록
  unlockIngredient(userId, result.ingredient_id)
  recordDish(userId, result.dish_id)

  return result
}
```

---

## 🚀 개발 단계

### Phase 1: 기본 시스템
**목표**: 실패 없는 기본 조합 게임

**구현:**
1. ✅ ingredients 테이블
2. ✅ recipes 테이블
3. ⬜ 기본 게임 로직
4. ⬜ 데이터 작성 (G~SSR)

**기능:**
- 재료 조합
- 요리 생성
- 도감 시스템
- 재료 해금

---

### Phase 2: 바리에이션 시스템
**목표**: 실패/성공 확률 시스템

**구현:**
1. ⬜ dishes 테이블 추가
2. ⬜ 확률 로직 구현
3. ⬜ 바리에이션 데이터 작성

**기능:**
- 실패/성공 확률
- 특수 결과물
- 가격 변동

---

## 📦 데이터 작성 계획

### G등급 (40개) - 기본 재료
```
요리 채소 (8개): 토마토, 감자, 버섯, 양파, 호박, 배추, 무, 콩
샐러드/양념 채소 (7개): 당근, 양배추, 양상추, 시금치, 파, 마늘, 고추
육류 (4개): 소고기, 돼지고기, 닭고기, 오리
해산물 (9개): 연어, 참치, 새우, 오징어, 조개, 전복, 미역, 김, 게
곡물/기본재료 (5개): 쌀, 밀, 고구마, 계란, 우유
과일/견과류 (7개): 사과, 바나나, 딸기, 레몬, 포도, 카카오, 아몬드
```

### 조합 규칙
1. **최대 2개 재료** (1개 또는 2개)
2. **조리기구**: 냄비, 프라이팬, 오븐, 없음
3. **체인 조합**: 요리 → 재료로 사용 가능
4. **특수 조합**: 콩 + 콩 = 메주

---

## 🎨 이미지 생성

### AI 이미지 생성 프롬프트 구조
```
[주재료] [조리 상태] [각도] [스타일] [배경]

예시:
- "golden fried egg, sunny side up, top view, cartoon style, white background"
- "burnt fried egg, black edges, top view, cartoon style, white background"
- "cooked white rice, top view, simple illustration, white background"
```

### 프롬프트 작성 가이드
- **주재료**: 요리의 핵심 재료
- **조리 상태**: 익힌 정도, 색상, 질감
- **각도**: top view, side view, 45 degree
- **스타일**: cartoon, minimalist, realistic
- **배경**: white background, transparent

---

## 💰 경제 시스템

### 가격 책정 원칙
1. **G등급**: 50~200원 (기본 재료)
2. **F등급**: 100~500원 (1차 가공)
3. **등급 상승**: 약 1.5~2배씩 증가
4. **바리에이션 배율**:
   - 실패작: 0.5배
   - 일반: 1.0배
   - 완벽: 1.5배

### 가격 계산
```javascript
// 기본 가격
const basePrice = recipes.price  // 200원

// 바리에이션 적용
const finalPrice = basePrice * dishes.price_multiplier
// 탄 것: 200 × 0.5 = 100원
// 일반: 200 × 1.0 = 200원
// 완벽: 200 × 1.5 = 300원
```

---

## 🔧 기술 스택

### 데이터베이스
- PostgreSQL (또는 Supabase)
- JSON 컬럼 지원
- 인덱스 불필요 (데이터 500개 수준)

### 백엔드
- SvelteKit
- Supabase (인증, DB)

### 프론트엔드
- Svelte 5
- Tailwind CSS

---

## 📝 다음 단계

### 즉시 작업
1. ⬜ ingredients 데이터 작성 (G등급 40개)
2. ⬜ recipes 데이터 작성 (F등급 100개)
3. ⬜ 기본 게임 로직 구현

### 이후 작업
1. ⬜ E~SSR 등급 데이터 작성
2. ⬜ dishes 바리에이션 추가
3. ⬜ AI 이미지 생성

---

## 📌 핵심 결정사항

### ✅ 확정
1. tags로 유연한 분류 (category, cuisine_type 대신)
2. recipes.price + dishes.price_multiplier 구조
3. dishes.image_url nullable (기본은 ingredients 사용)
4. probability 낮은 순 정렬 → 희귀부터 체크
5. 단계적 개발 (Phase 1: 기본, Phase 2: 바리에이션)
6. 인덱스 생략 (데이터 규모 작음)

### ❌ 제외
1. category, cuisine_type 컬럼 (tags로 통합)
2. ingredient_type ('base', 'dish') - grade로 충분
3. has_variations - 중복 데이터
4. effect, description - 이름으로 표현 가능
5. unlock_tier - unlocked (boolean)으로 단순화
6. difficulty, required_ingredient_ids - 1단계에서 불필요

---

**문서 작성일**: 2025-11-21
**버전**: 1.0
