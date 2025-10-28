# Svelte 5 $derived Function Bug

## Problem
Svelte 5에서 `$derived`를 함수 형태로 잘못 사용하면 UI가 제대로 렌더링되지 않는 문제

### Symptom
```svelte
<!-- 잘못된 코드 -->
const canUseHint = $derived(() => {
    return !disabled && hintsUsed < maxHints;
});

<!-- UI에 표시될 때 -->
{canUseHint} <!-- 함수 자체가 출력됨: "() => { return ... }" -->
```

## Solution
`$derived`는 직접 표현식을 받아야 함:

```svelte
<!-- 올바른 코드 -->
const canUseHint = $derived(!disabled && hintsUsed < maxHints);
```

## Prevention
1. `$derived`는 함수를 감싸지 않고 직접 표현식 사용
2. 복잡한 로직이 필요한 경우 별도 함수로 분리 후 호출:
   ```svelte
   function calculateValue() {
       // 복잡한 로직
       return result;
   }
   const value = $derived(calculateValue());
   ```

## Related
- Svelte 5 runes documentation
- Reactive declarations in Svelte