# Game Instant Completion Bug

## Problem
스도쿠 게임이 페이지 로드 시 즉시 완료 처리되는 버그

### Symptom
- 페이지 진입 즉시 게임 완료 다이얼로그 표시
- 실제로는 퍼즐이 비어있는 상태

## Root Cause
초기 빈 그리드 상태에서 완료 체크 로직이 잘못 동작:
1. `isGameCompleted` 함수가 빈 그리드를 완료로 판단
2. `$effect`가 즉시 트리거되어 게임 완료 처리

## Solution

```typescript
// gameStarted 플래그 추가
let gameStarted = $state(false);

// 게임 시작 함수에서 플래그 설정
function startNewGame(puzzle: (number | null)[][]) {
    grid = puzzle.map(row => [...row]);
    gameStarted = true; // 게임 시작 표시
}

// 완료 체크에 조건 추가
$effect(() => {
    const filledCells = grid.flat().filter(cell => cell !== null).length;
    
    // gameStarted와 모든 셀 채워짐 확인
    if (gameStarted && filledCells === 81 && isGameCompleted && !isCompleted) {
        completeGame();
    }
});

// isGameCompleted 함수도 개선
export function isGameCompleted(grid: (number | null)[][]): boolean {
    // 81개 셀이 모두 채워졌는지 확인
    let filledCells = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === null) return false;
            filledCells++;
        }
    }
    
    if (filledCells !== 81) return false;
    
    return validateSudoku(grid);
}
```

## Prevention
1. 게임 상태 플래그 사용 (gameStarted, isCompleted)
2. 완료 조건 명확히 정의
3. 초기 상태에서 의도치 않은 트리거 방지

## Related
- Reactive state management
- Game state lifecycle
- Edge case handling