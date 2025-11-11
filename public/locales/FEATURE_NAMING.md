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
