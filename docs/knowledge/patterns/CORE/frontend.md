# Frontend 패턴

## Svelte 5 Runes

### 필수 Runes
```typescript
// Props
let { data, optional = 'default' }: Props = $props();

// State
let count = $state(0);
let items = $state<Item[]>([]);

// Derived
let doubled = $derived(count * 2);
let filtered = $derived(items.filter(i => i.active));

// Effect
$effect(() => {
  // 마운트 시 실행
  return () => {
    // 언마운트 시 정리
  };
});
```

## 컴포넌트 구조

### 기본 구조
```svelte
<script lang="ts">
  interface Props {
    data: DataType;
    onAction?: (result: unknown) => void;
  }
  
  let { data, onAction }: Props = $props();
  
  let loading = $state(false);
  let error = $state<string | null>(null);
  let computed = $derived(processData(data));
</script>

<div class="container">
  {#if loading}
    <div>로딩 중...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <!-- 컨텐츠 -->
  {/if}
</div>

<style lang="postcss">
  @reference "$styles/app.css";
  
  .container {
    @apply flex flex-col gap-4;
  }
</style>
```

## CSS 스타일링 패턴

### PostCSS + Tailwind (필수)
```svelte
<style lang="postcss">
  @reference "$styles/app.css";  /* 필수! */
  
  .custom-class {
    @apply flex flex-col items-center;
    @apply p-4 bg-white rounded-lg shadow;
  }
</style>
```

## API 연동 패턴

### API Client 사용 (필수)
```typescript
// ✅ 올바른 패턴
import { DailyEarnApiClient } from '$lib/domain/daily-earn/api.client';

const apiClient = new DailyEarnApiClient(fetch);
const result = await apiClient.claimReward();

// ❌ 금지 - 직접 fetch
const data = await fetch('/api/...'); // 금지!
```

## Store 패턴

### Store 사용법
```typescript
// $ prefix로 직접 구독
import { assetStore } from '$lib/stores/assetStore';
// 사용: {$assetStore.coin}

// 클래스 Store
import { userStore } from '$lib/stores/userStore';
// 사용: {$userStore.user?.name}
```

### 모달 패턴
```typescript
import { modalStore } from '$lib/stores/modal';
import SomeModal from '$(ui)/modal/SomeModal.svelte';

modalStore.open(SomeModal, { data: value });
```

### 토스트 패턴
```typescript
import { toastStore } from '$lib/stores/toast';

toastStore.success('성공!');
toastStore.error('실패!');
toastStore.info('정보');
```

## 날짜 처리 (dayjs 필수)

```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ 올바른 패턴
dayjs().format('YYYY.MM.DD')
dayjs().tz('Asia/Seoul')
dayjs().add(1, 'day')
dayjs().startOf('day')

// ❌ 금지
new Date()
```

## 폼 처리 패턴

### 에러 처리
```typescript
import { showErrorModal } from '$lib/framework/form';

try {
  // 비즈니스 로직
} catch (error) {
  showErrorModal(error);
}
```

### 로딩 상태
```svelte
<button class="btn" disabled={loading}>
  {#if loading}
    <span class="loading loading-spinner"></span>
    처리중...
  {:else}
    제출
  {/if}
</button>
```

## 이미지/아이콘 패턴

### Import 방식
```typescript
// Lucide 아이콘
import { Users, Settings } from 'lucide-svelte';

// 이미지 파일
import { IMG_COINS, IMG_PI } from '$assets/images';
import { IC_SPARKLE } from '$assets/icon';
```

### 사용 방식
```svelte
<!-- Lucide 아이콘 -->
<Users size={20} class="text-gray-600" />

<!-- 이미지 파일 -->
<img src={IMG_COINS} alt="코인" class="w-8 h-8" />
```

## DaisyUI 컴포넌트

### 버튼
```svelte
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-sm">Small</button>
<button class="btn" class:loading={isLoading}>Loading</button>
```

### 카드
```svelte
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">제목</h2>
    <p>내용</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">액션</button>
    </div>
  </div>
</div>
```

## 필수 규칙

- **Svelte 5 Runes 사용**: $state, $derived, $effect, $props
- **CSS 참조 필수**: `@reference "$styles/app.css"`
- **API Client 사용**: 직접 fetch 금지
- **날짜 처리**: dayjs만 사용
- **타입 정의**: interface Props 필수

## 절대 금지

- ❌ new Date() 사용
- ❌ @reference "$styles/app.css" 누락
- ❌ Svelte 4 문법 ($:, createEventDispatcher)
- ❌ 직접 fetch 호출
- ❌ console.log 커밋