# API 응답 동기화 패턴

**분류**: REVIEW (0-2회 사용)  
**최초 발견**: 2025-09-06  
**사용 횟수**: 1회  
**적용 도메인**: API, Frontend

## 🚨 문제 상황

### API 응답에 업데이트된 데이터 부재
서버에서 데이터 변경 후 클라이언트가 최신 상태를 받지 못해 UI 동기화 실패

```typescript
// ❌ 문제 패턴
export const POST = async ({ request }) => {
  // 데이터 변경
  await modifyUserAsset(uid, -100);
  
  // 변경 결과만 반환 (asset 정보 없음)
  return {
    success: true,
    message: "처리 완료",
    data: result
    // ❌ 최신 asset 정보 없음
  };
};
```

**결과**:
- UI에 이전 데이터 표시
- 사용자 혼란 ("티켓이 안 줄었네?")
- 페이지 새로고침 필요

## ✅ 해결 패턴

### API 응답에 최신 데이터 포함
데이터 변경 후 최신 상태를 조회해서 응답에 포함

```typescript
// ✅ 해결 패턴
export const POST = async ({ request }) => {
  // 1. 데이터 변경
  const result = await modifyUserAsset(uid, -100);
  
  // 2. 최신 데이터 조회
  const updatedAsset = await findAssetOrCreate(uid);
  
  // 3. 응답에 최신 데이터 포함
  return {
    success: true,
    message: "처리 완료", 
    data: result,
    asset: updatedAsset  // ✅ 최신 asset 정보 포함
  };
};
```

**결과**:
- UI에 최신 데이터 즉시 반영
- 사용자 경험 개선
- 새로고침 불필요

## 🎯 적용 사례

### 로또 참여 API
```typescript
// Before: asset 정보 없음
return { successCount, failedCount, entries };

// After: asset 정보 포함
const updatedAsset = await findAssetOrCreate(user.uid);
return { 
  success: true, 
  data: { successCount, failedCount, entries },
  asset: updatedAsset 
};
```

### Frontend 동기화
```typescript
// API 호출 후 자동 동기화
const result = await lottoApi.participate(numbers);
if (result.asset) {
  updateAsset(result.asset);  // Store 자동 업데이트
}
```

## 🔍 적용 기준

### 언제 사용하나?
1. **자산/포인트 변경** - 사용자가 즉시 확인하려는 데이터
2. **상태 변경** - 프로필, 설정 등 화면에 표시되는 정보
3. **카운터 증감** - 티켓, 코인, 경험치 등
4. **실시간성 중요** - 게임, 거래 등

### 언제 생략하나?
1. **로그 성격** - 단순 기록용 데이터
2. **백그라운드** - 사용자가 즉시 확인하지 않는 작업
3. **성능 중요** - 조회 비용이 과도한 경우
4. **배치 처리** - 대량 데이터 처리

## 🛠️ 구현 패턴

### Backend 패턴
```typescript
// 1. 트랜잭션 내에서 처리
await supabase.rpc('process_with_return', {
  // 처리와 조회를 한 번에
});

// 2. 별도 조회
const result = await processData(params);
const updatedData = await getCurrentData(uid);
return { result, data: updatedData };
```

### Frontend 패턴
```typescript
// Store 업데이트 패턴
const handleApiCall = async () => {
  const response = await api.call();
  
  // 응답에 최신 데이터가 있으면 Store 업데이트
  if (response.asset) updateAsset(response.asset);
  if (response.profile) updateProfile(response.profile);
  if (response.stats) updateStats(response.stats);
};
```

### 타입 정의
```typescript
// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  asset?: Asset;      // 자산 정보 (선택적)
  profile?: Profile;  // 프로필 정보 (선택적)
}
```

## 🚫 주의사항

### 성능 고려
```typescript
// ❌ 불필요한 조회
const user = await getFullUserProfile(uid);  // 과도한 데이터
return { result, user };

// ✅ 필요한 데이터만
const asset = await getUserAsset(uid);  // 필수 데이터만
return { result, asset };
```

### 일관성 보장
```typescript
// 트랜잭션 내에서 처리하거나
await supabase.transaction(async (trx) => {
  await updateData(trx);
  const latest = await selectData(trx);
  return latest;
});
```

## 📊 효과 측정

- UI 동기화 지연 감소
- 사용자 만족도 향상  
- 새로고침 횟수 감소
- 고객 문의 감소