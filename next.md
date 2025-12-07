# 남은 작업 목록

## 1. `+page.svelte` (홈) - 스타일 전체 작성 필요

스타일 섹션이 비어있음. 360px 기준으로 작성 필요:

- `.home-container`
- `.top-bar`, `.game-title` (24px), `.settings-btn` (32px)
- `.resource-group`, `.resource-badge`, `.resource-icon` (16px), `.resource-value` (12px)
- `.character-area`, `.speech-bubble` (13px), `.character-img` (180px)
- `.run-status`, `.run-info`, `.run-badge` (10px), `.run-capital` (12px)
- `.daily-missions`, `.mission-*` (10-11px)
- `.main-action`, `.play-button` (max-width: 200px, font: 16px)
- `.bottom-menu`, `.menu-btn`, `.menu-icon` (14px), `.menu-label` (10px)
- `.floating-battle` (36px, top: 90px)
- `@keyframes pulse`

## 2. `IngredientSelectScreen.svelte` - 360px 기준 사이즈 조정

- `.info-bar`: px-2 py-1
- `.capital-badge`, `.tax-badge`: px-2 py-1, font-size 11px
- `.star-icon`: 12px
- `.tax-label`: 9px
- `.slot`: 100px x 70px
- `.plus-icon`: 28px
- `.slot-image`: 40px
- `.button-section`: pb-3
- `.cook-button`: max-width 180px, font-size 14px

## 3. `IngredientGrid.svelte` - 완료

- 4단 그리드 적용됨

## 4. `CookingScreen.svelte` - 완료

- 360px 기준 이미 적용됨
