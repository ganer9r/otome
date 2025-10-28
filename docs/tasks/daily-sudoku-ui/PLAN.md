# Task: 데일리 스도쿠 UI 구현
# Folder: daily-sudoku-ui

## 요구사항 요약
- 날짜 기반 시드로 모든 유저 동일 퍼즐
- 9x9 스도쿠 게임 UI
- 완료 다이얼로그 및 공유 기능
- 광고 기반 힌트 시스템
- 추가 랜덤 게임 (Phase 4)

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 완료
- [x] UI 중심 설계 확정

### Phase 1: 기본 게임 UI (6개)
- [x] web/src/routes/plays/sudoku 라우트 생성
- [x] SudokuBoard.svelte - 9x9 게임 보드 컴포넌트
- [x] NumberPad.svelte - 숫자 입력 패드
- [x] 게임 상태 관리 (gameStore.ts)
- [x] 셀 선택 및 입력 로직
- [x] 기본 스타일링 (Tailwind CSS)

### Phase 2: 게임 로직 (5개)
- [x] sudokuGenerator.ts - 퍼즐 생성 로직 (usecase.ts로 통합)
- [x] seedManager.ts - 날짜 기반 시드 관리 (usecase.ts로 통합)
- [x] sudokuValidator.ts - 입력 유효성 검사 (usecase.ts로 통합)
- [x] 게임 완료 체크 로직 (usecase.ts로 통합)
- [x] Timer 컴포넌트 및 시간 측정 (기존 구현 완료)

### Phase 3: 완료 플로우 UI (6개) ✅
- [x] CompletionDialog.svelte - 결과 다이얼로그
- [x] 완료 애니메이션 구현
- [x] 모의 순위/퍼센트 계산
- [x] ShareDialog.svelte - 공유 다이얼로그
- [x] 공유 메시지 동적 생성 (ShareDialog에 통합)
- [x] 다이얼로그 전환 애니메이션

### Phase 4: 추가 기능 (5개)
- [x] HintButton.svelte - 힌트 버튼 (광고 모의)
- [x] 힌트 로직 구현
- [x] 데일리 완료 체크
- [x] 추가 랜덤 게임 UI
- [x] 랜덤 퍼즐 생성 로직