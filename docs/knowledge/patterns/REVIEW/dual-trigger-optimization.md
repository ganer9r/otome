# 이중 트리거 시스템 최적화

**분류**: REVIEW (0-2회 사용)  
**최초 발견**: 2025-09-06  
**사용 횟수**: 1회  
**적용 도메인**: Database, Performance

## 🚨 문제 상황

### 이중 트리거 시스템 충돌
여러 테이블에서 같은 이벤트를 중복 처리하여 동기화 지연과 성능 저하 발생

```sql
-- ❌ 문제 패턴: 이중 처리
-- 1. 직접 호출 (100번)
INSERT INTO ticket_history (uid, ticket_type, amount) 
VALUES (?, 'LOTTO_USE', -1); -- 100번 반복

-- 2. 트리거 자동 실행 (100번)
INSERT INTO asset_transactions (uid, asset_type, amount)
VALUES (?, 'TICKET', -1); -- 트리거로 100번 실행
```

**결과**:
- 200개 레코드 생성 (100 + 100)
- 동기화 지연 (10초 이상)
- UI 반영 안됨

## ✅ 해결 패턴

### 단일 시스템 통합
하나의 시스템으로 통합하여 일괄 처리

```sql
-- ✅ 해결 패턴: 단일 처리
-- 1. 비즈니스 데이터 (100개)
INSERT INTO lotto_entry (uid, draw_id, numbers) 
VALUES (?, ?, ?); -- 100번 (참여 이력)

-- 2. 자산 처리 (1개)
INSERT INTO asset_transactions (uid, asset_type, amount, source)
VALUES (?, 'TICKET', -100, 'LOTTO'); -- 1번만 (일괄 처리)
```

**결과**:
- 101개 레코드 생성 (100 + 1)
- 즉시 처리 (<1초)
- UI 즉시 반영

## 🎯 적용 사례

### 로또 참여 시스템
- **Before**: `insertTicketHistory` (100번) + `asset_transactions` (100번 트리거)
- **After**: `insertLottoEntry` (100번) + `addAssetTransaction` (1번)

### 성능 개선
- **처리 시간**: 10초+ → <1초
- **레코드 수**: 200개 → 101개
- **UI 반영**: 지연 → 즉시

## 🔍 식별 방법

### 의심 신호
1. 같은 이벤트가 여러 테이블에 기록
2. 트리거와 직접 호출이 동시 실행
3. 대량 처리 시 성능 저하
4. UI 동기화 지연

### 확인 쿼리
```sql
-- 동일 시간대 중복 레코드 확인
SELECT 
  COUNT(*) as ticket_history_count,
  (SELECT COUNT(*) FROM asset_transactions 
   WHERE created_at BETWEEN ? AND ? 
   AND source = 'LOTTO') as asset_transactions_count
FROM ticket_history 
WHERE created_at BETWEEN ? AND ?;
```

## 🛠️ 적용 가이드

### 1. 현상 분석
```typescript
// 이중 처리 패턴 확인
for (const item of items) {
  await insertDirectRecord(item);  // 직접 호출
  // ⚠️ 트리거가 asset_transactions도 자동 생성
}
```

### 2. 시스템 통합
```typescript
// 비즈니스 로직과 자산 처리 분리
const businessRecords = await Promise.all(
  items.map(item => insertBusinessRecord(item))
);

// 자산 처리는 일괄로
await addAssetTransaction({
  assetType: 'TICKET',
  amount: -items.length,  // 일괄 처리
  source: 'BUSINESS_OPERATION'
});
```

### 3. API 응답 개선
```typescript
// 최신 asset 정보 포함
const updatedAsset = await findAssetOrCreate(uid);
return {
  success: true,
  data: result,
  asset: updatedAsset  // UI 동기화용
};
```

## 🚫 주의사항

- 비즈니스 이력은 유지 (참여 기록 등)
- 자산 처리만 일괄화
- 트랜잭션 범위 고려
- 롤백 시나리오 대비

## 📊 효과 측정

- 처리 시간 단축율
- 생성 레코드 수 감소
- UI 응답 시간 개선
- 사용자 만족도 향상