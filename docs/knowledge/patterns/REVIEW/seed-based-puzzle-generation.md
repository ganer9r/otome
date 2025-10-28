# Seed-Based Puzzle Generation Pattern

## Metadata
- Created: 2025-01-14
- Usage: 1
- Status: REVIEW
- Last Used: 2025-01-14

## Content

### Pattern Description
시드 기반 랜덤 생성으로 재현 가능한 퍼즐/콘텐츠 생성. 날짜 기반 시드로 모든 사용자가 동일한 데일리 콘텐츠를 받도록 구현.

### Implementation

```typescript
// 시드 기반 랜덤 생성기
function seededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit 정수로 변환
    }
    
    // LCG (Linear Congruential Generator) 구현
    let current = Math.abs(hash);
    return function() {
        current = (current * 16807) % 2147483647;
        return (current - 1) / 2147483646;
    };
}

// 날짜 기반 시드 생성
export function generateDateBasedSeed(date?: string | Date): string {
    const targetDate = date ? new Date(date) : new Date();
    const dateString = targetDate.toISOString().split('T')[0];
    return dateString;
}

// 사용 예시
const seed = generateDateBasedSeed(); // "2025-01-14"
const rng = seededRandom(seed);
const puzzle = generatePuzzle(rng);
```

### Benefits
- 재현 가능한 랜덤 생성
- 모든 사용자가 동일한 데일리 콘텐츠
- 디버깅 용이
- 서버-클라이언트 동기화 가능

### Use Cases
- 데일리 퍼즐 게임
- 프로시저럴 콘텐츠 생성
- A/B 테스트
- 재현 가능한 시뮬레이션