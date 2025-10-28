# Task Knowledge Management

Manage knowledge base as part of task workflow.

## Usage
```
/task:knowledge [action]
```

## Actions

### status (default)
Show knowledge base statistics

### organize
Auto-organize patterns by usage count:
- 0-2 uses → REVIEW/
- 3-9 uses → VERIFIED/
- 10+ uses → CORE/
- 6+ months unused → DEPRECATED/

### cleanup
Remove deprecated and unused patterns

### stats
Show usage statistics and recommendations

## 1. Status Check

```markdown
📚 Knowledge Status

Patterns:
- CORE: N files (핵심)
- VERIFIED: N files (검증됨)
- REVIEW: N files (검토 중)
- DEPRECATED: N files (폐기 예정)

Issues: N files
Decisions: N files
```

## 2. Auto-Organize

Move patterns based on metadata:
```yaml
usage_count: N
last_used: date
status: REVIEW/VERIFIED/CORE/DEPRECATED
```

## 3. Show Recommendations

```markdown
## 추천 작업
1. 승격: pattern-name → VERIFIED (3회 사용)
2. 승격: pattern-name → CORE (10회 사용)
3. 폐기: pattern-name (6개월 미사용)

적용? (yes/no)
```

## Example

```bash
User: /task:knowledge

Claude:
📚 Knowledge Base 현황

패턴:
- CORE: 5개
- VERIFIED: 8개
- REVIEW: 3개 (신규)
- DEPRECATED: 2개

추천:
- 'optimistic-updates' → VERIFIED 승격 (3회 사용)
- 'old-api' → DEPRECATED 이동 (7개월 미사용)

정리할까요? (yes/no)
```

## Integration with task:complete

When /task:complete runs:
1. Extract new patterns → REVIEW/
2. Update usage counts
3. Check for auto-promotion
4. Suggest /task:knowledge if needed