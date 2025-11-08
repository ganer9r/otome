# Task: 챕터 목록 + 스크립트 사이드 패널 통합
# Folder: chapter-script-side-panel

## 요구사항 요약
챕터 목록 페이지에서 챕터 클릭 시 오른쪽 사이드 패널(60% 너비)로 스크립트 뷰어 및 생성기를 표시합니다.
기존 독립된 script 페이지의 모든 기능(JSON 표시, 생성/재생성)을 패널 안으로 통합하여 UX를 개선합니다.

### 핵심 요구사항
- 챕터 카드 클릭 → 오른쪽 사이드 패널 열림 (60% 너비)
- 스크립트 JSON 원본 표시
- 스크립트 생성/재생성 기능
- URL 쿼리 파라미터로 상태 관리 (?chapter=id)
- 챕터-스크립트 연결 관계 설정

## 데이터 모델

### 테이블 변경
- **scripts 테이블**: `chapter_id` 컬럼 확인 및 추가 (없을 경우)
- **관계**: chapters 1:N scripts

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 및 확인
- [x] 데이터베이스 설계 검증

### Phase 1: Database (4/4) ✅
- [x] scripts 테이블의 chapter_id 컬럼 존재 확인
- [x] chapter_id 컬럼 없으면 마이그레이션 작성
- [x] scripts-chapters 외래 키 제약 조건 추가
- [x] 타입 재생성 (schema.gen.ts)

### Phase 2: 사이드 패널 컴포넌트 (6/6) ✅
- [x] ScriptSidePanel.svelte 기본 구조 생성
- [x] 60% 너비 레이아웃 및 슬라이드 애니메이션 구현
- [x] 패널 헤더 (챕터 정보, 닫기 버튼) 구현
- [x] 스크립트 생성 폼 (textarea, 버튼) 구현
- [x] 스크립트 JSON 표시 영역 구현
- [x] 로딩/에러 상태 UI 추가

### Phase 3: Backend API (5/5) ✅
- [x] 스크립트 생성 API에 chapterId 파라미터 추가
- [x] 스크립트 저장 시 chapter_id 연결 로직 구현
- [x] 챕터별 스크립트 조회 API 생성 (GET /chapters/[id]/script)
- [x] ScriptApi 클라이언트에 챕터별 조회 메서드 추가
- [x] API 응답 타입 업데이트

### Phase 4: 챕터 목록 페이지 통합 (7/7) ✅
- [x] chapters/+page.svelte에 ScriptSidePanel 컴포넌트 추가
- [x] 선택된 챕터 상태 관리 (selectedChapterId)
- [x] 챕터 카드 클릭 이벤트 핸들러 구현
- [x] URL 쿼리 파라미터 (?chapter=id) 동기화
- [x] 패널 열림 상태에 따른 레이아웃 조정 (40% + 60%)
- [x] 페이지 로드 시 쿼리 파라미터 기반 패널 자동 열기
- [x] 패널 닫기 시 URL 쿼리 파라미터 제거

### Phase 5: Testing & 마무리 (5/5) ✅
- [x] 패널 열기/닫기 동작 테스트
- [x] 스크립트 생성/재생성 기능 테스트
- [x] URL 상태 동기화 테스트
- [x] 챕터-스크립트 연결 확인
- [x] 기존 script 페이지 처리 방안 결정 및 적용

---

## ✅ 프로젝트 완료 상태

**총 작업**: 29개 항목 (100% 완료)
**실제 소요 시간**: 약 32분
**완료 일시**: 2025-11-09 07:24

### 완료된 모든 Phase
- ✅ Phase 0: Modeling (2/2)
- ✅ Phase 1: Database (4/4)
- ✅ Phase 2: 사이드 패널 컴포넌트 (6/6)
- ✅ Phase 3: Backend API (5/5)
- ✅ Phase 4: 챕터 목록 페이지 통합 (7/7)
- ✅ Phase 5: Testing & 마무리 (5/5)

### 최종 결과
✨ **챕터 목록 + 스크립트 사이드 패널 통합** 작업 완료!
