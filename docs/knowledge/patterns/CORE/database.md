# Database 패턴

## 필수 컬럼 패턴

### 모든 테이블 필수
```sql
CREATE TABLE IF NOT EXISTS public.table_name (
  -- Primary Key (항상 bigserial)
  id bigserial NOT NULL PRIMARY KEY,
  
  -- 사용자 참조 (user_id 대신 uid 사용!)
  uid uuid NOT NULL REFERENCES auth.users(id),
  
  -- 타임스탬프 (필수)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Soft Delete (필요시)
  deleted_at timestamptz
);
```

### updated_at 트리거 (필수)
```sql
CREATE TRIGGER table_name__updated_at 
  BEFORE UPDATE ON table_name 
  FOR EACH ROW 
  EXECUTE PROCEDURE extensions.moddatetime(updated_at);
```

## 명명 규칙

### 인덱스
```sql
-- 일반 인덱스
CREATE INDEX table_name__column__idx ON table_name(column);

-- 복합 인덱스  
CREATE INDEX table_name__col1_col2__idx ON table_name(col1, col2);

-- 유니크 인덱스
CREATE UNIQUE INDEX table_name__column__uq ON table_name(column);

-- Soft Delete 고려 (deleted_at이 있는 경우)
CREATE INDEX table_name__uid__idx ON table_name(uid) 
  WHERE deleted_at IS NULL;
```

### 제약조건
```sql
-- 외래키 (CASCADE 절대 금지!)
ALTER TABLE table_name
ADD CONSTRAINT table_name__column__fk 
FOREIGN KEY (column) REFERENCES other_table(id) ON DELETE RESTRICT;

-- 복합 유니크
ALTER TABLE table_name  
ADD CONSTRAINT table_name__col1_col2__uq 
UNIQUE (col1, col2);
```

## RLS (Row Level Security) 패턴

### 기본 설정
```sql
-- RLS 활성화
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 접근
CREATE POLICY "table_name_select" ON table_name
  FOR SELECT USING (uid = auth.uid());

CREATE POLICY "table_name_insert" ON table_name
  FOR INSERT WITH CHECK (uid = auth.uid());

CREATE POLICY "table_name_update" ON table_name
  FOR UPDATE USING (uid = auth.uid());

CREATE POLICY "table_name_delete" ON table_name
  FOR DELETE USING (uid = auth.uid());
```

## 추가 SQL 패턴

### 복합 유니크 제약
```sql
ALTER TABLE table_name 
ADD CONSTRAINT table_name__col1_col2__uq 
UNIQUE (col1, col2);
```

### 부분 인덱스 (성능 최적화)
```sql
CREATE INDEX table_name__uid_status__idx 
ON table_name (uid, status) 
WHERE deleted_at IS NULL;
```

### JSON 컬럼 인덱스
```sql
-- JSONB 컬럼의 특정 필드에 인덱스
CREATE INDEX table_name__metadata_type__idx 
ON table_name ((metadata->>'type'));
```

### 외래키 제약
```sql
-- CASCADE 절대 금지!
ALTER TABLE table_name
ADD CONSTRAINT table_name__fk_column__fk 
FOREIGN KEY (fk_column) REFERENCES other_table(id) ON DELETE RESTRICT;
```

## 절대 금지사항

- ❌ **CASCADE 사용 금지** - 데이터 연쇄 삭제 위험
- ❌ **CHECK 제약 금지** - Supabase 미지원
- ❌ **user_id 사용 금지** - uid 사용