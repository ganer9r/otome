# 요리 게임 이미지 생성 가이드

**버전**: 1.0
**작성일**: 2025-11-21
**이미지 크기**: 256x256 (투명 배경)

---

## 🎨 스타일 정의

### 핵심 키워드
```
- Simple bold cartoon style
- Thick rounded outlines
- Minimal details
- Solid warm pastel colors
- Transparent background
- Pokemon Sleep food style
- Game icon design
- Clean and simple
- Easy to recognize at small size
```

### 스타일 특징
- **부드럽고 귀여운 톤** (파스텔 컬러)
- **굵고 명확한 윤곽선** (아이콘 인식성)
- **최소한의 디테일** (작은 크기 대응)
- **단순한 색상 블록** (복잡한 그라데이션 없음)
- **캐릭터화 금지** (얼굴/눈 없음)

---

## 📐 레이아웃 규칙

### 크기 및 여백
```
- 이미지 크기: 256x256 (square format)
- 오브젝트 크기: 캔버스의 85% 채움
- 여백: 최소한의 균일한 마진
- 정렬: 완벽히 중앙 (perfectly centered)
```

### 배경
```
- Transparent background (투명 배경)
- 흰색 배경 금지
```

---

## 📝 프롬프트 템플릿

### 기본 재료용 (단일 아이템)
```
A [ingredient name], top-down view, simple bold cartoon style, thick rounded outlines, minimal details, large clear shape, solid pastel [color] with simple highlights, transparent background, game icon design, clean and simple, perfectly centered, fills 85% of canvas, Pokemon Sleep food style, easy to recognize at small size, no face, no eyes, square format, 256x256
```

### 복잡한 요리용 (조합 요리)
```
A [dish name], top-down view, simple bold cartoon style, thick rounded outlines, minimal details, large clear shapes, [key ingredients with colors], solid warm pastel colors, transparent background, game icon design, clean and easy to read, perfectly centered, fills 85% of canvas, Pokemon Sleep food style, recognizable at small size, no face, no eyes, square format, 256x256
```

---

## 🍅 예제: 간단한 재료 (토마토)

```
A red tomato, top-down view, simple bold cartoon style, thick rounded outlines, minimal details, large clear shape, solid pastel red color with simple highlights, transparent background, game icon design, clean and simple, perfectly centered, fills 85% of canvas, Pokemon Sleep food style, easy to recognize at small size, no face, no eyes, square format, 256x256
```

**특징:**
- 단일 오브젝트
- 단순한 형태
- 최소 디테일
- 명확한 색상 (빨강)

---

## 🍝 예제: 복잡한 요리 (스파게티)

```
A plate of spaghetti, top-down view, simple bold cartoon style, thick rounded outlines, minimal details, large clear shapes, red pasta with simple sauce, few visible noodle strands, solid warm pastel colors, transparent background, game icon design, clean and easy to read, perfectly centered, fills 85% of canvas, Pokemon Sleep food style, recognizable at small size, no face, no eyes, square format, 256x256
```

**특징:**
- 여러 요소 조합 (면 + 소스)
- 핵심 요소만 표현
- 과도한 디테일 제거
- 읽기 쉬운 구성

---

## ⚠️ 주의사항

### ❌ 금지 키워드/요소
```
- 얼굴/눈/입 (no face, no eyes, no mouth)
- 캐릭터화 (no anthropomorphic features)
- 복잡한 그라데이션
- 과도한 디테일
- 그림자 효과 (subtle shadow 제거)
- 흰색 배경 (white background)
- Realistic 스타일
```

### ✅ 필수 포함
```
- transparent background
- no face, no eyes
- fills 85% of canvas
- square format, 256x256
- top-down view (대부분의 경우)
- thick rounded outlines
- Pokemon Sleep food style
```

---

## 🎯 생성 설정

### AI 도구 파라미터
```
크기: 256x256
포맷: PNG (투명 배경)
종횡비: 1:1 (Square)
스타일: Illustration/Cartoon
```

### 후처리
```
1. 투명 배경 확인
2. 크기 확인 (256x256)
3. 중앙 정렬 확인
4. 얼굴/눈 제거 확인
```

---

## 📊 등급별 적용

### G등급 (기본 재료)
- 단순한 형태
- 단일 오브젝트
- 명확한 색상
- 예: 토마토, 계란, 쌀

### F~E등급 (기본 요리)
- 2~3개 요소 조합
- 단순한 조리 형태
- 예: 계란 후라이, 밥

### D~C등급 (전문 요리)
- 3~5개 요소
- 접시/그릇 포함
- 예: 스파게티, 볶음밥

### B~SSR등급 (고급 요리)
- 5+ 요소
- 복잡한 배치
- 단, 아이콘 인식성 유지 필수
- 예: 파에야, 해물찜

---

## 🔄 업데이트 이력

- **2025-11-21**: 초기 버전 작성
  - Pokemon Sleep 스타일 적용
  - 아이콘 최적화 (굵은 윤곽, 단순화)
  - 캐릭터화 방지 규칙 추가
  - 256x256 크기 확정
