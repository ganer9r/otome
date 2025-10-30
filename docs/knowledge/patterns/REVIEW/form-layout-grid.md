# 폼 레이아웃 Grid 패턴

## Metadata
- Created: 2025-10-30
- Usage: 1
- Status: REVIEW
- Last Used: 2025-10-30
- Project: otome

## 문제
폼의 label과 input/textarea가 들쭉날쭉하게 배치되어 가독성이 떨어짐

## 해결책

### Tailwind Grid 패턴
```svelte
<form class="space-y-6">
  <!-- 이름 -->
  <div class="grid grid-cols-[160px_1fr] gap-4 items-start">
    <label for="name" class="pt-2 font-semibold">
      캐릭터 이름 <span class="text-error">*</span>
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      class="input input-bordered w-full"
      required
    />
  </div>

  <!-- Textarea -->
  <div class="grid grid-cols-[160px_1fr] gap-4 items-start">
    <label for="info" class="pt-2 font-semibold">캐릭터 정보</label>
    <textarea
      id="info"
      bind:value={info}
      class="textarea textarea-bordered w-full h-24"
    ></textarea>
  </div>
</form>
```

## 핵심 포인트
- `grid-cols-[160px_1fr]`: label 160px 고정, input 나머지 전체
- `gap-4`: 적절한 간격
- `items-start`: 상단 정렬
- `pt-2`: label 상단 패딩으로 input과 시각적 정렬
- `w-full`: textarea가 전체 너비 차지
- `space-y-6`: 폼 필드 간 간격

## 장점
- 일관된 정렬
- 깔끔한 시각적 구조
- 반응형 대응 용이
- 유지보수 편리

## 변형
### 더 좁은 label
```css
grid-cols-[120px_1fr]
```

### 더 넓은 label
```css
grid-cols-[200px_1fr]
```

### 반응형
```css
grid-cols-1 md:grid-cols-[160px_1fr]
```

## 주의사항
- DaisyUI form-control 대신 순수 Tailwind 사용
- label의 pt-2는 input/textarea 높이에 따라 조정
- textarea에 w-full 필수 (기본적으로 전체 너비가 아님)

## 관련 패턴
- Tailwind Grid 레이아웃
- DaisyUI 폼 컴포넌트
