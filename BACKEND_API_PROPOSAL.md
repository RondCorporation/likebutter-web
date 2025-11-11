# 백엔드 API 제안서

## 개요

이 문서는 다음 기능을 지원하기 위해 필요한 백엔드 API 변경사항을 설명합니다:
1. 가상 캐스팅 신규 스타일: **케이팝데몬헌터스**
2. 팬미팅 스튜디오 API 업데이트: **듀얼 모드 지원** (텍스트 프롬프트 vs 이미지 프롬프트)

프론트엔드 구현은 완료되었으며 백엔드 연동을 위해 준비되었습니다.

---

## 1. 가상 캐스팅 - 케이팝데몬헌터스 스타일 추가

### 현재 상태
- ✅ 프론트엔드 enum 추가 완료: `KPOP_DEMON_HUNTERS`
- ✅ UI 컴포넌트에 캐릭터 카드 추가 완료
- ✅ 번역 키 추가 완료 (한국어 & 영어)
- ✅ 이미지 에셋 배치 완료: `public/studio/virtual-casting/sidebar-menu-image/케이팝데몬헌터스.png`

### 백엔드 변경사항

#### 1.1 스타일 Enum 업데이트

**작업:** `VirtualCastingStyle` enum에 `KPOP_DEMON_HUNTERS` 값 추가

#### 1.2 스타일 처리

**요구사항:**
- 케이팝데몬헌터스 스타일을 위한 캐릭터 참조 이미지/프롬프트 추가
- 이미지 생성 모델이 이 새로운 스타일을 인식하도록 설정
- 변환 품질 테스트

**API 엔드포인트:** `POST /api/v1/tasks/virtual-casting`

**요청 본문 (변경 없음):**
```
image: <파일>
style: "KPOP_DEMON_HUNTERS"
```

---

## 2. 팬미팅 스튜디오 - 듀얼 모드 지원

### 현재 상태
- ✅ 프론트엔드 모드 토글 UI 업데이트 완료 (텍스트/이미지)
- ✅ API 요청 구조 업데이트 완료
- ✅ 양 모드에 대한 폼 유효성 검사 업데이트 완료
- ✅ 번역 키 추가 완료
- ✅ 이미지 에셋 추가 완료: `겨울삿포로.png`, `폴라로이드.png`

### 백엔드 변경사항

#### 2.1 요청 모델 업데이트

**현재 필수 필드:**
- `situationPrompt` (String)
- `backgroundPrompt` (String)

**새로운 필드 구조:**
- `mode` (String, 선택적, 기본값: "text")
  - 가능한 값: `"text"` 또는 `"image"`

- **텍스트 모드** (`mode = "text"`일 때):
  - `situationPrompt` (String, 필수)
  - `backgroundPrompt` (String, 필수)

- **이미지 모드** (`mode = "image"`일 때):
  - `imagePromptStyle` (String, 필수)
  - 가능한 값: `"WINTER_SAPPORO"` 또는 `"POLAROID"`

#### 2.2 이미지 프롬프트 스타일 Enum 추가

**작업:** `FanmeetingImagePromptStyle` enum 생성

**값:**
- `WINTER_SAPPORO` - 겨울 삿포로 스타일
- `POLAROID` - 폴라로이드 사진 스타일

#### 2.3 유효성 검사 규칙

**필수 검사:**
1. 두 이미지 파일(`image1`, `image2`)은 항상 필수
2. `mode = "text"` 인 경우:
   - `situationPrompt`와 `backgroundPrompt` 필수
3. `mode = "image"` 인 경우:
   - `imagePromptStyle` 필수

#### 2.4 이미지 프롬프트 처리

**이미지 프롬프트 설명:**

**WINTER_SAPPORO (겨울 삿포로)**
- 스타일: 일본 삿포로의 겨울 장면
- 분위기: 눈 내리는, 로맨틱한, 아늑한 겨울 분위기
- 배경: 눈 덮인 거리, 따뜻한 조명, 크리스마스/겨울 장식
- AI 프롬프트 제안: "눈이 내리는 삿포로의 겨울 장면, 따뜻한 가로등, 로맨틱한 분위기, 아늑한 겨울 설정"

**POLAROID (폴라로이드)**
- 스타일: 빈티지 폴라로이드 사진 미학
- 분위기: 향수를 불러일으키는, 따뜻한 톤, 약간 바랜 느낌
- 배경: 단순하거나 흐린 배경에 폴라로이드 프레임 효과
- AI 프롬프트 제안: "따뜻한 톤의 빈티지 폴라로이드 사진 스타일, 약간 바랜 느낌, 흰색 프레임 테두리, 향수를 불러일으키는 미학"

#### 2.5 API 엔드포인트 (업데이트)

**엔드포인트:** `POST /api/v1/tasks/fanmeeting-studio`

**요청 형식:** `multipart/form-data`

**텍스트 모드 예시:**
```
POST /api/v1/tasks/fanmeeting-studio

image1: <팬 이미지 파일>
image2: <아이돌 이미지 파일>
mode: "text"
situationPrompt: "손잡기"
backgroundPrompt: "카페"
```

**이미지 모드 예시:**
```
POST /api/v1/tasks/fanmeeting-studio

image1: <팬 이미지 파일>
image2: <아이돌 이미지 파일>
mode: "image"
imagePromptStyle: "WINTER_SAPPORO"
```

**응답 (변경 없음):**
```json
{
  "status": 200,
  "data": {
    "taskId": 12345,
    "status": "PENDING",
    "actionType": "FANMEETING_STUDIO",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 3. 프론트엔드 요청 예시

### 3.1 가상 캐스팅 요청

```typescript
// 프론트엔드 코드 (이미 구현됨)
const formData = new FormData();
formData.append('image', userImageFile);
formData.append('style', 'KPOP_DEMON_HUNTERS');

const response = await fetch('/api/v1/tasks/virtual-casting', {
  method: 'POST',
  body: formData
});
```

### 3.2 팬미팅 텍스트 모드 요청

```typescript
// 프론트엔드 코드 (이미 구현됨)
const formData = new FormData();
formData.append('image1', fanImageFile);
formData.append('image2', idolImageFile);
formData.append('mode', 'text');
formData.append('situationPrompt', '손잡기');
formData.append('backgroundPrompt', '카페');

const response = await fetch('/api/v1/tasks/fanmeeting-studio', {
  method: 'POST',
  body: formData
});
```

### 3.3 팬미팅 이미지 모드 요청

```typescript
// 프론트엔드 코드 (이미 구현됨)
const formData = new FormData();
formData.append('image1', fanImageFile);
formData.append('image2', idolImageFile);
formData.append('mode', 'image');
formData.append('imagePromptStyle', 'WINTER_SAPPORO');

const response = await fetch('/api/v1/tasks/fanmeeting-studio', {
  method: 'POST',
  body: formData
});
```

---

## 4. 데이터베이스 스키마 업데이트 (필요시)

### 4.1 FanmeetingStudio 테이블

**추가 가능한 컬럼:**
- `mode` (VARCHAR(10), DEFAULT 'text')
- `image_prompt_style` (VARCHAR(50), NULLABLE)

**제약 조건:**
- `mode = 'text'`일 때: `situation_prompt`와 `background_prompt`가 NOT NULL
- `mode = 'image'`일 때: `image_prompt_style`이 NOT NULL

---

## 5. 테스트 체크리스트

### 가상 캐스팅
- [ ] `KPOP_DEMON_HUNTERS` 스타일 enum 값 허용
- [ ] AI 모델이 케이팝데몬헌터스 스타일을 올바르게 생성
- [ ] 작업 완료 후 이미지 URL 반환
- [ ] 잘못된 스타일 값에 대한 에러 처리

### 팬미팅 텍스트 모드 (기존 기능)
- [ ] `situationPrompt`와 `backgroundPrompt`가 포함된 요청 처리
- [ ] AI 모델이 텍스트 프롬프트로 장면 생성
- [ ] 작업 성공적으로 완료

### 팬미팅 이미지 모드 (신규 기능)
- [ ] `imagePromptStyle`이 포함된 요청 처리
- [ ] `WINTER_SAPPORO` 스타일이 올바른 겨울 삿포로 미학 생성
- [ ] `POLAROID` 스타일이 올바른 폴라로이드 사진 미학 생성
- [ ] 작업 성공적으로 완료
- [ ] 이미지 모드에서 `imagePromptStyle` 누락 시 에러 처리
- [ ] 잘못된 `imagePromptStyle` 값에 대한 에러 처리

### 유효성 검사
- [ ] 두 이미지 모두 누락 시 요청 실패
- [ ] 텍스트 모드에서 프롬프트 누락 시 요청 실패
- [ ] 이미지 모드에서 `imagePromptStyle` 누락 시 요청 실패

---

## 6. 마이그레이션 경로

### Phase 1: 백엔드 구현
1. `KPOP_DEMON_HUNTERS` enum 값 추가
2. 팬미팅 요청 모델에 새 필드 추가
3. `FanmeetingImagePromptStyle` enum 추가
4. 듀얼 모드 지원 유효성 검사 로직 구현
5. AI 모델에 이미지 프롬프트 매핑 추가
6. 데이터베이스 스키마 업데이트 (필요시)

### Phase 2: 테스트
1. 새 스타일로 가상 캐스팅 테스트
2. 팬미팅 텍스트 모드 테스트 (회귀 테스트)
3. 두 스타일로 팬미팅 이미지 모드 테스트
4. 모든 엣지 케이스 유효성 검사 테스트

### Phase 3: 배포
1. 백엔드 변경사항 배포
2. 프론트엔드는 이미 배포되어 준비됨
3. 에러 로그 모니터링
4. 사용자 피드백 수집

---

## 7. 백엔드 팀을 위한 참고사항

1. **하위 호환성:** `mode` 필드는 기본값이 `"text"`이므로, 기존 API 클라이언트가 변경 없이 계속 작동합니다.

2. **이미지 프롬프트 확장성:** Enum 구조는 향후 새로운 이미지 프롬프트 스타일을 쉽게 추가할 수 있습니다 (예: `SUMMER_BEACH`, `AUTUMN_CAFE` 등)

3. **에러 응답:** 일관된 에러 응답 형식 사용 권장

4. **AI 모델 설정:** AI 팀과 협력하여:
   - 케이팝데몬헌터스 캐릭터 참조 이미지 추가
   - 겨울 삿포로 및 폴라로이드 스타일 프롬프트 미세 조정
   - 프로덕션 배포 전 출력 품질 테스트

5. **프론트엔드 상태:** 모든 프론트엔드 작업이 완료되었습니다. 백엔드가 이러한 변경사항을 구현하면, 프론트엔드 재배포 없이 기능이 즉시 작동합니다.

---

## 8. 질문 / 확인 필요사항

확인 부탁드립니다:
1. AI 모델이 이러한 새 스타일을 처리할 수 있나요, 아니면 훈련/미세 조정이 필요한가요?
2. 분석 목적으로 `mode` 필드를 데이터베이스에 저장해야 하나요?
3. 제공된 이미지 프롬프트 설명을 선호하시나요, 아니면 AI 팀과 협력하여 개선해야 하나요?
4. 백엔드 구현 일정은 어떻게 되나요?

---

## 연락처

이 제안서에 대한 질문이나 명확한 설명이 필요하시면 프론트엔드 팀에 문의해주세요.

**프론트엔드 구현:** ✅ 완료 및 연동 준비 완료
**백엔드 구현:** ⏳ 구현 대기 중
