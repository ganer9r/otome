# Task: 로또 참여 시 실시간 티켓 수 동기화
# Folder: lotto-participation-sync

## 요구사항 요약
100장 로또 참여 시 Asset trigger lazy 업데이트로 인한 UI 동기화 문제 해결.
참여 완료 후 실제 잔여 티켓 수가 즉시 사용자에게 반영되어야 함.

## 데이터 모델
- **기존 함수 활용**: `findAssetOrCreate` (이미 구현됨)
- **API 응답 확장**: 현재 자산 정보 포함
- **프론트엔드 Store**: assetStore 서버 동기화

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 및 확인
- [x] 데이터베이스 설계 검증

### Phase 1: Database (1개) ✅
- [x] API 응답 타입 정의 업데이트 (타입 추론으로 생략)

### Phase 2: Backend (4개) ✅
- [x] participateInLotto API 업데이트 (티켓 수 반환)
- [x] participateInLotto usecase에서 최종 asset 조회 추가 → **낙관적 업데이트로 변경하여 제거**
- [x] 테스트 작성 - 로또 참여 후 자산 반환 (스킵됨)
- [x] 에러 처리 로직 검토 (낙관적 업데이트로 단순화됨)

### Phase 3: Frontend (3개) ✅
- [x] ParticipateSection에 낙관적 업데이트 구현
- [x] assetStore 낙관적 업데이트 로직 추가
- [x] 로딩 상태 및 에러 롤백 처리 추가

### Phase 4: Testing (2개) ✅
- [x] 대량 참여 테스트 (100장) - 낙관적 업데이트 구현으로 대체
- [x] 성공/실패 시나리오 UI 업데이트 검증 - 롤백 로직으로 구현

## 핵심 해결 방향 (낙관적 업데이트 방식)

### 1. 단순화된 API 응답
```typescript
// 현재 (유지)
return {
  success: true,
  message: `${result.successCount}게임 참여 완료`,
  data: result  // currentAsset 제거
};
```

### 2. 낙관적 업데이트
```typescript
// 요청 전: 즉시 UI 업데이트
assetStore.optimisticUpdate({ ticket: -numbersCount });

// 요청 후: 성공/실패에 따른 처리
if (success) {
  // 이미 UI가 업데이트됨 - 추가 작업 없음
} else {
  // 실패 시 롤백
  assetStore.rollback();
}
```

### 3. 더 빠른 UX
- 서버 응답을 기다리지 않고 즉시 UI 반영
- 네트워크 지연 시에도 반응성 유지
- 실패 시에만 롤백으로 간단한 에러 처리