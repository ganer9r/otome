# Task: 로또 참여 기능 개선
# Folder: lotto-participation-improvement

## 요구사항 요약
로또 100장 참여 후 티켓 수 동기화 지연 문제 해결
- ticket_history → asset_transactions 통합
- 100회 참여 시 asset_transactions 1개 레코드로 일괄 처리 (-100)

## 문제 원인
1. **이중 트리거 시스템**: ticket_history + asset_transactions 충돌
2. **개별 처리**: 100회 참여 → 100개 ticket_history 레코드 생성  
3. **동기화 지연**: 두 시스템 간 타이밍 차이

## 해결 방안
**근본 해결**: asset_transactions 단일 시스템으로 통합
- lotto_entry: 100개 생성 (참여 이력)
- asset_transactions: 1개 생성 (-100 TICKET)

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 이중 시스템 문제 분석 완료
- [x] 기존 addAssetTransaction API 확인 완료

### Phase 1: Backend (3/3) ✅
- [x] participateInLotto 함수 수정 - addAssetTransaction 사용
- [x] 100회 참여 → 1개 asset_transactions (-100 TICKET) 생성
- [x] API 응답에 최신 asset 정보 포함

### Phase 2: Frontend (2/2) ✅
- [x] participate 페이지 - 수정된 API 응답에서 asset 정보 처리
- [x] assetStore - 서버 응답 기반 asset 동기화

### Phase 3: 정리 (2/2) ✅
- [x] insertTicketHistory 호출 제거 (로또 관련)
- [x] provideTestTickets도 addAssetTransaction 사용

## 🔧 핵심 변경사항

### Before (현재):
```typescript
// 100번 반복 처리
for (const numbers of numbersArray) {
  await insertLottoEntryWithNumbers(uid, activeDraw.id, numbers);
  await insertTicketHistory(uid, asset.id, TicketType.LOTTO_USE, -1, ...); // 100번
}

// API 응답
return { successCount, failedCount, entries: results };
// ❌ asset 정보 없음
```

### After (개선):
```typescript
// 1. 로또 참여 이력 생성 (100개)
const entries = await Promise.all(
  numbersArray.map(numbers => insertLottoEntryWithNumbers(uid, activeDraw.id, numbers))
);

// 2. 티켓 사용 기록 (1개, -100)
await addAssetTransaction(uid, {
  assetType: 'TICKET',
  transactionType: 'USE', 
  amount: -numbersArray.length,
  source: 'LOTTO',
  sourceId: activeDraw.id,
  description: `로또 참여 (${activeDraw.round_number}회차)`
});

// 3. 최신 asset 조회하여 반환
const updatedAsset = await findAssetOrCreate(uid);
return { 
  successCount, 
  failedCount, 
  entries: results,
  asset: updatedAsset  // ✅ 최신 asset 정보 포함
};
```

## 📱 FE 동기화

### Before:
```typescript
const result = await lottoApi.participate(numberCombinations);
// result.asset이 없어서 UI에서 이전 티켓 수 그대로 표시
```

### After:
```typescript
const result = await lottoApi.participate(numberCombinations);
if (result.asset) {
  updateAsset(result.asset);  // 올바른 티켓 수로 즉시 업데이트
}
```