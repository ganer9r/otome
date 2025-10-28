# Create New Task

Task name: $ARGUMENTS

Initialize a new task with proper requirements analysis and planning.

## Step 1: Requirements Analysis (Before "진행")

### 1.1 Task Name Processing
Original: $ARGUMENTS
If Korean → Convert to English folder name
Example: "로또 참여 기능 개선" → "lotto-participation-improvement"

### 1.2 Check PRD
Look for docs/prd/$ARGUMENTS.md:
- If exists → Extract requirements
- If not → Gather requirements through conversation

### 1.3 Requirements Gathering Questions
Ask until we have complete picture:
1. What is the main goal?
2. Who are the users?
3. What actions will they perform?
4. What data needs to be stored?
5. Any business rules?
6. External integrations?
7. UI/UX requirements?

### 1.4 Data Modeling
Based on requirements, design:
- **Tables**: List all entities with main columns
- **Relationships**: How tables connect
- **Business Logic**: Core functions needed
- **API Endpoints**: Required endpoints
- **UI Pages**: Screens needed

### 1.5 Show Analysis Summary
Present the analysis to user:
```
📊 Requirements Analysis Complete!

📌 Feature: [description]

📦 Data Model:
- Table1: [columns]
- Table2: [columns]

⚙️ Core Functions:
- function1: [purpose]
- function2: [purpose]

🖥️ UI Screens:
- Page1: [description]
- Page2: [description]

Ready to create task structure?
Type "진행" to proceed.
```

## Step 2: Task Creation (After "진행")

Only after user confirms with "진행":

### 2.1 Show PLAN.md Preview (한글)
Display the planned content in Korean BEFORE creating files:

```markdown
📝 PLAN.md 미리보기:
----------------------------------------
# Task: 로또 참여 기능 개선
# Folder: lotto-participation-improvement

## 요구사항 요약
[요구사항 요약 내용]

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] 요구사항 분석 및 확인
- [x] 데이터베이스 설계 검증

### Phase 1: Database (5개)
- [ ] lotto_entries 테이블 생성
- [ ] lotto_draws 테이블 생성
- [ ] 마이그레이션 작성
- [ ] 인덱스 추가
- [ ] 타입 생성

### Phase 2: Backend (7개)
- [ ] participateInLotto API 업데이트 (티켓 수 반환)
- [ ] getCurrentAsset 헬퍼 함수 추가
- [ ] API 응답 타입 정의 업데이트
- [ ] 테스트 작성 - 로또 참여
- [ ] 테스트 작성 - 당첨 확인
- [ ] 에러 처리 로직 추가
- [ ] 트랜잭션 처리 구현

### Phase 3: Frontend (4개)
- [ ] ParticipateSection에 낙관적 업데이트 구현
- [ ] assetStore 서버 응답 동기화 업데이트
- [ ] 로딩 상태 및 에러 롤백 처리 추가
- [ ] 실시간 티켓 표시 업데이트

### Phase 4: Testing (2개)
- [ ] 대량 참여 테스트 (100장)
- [ ] 성공/실패 시나리오 UI 업데이트 검증
----------------------------------------

📁 생성될 위치: docs/tasks/lotto-participation-improvement/

이 내용으로 작업을 생성할까요? 
- "확인" → 파일 생성
- "수정" → 내용 조정
- "취소" → 작업 취소
```

### 2.2 After Confirmation ("확인")
Only when user approves:

1. Create folder structure
2. Write PLAN.md file
3. Initialize PROGRESS.md
4. Set memory
5. Show completion message
Based on the analysis from Step 1, create specific TodoList:

```markdown
# Task: [Original Name]
# Folder: [English name]

## Requirements Summary
[From Step 1 analysis]

## Data Model
[From Step 1 analysis]

## 📋 Master TodoList

### Phase 0: Modeling (2/2) ✅
- [x] Requirements analyzed
- [x] Data model designed

### Phase 1: Database ([N] items)
[Specific tasks based on data model]
- [ ] Create [table1] with [columns]
- [ ] Create [table2] with [columns]
- [ ] Write migration
- [ ] Generate types

### Phase 2: Backend ([N] items)
[Specific tasks based on business logic]
- [ ] Test for [function1]
- [ ] Implement [function1]
- [ ] Test for [function2]
- [ ] Implement [function2]
- [ ] Create [endpoint1]
- [ ] Create [endpoint2]

### Phase 3: Frontend ([N] items)
[Specific tasks based on UI requirements]
- [ ] Create [page1]
- [ ] Build [component1]
- [ ] Create [page2]
- [ ] API integration

### Phase 4: Testing ([N] items)
- [ ] Integration tests
- [ ] E2E tests
```

### 2.3 Initialize PROGRESS.md
```markdown
# Progress Log: [task-name]

## Task Info
- Created: [timestamp]
- Status: READY TO START

## Sessions
<!-- Work will be logged here -->
```

### 2.4 Set Memory
Store as current task:
- current_task = "[english-name]"
- requirements = [analyzed data]
- total_tasks = [count]

## Step 3: Task Creation Complete

### 3.1 Final Message
```
✅ Task creation complete!

📁 Created files:
- docs/tasks/[name]/PLAN.md
- docs/tasks/[name]/PROGRESS.md

📊 Summary:
- Total tasks: [N] items
- Estimated time: [X] hours
- First task: [first item]

💾 Saved to memory as current task

---
🎯 Task creation is done!

To start working:
- Use "/task:resume" or 
- Simply say "let's start working"

/task:new command completed.
```

## Important: Scope Limitation

**/task:new ONLY does:**
1. Gather requirements
2. Show PLAN.md preview
3. Create files after approval
4. Save to memory
5. **END** - Do not start working!

**/task:new NEVER does:**
- Execute any tasks
- Call sub-agents
- Implement anything
- Start Phase 1

The actual work starts with a separate command or request.

## Important Rules

1. **DO NOT create any files before "진행"**
2. **DO NOT generate PLAN.md before "진행"**
3. **ONLY analyze and discuss requirements first**
4. **WAIT for user confirmation with "진행"**
5. **THEN create everything at once**

This ensures requirements are fully understood before committing to a task structure.