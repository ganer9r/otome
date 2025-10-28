# Resume Task

Check task status and identify next actions.

Task name (optional): $ARGUMENTS

## 1. Check Current Task

### If no arguments provided
Look for active tasks in docs/tasks/:
- List all folders
- Show progress for each
- Let user select

### If task name provided
Go directly to that task

## 2. Load Task Information

Read from docs/tasks/[task-name]/:
- PLAN.md - Get TodoList and progress
- PROGRESS.md - Check last session
- DECISIONS.md - Review any decisions (if exists)

## 3. Display Current Status

Show current state:
```markdown
📂 작업: [task-name]
📊 진행률: X/Y (Z%)
📍 현재 Phase: [phase name]
⏰ 마지막 작업: [last completed item]
```

## 4. Find Next Task

From PLAN.md, find first unchecked [ ] item:
```markdown
🎯 다음 작업: [task description]
📋 Phase: [phase name]
🤖 담당: [agent name]
```

## 5. Ask User for Next Action

### 5.1 Present options
"[작업 내용]을 진행할까요?"
- "예" → Claude executes immediately (calls sub-agent)
- "아니오" → End session
- "다른 작업" → Select different item

### 5.2 User decides
- task:resume only checks status (NO execution)
- Actual execution happens after user approval by Claude

## 6. Execution (After User Approval)

When user approves with "예":

### 6.1 Claude executes directly or calls sub-agent
- Database work → Call Database Engineer
- Backend work → Call Backend Developer  
- Frontend work → Call Frontend Developer
- Testing work → Claude coordinates directly

### 6.2 Real-time document updates (🔥 REQUIRED)
**Immediately after task completion:**
- Update PLAN.md checkbox to [x]
- Record detailed log in PROGRESS.md
- Specify modified file paths and changes

### 6.3 PROGRESS.md record format
```markdown
### [시간] - [작업명] 완료
- 담당: [에이전트명/메인]
- 수정 파일:
  - /path/file.ts: 변경 내용
- 결과: 성공/실패
- 다음: [다음 작업]
```

## 7. Report Progress

Show updated status:
```markdown
✅ 작업 완료: [completed task]

📊 업데이트된 진행률:
- [Phase]: X/Y (Z%)
- 전체: A/B (C%)

🎯 다음 작업: [next task]

계속하시겠습니까? 
- "계속" → 다음 작업 진행
- "중단" → 세션 종료
- "다른 작업" → 다른 항목 선택
```

## 8. Loop or End

### If "계속"
Go back to step 5 with next task

### If "중단"
Save current state and end:
```markdown
💾 진행 상황 저장됨
- 작업: [task-name]
- 진행률: X/Y (Z%)
- 다음에 할 일: [next task]

다시 시작하려면 /task:resume [task-name]
```

### If "다른 작업"
Show TodoList and let user pick

## Important Rules

1. **task:resume only checks status (NO execution)**
2. **User approval required before Claude executes**
3. **🔥 Update documents immediately after task completion**
4. **🔥 Record modified file paths and changes**
5. **User instructions have absolute priority**

## Example Usage

### First time
```bash
User: /task:resume

Claude:
📋 진행 중인 작업들:
1. lotto-feature (25%)
2. user-profile (60%)
3. payment-system (10%)

어느 작업을 진행할까요?

User: 1

Claude:
📂 작업: lotto-feature
📊 진행률: 5/20 (25%)
🎯 다음: "마이그레이션 작성"

진행할까요?
```

### Direct resume
```bash
User: /task:resume lotto-feature

Claude:
📂 작업: lotto-feature
📊 진행률: 5/20 (25%)
🎯 다음: "마이그레이션 작성"

Database Engineer를 호출하여 진행할까요?

User: 예

Claude:
Database Engineer를 호출합니다.
[작업 수행...]

✅ 완료!
📝 PLAN.md 업데이트: [x] 마이그레이션 작성
📝 PROGRESS.md 로깅 완료

진행률: 6/20 (30%)
다음: "타입 생성"

계속할까요?
```