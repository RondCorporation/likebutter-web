# Feature Naming Reference

This document explains the difference between internal code names and user-facing display names for image generation features.

## Background

The internal code structure uses the original feature names for consistency and to avoid widespread refactoring. However, the user-facing UI displays updated names for better clarity and branding.

## Feature Name Mappings

| Internal Code Name | Display Name (Korean) | Display Name (English) | Code Keys |
|-------------------|-----------------------|------------------------|-----------|
| `digitalGoods` | 최애 AI스타일 | My Bias AI Style | Internal: digitalGoods, digital-goods |
| `stylist` | 최애의 스타일리스트 | My Bias's Stylist | Internal: stylist |
| `fanmeetingStudio` | AI 팬미팅 | AI Fan Meeting | Internal: fanmeetingStudio, fanmeeting |
| `virtualCasting` | 가상 캐스팅 | Virtual Casting | Internal: virtualCasting, virtual-casting |

## Important Notes

- **Do NOT rename internal code variables, file paths, or API endpoints** - this would require extensive refactoring across the codebase
- **Only update user-facing text** in localization files (`public/locales/*/studio.json`)
- When adding new features or updating UI text, always use the display names from this mapping
- The internal names remain in place for:
  - Database schemas
  - API routes and endpoints
  - Component file names
  - Type definitions
  - Function and variable names

## Files Updated

User-facing text has been updated in:
- `/public/locales/ko/studio.json`
- `/public/locales/en/studio.json`

Look for these sections in the locale files:
- `archive.taskTypes.*Edit`
- `digitalGoods.title`, `digitalGoods.details.creationTitle`, `digitalGoods.messages.*`
- `stylist.title`, `stylist.details.creationTitle`
- `fanmeeting.title` / `fanmeetingStudio.title`
- `modelSelect.tools.*`
- `tools.*`

---

## Adding New Feature Presets (Enum Naming Guide)

When adding new styles, characters, or presets to existing features, follow these conventions:

### 1. Enum Naming Convention

**Pattern: SCREAMING_SNAKE_CASE**

All enum values should use uppercase letters with underscores separating words.

**Examples:**
```typescript
// Virtual Casting Styles
KPOP_DEMON_HUNTERS: 'KPOP_DEMON_HUNTERS'
FROZEN: 'FROZEN'
HARRY_POTTER: 'HARRY_POTTER'

// Fanmeeting Image Prompts
WINTER_SAPPORO: 'WINTER_SAPPORO'
POLAROID: 'POLAROID'
```

**Location:** `app/_lib/apis/task.api.ts`

**Template:**
```typescript
export const FEATURE_STYLES = {
  NEW_STYLE: 'NEW_STYLE',
} as const;

export type FeatureStyle =
  (typeof FEATURE_STYLES)[keyof typeof FEATURE_STYLES];
```

### 2. Image File Naming

**Pattern: Korean names with extension**

Store images in `public/studio/{feature}/` with Korean names.

**Examples:**
```
public/studio/virtual-casting/sidebar-menu-image/케이팝데몬헌터스.png
public/studio/fanmeeting/겨울삿포로.png
public/studio/digital-goods/지브리.png
```

### 3. Translation Keys

Add translations in both `ko/studio.json` and `en/studio.json`:

```json
{
  "virtualCasting": {
    "styles": {
      "KPOP_DEMON_HUNTERS": "케이팝데몬헌터스 스타일"
    }
  },
  "fanmeeting": {
    "imagePrompts": {
      "WINTER_SAPPORO": "겨울 삿포로"
    }
  }
}
```

### 4. Component Integration

```typescript
const items = [
  {
    name: t('feature.styles.NEW_STYLE'),
    image: '한글이름.png',
    style: FEATURE_STYLES.NEW_STYLE,
  },
];
```

### Quick Checklist

When adding a new preset:
- [ ] Add enum to `task.api.ts` (SCREAMING_SNAKE_CASE)
- [ ] Add image to `public/studio/{feature}/` (Korean filename)
- [ ] Add translation to `ko/studio.json`
- [ ] Add translation to `en/studio.json`
- [ ] Add entry to component array
- [ ] Test in both locales
