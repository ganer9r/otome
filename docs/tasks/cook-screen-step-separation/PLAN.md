# Task: cook 화면을 포켓몬슬립 스타일로 단계별 분리
# Folder: cook-screen-step-separation

## 요구사항 요약

포켓몬슬립 스타일로 재료 선택과 조리기구 선택을 단계별로 분리하여
사용자 경험을 개선합니다.

### 현재 상태
- 재료 선택 + 조리기구 선택이 CookingContainer 한 화면에 통합
- 상태 관리: isCooking, showResult만 존재

### 변경 후 Flow
1. **재료 선택 화면**: 재료 슬롯 2개 + 재료 그리드 + 다음 버튼
2. **조리기구 선택 화면**: 조리기구 카드 + 요리하기 버튼
3. **조리 화면**: 기존 유지
4. **결과 화면**: 기존 유지

## 컴포넌트 구조

### 새로 생성
- `IngredientSelectScreen.svelte`: 재료 선택 화면
- `ToolSelectScreen.svelte`: 조리기구 선택 화면

### 재사용
- `IngredientGrid.svelte`
- `CookingScreen.svelte`
- `DishResultScreen.svelte`

### 제거
- `CookingContainer.svelte`

## 상태 관리

```typescript
step: 'ingredient' | 'tool' | 'cooking' | 'result'
selectedIngredients: string[]
selectedTool: string | null
```

---

## 📋 Master TodoList

### Phase 0: 모델링 (3/3) ✅
- [x] 요구사항 분석 및 확인
- [x] 컴포넌트 구조 설계
- [x] 상태 관리 구조 설계

### Phase 1: IngredientSelectScreen 구현 (5개)
- [x] IngredientSelectScreen.svelte 컴포넌트 생성
- [x] 재료 슬롯 2개 UI 구현 (주방 느낌)
- [x] IngredientGrid 통합 및 바인딩
- [x] 다음 버튼 구현 (2개 선택 시 활성화)
- [x] 스타일링 완성 (cook_bg.webp 배경, 애니메이션)

### Phase 2: ToolSelectScreen 구현 (4개)
- [x] ToolSelectScreen.svelte 컴포넌트 생성
- [x] 선택한 재료 표시 UI 구현
- [x] 조리기구 카드 3개 구현 (냄비/프라이팬/오븐)
- [x] 요리하기 버튼 구현 및 스타일링

### Phase 3: +page.svelte 리팩토링 (6개)
- [x] step 상태 추가 및 타입 정의
- [x] 새 컴포넌트 import 추가
- [x] handleIngredientNext 핸들러 구현
- [x] handleCook 핸들러 수정
- [x] 조건부 렌더링 구현 (step별 화면 전환)
- [x] CookingContainer 제거 및 스타일 정리

### Phase 4: 테스트 및 검증 (5개) ✅
- [x] 전체 flow 테스트 (재료 선택 → 조리기구 → 요리 → 결과)
- [x] 화면 전환 애니메이션 확인
- [x] 버튼 활성화/비활성화 동작 검증
- [x] 결과 후 초기화 동작 확인
- [x] 모바일 반응형 테스트

### Phase 5: 포켓몬슬립 스타일 조리/결과 화면 (3개)
- [x] CookingScreen 포켓몬슬립 스타일 개선 (재료 떨어지기, 냄비 흔들림, 증기, 불꽃)
- [x] DishResultScreen 포켓몬슬립 스타일 개선 (냄비 열림 연출, 심플한 결과)
- [x] 전체 flow 최종 테스트

---

## 📊 작업 통계
- **총 작업**: 23개
- **예상 시간**: 3-4시간
- **첫 작업**: IngredientSelectScreen.svelte 컴포넌트 생성
