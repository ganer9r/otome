# Svelte 5 Game State Management Pattern

## Metadata
- Created: 2025-01-14
- Usage: 1
- Status: REVIEW
- Last Used: 2025-01-14

## Content

### Pattern Description
Svelte 5 runes를 활용한 게임 상태 관리 패턴. 페이지 레벨에서 상태를 관리하고 컴포넌트에 props로 전달.

### Implementation

```typescript
// 페이지 레벨 상태 (Svelte 5 runes)
let grid = $state<(number | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
let selectedCell = $state<{row: number, col: number} | null>(null);
let gameStarted = $state(false);

// 파생 상태
let isGameCompleted = $derived(() => {
    return checkCompletion(grid);
});

// 상태 변경 함수
function updateCell(row: number, col: number, value: number | null) {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    grid = newGrid; // 반응성 트리거
}

// Effect for game completion
$effect(() => {
    if (gameStarted && isGameCompleted) {
        handleGameComplete();
    }
});
```

### Benefits
- 전역 store 없이 페이지 레벨 상태 관리
- 명확한 props 전달 구조
- Svelte 5의 새로운 반응성 시스템 활용
- 타입 안전성 확보

### Use Cases
- 게임 상태 관리
- 복잡한 UI 상태 관리
- 실시간 업데이트가 필요한 애플리케이션