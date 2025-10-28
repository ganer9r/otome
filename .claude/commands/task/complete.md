# Complete Task

Complete current task and extract learnings.

Additional subcommands:
- /task:knowledge - Manage knowledge base

## 1. Check Completion

```markdown
📂 작업: [task-name]
✅ 완료: X/Y (Z%)
⚠️ 미완료: N개

완료 처리? (예/아니오)
```

## 2. Generate Summary

```markdown
## 작업 완료
- 시작: [date]
- 완료: [date]
- 소요: [time]
- 완료율: X/Y (Z%)
```

## 3. Extract Knowledge

### 3.1 Check for Patterns
New reusable patterns found?
- First save to: knowledge/patterns/REVIEW/
- Add metadata (usage count: 1, created: date)

### 3.2 Check for Issues
Problems solved during task?
- Save to: knowledge/issues/
- Include problem, solution, prevention

### 3.3 Check for Decisions
Important choices made?
- Save to: knowledge/decisions/
- Include options, choice, rationale

### 3.4 Knowledge File Structure

For patterns:
```markdown
# Pattern Name

## Metadata
- Created: [date]
- Usage: 1
- Status: REVIEW
- Last Used: [date]

## Content
[Pattern description and code]
```

Auto-promotion rules:
- 3+ uses → REVIEW to VERIFIED
- 10+ uses → VERIFIED to CORE
- 6 months unused → DEPRECATED

## 4. Mark Complete (Don't Delete)

Create COMPLETED.md marker
Suggest rename: [task-name] → [task-name]-DONE

## 5. Session Retrospective

### 5.1 Overall Evaluation
"이번 작업 세션 어떠셨나요? (0-10점)"
- 10: 완벽함
- 7-9: 좋음
- 4-6: 보통
- 1-3: 개선 필요

### 5.2 Score Explanation
"왜 그 점수인가요?"
- What went well?
- What didn't?

### 5.3 Improvement Strategy (Small Steps)
"점수를 높이려면?"
- Small, actionable improvements
- Not giant leaps, but incremental changes

### 5.4 Generic Lessons
"이번에 배운 범용적 교훈은?"
- Not task-specific
- Applicable to future projects
- General collaboration wisdom

### 5.5 CLAUDE.md Update Check
"CLAUDE.md에 추가할 내용이 있나요?"
- New patterns discovered?
- Process improvements?
- Better collaboration methods?

If yes → Update CLAUDE.md

## 6. Clear Memory

```yaml
current_task: null
```

## 7. Final Message

```markdown
✅ 작업 완료: [task-name]

📊 결과: X/Y (Z%)
📁 파일: 보존됨 ([task-name]-DONE/)
💡 지식: N개 추출됨
📈 세션 평가: [score]/10

다음 작업: /task:new 또는 /task:resume
```

## Example

```bash
User: /task:complete

Claude:
📂 lotto-participation
✅ 19/20 (95%)

완료 처리할까요?

User: 예

Claude:
## 세션 회고

이번 작업 어떠셨나요? (0-10점)

User: 8

Claude:
좋네요! 왜 8점인가요?

User: 빠르게 진행됐는데 중간에 파일 업데이트를 깜빡했어

Claude:
점수를 높이려면 어떻게 할까요?

User: 작업할 때마다 자동으로 PLAN.md 업데이트하기

Claude:
좋은 아이디어네요! 범용적 교훈이 있나요?

User: "각 작업 후 즉시 문서 업데이트"를 원칙으로

Claude:
CLAUDE.md에 이 원칙을 추가할까요?

User: 응

Claude:
✅ CLAUDE.md 업데이트 완료

작업 완료!
- 결과: 95%
- 세션 평가: 8/10
- 개선사항: 즉시 문서 업데이트

파일은 docs/tasks/lotto-participation-DONE/에 보존됨
```