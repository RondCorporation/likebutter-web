# Task API 명세서

## 목차
1. [개요](#개요)
2. [공통 응답 구조](#공통-응답-구조)
3. [Enum 정의](#enum-정의)
4. [Task 생성 API](#task-생성-api)
5. [Task 편집 API](#task-편집-api)
6. [Task 조회 API](#task-조회-api)
7. [Task 관리 API](#task-관리-api)
8. [에러 응답](#에러-응답)

---

## 개요

Task API는 AI 기반 콘텐츠 생성 작업을 관리하는 API입니다. 총 5가지 타입의 작업을 지원합니다:

### 지원하는 Task 타입

| ActionType | 설명 | 편집 지원 | 카테고리 |
|-----------|------|----------|---------|
| `DIGITAL_GOODS` | 디지털 굿즈 생성 (단일 이미지 → 스타일 적용) | ✅ | IMAGE |
| `VIRTUAL_CASTING` | 가상 캐스팅 이미지 생성 | ✅ | IMAGE |
| `STYLIST` | AI 스타일링 제안 (다중 참조 이미지 지원) | ✅ | IMAGE |
| `FANMEETING_STUDIO` | 팬미팅 이미지 생성 (2인 합성) | ✅ | IMAGE |
| `BUTTER_COVER` | AI 보이스 커버 생성 (오디오) | ❌ | AUDIO |

### 인증

모든 Task API는 JWT 인증이 필요합니다.

```
Authorization: Bearer {accessToken}
```

또는 HttpOnly Cookie를 통한 인증 지원.

---

## 공통 응답 구조

### SuccessResponseEntity 구조

모든 성공 응답은 다음 구조를 따릅니다:

```json
{
  "status": 200,
  "data": {
    // 실제 데이터
  }
}
```

### 페이징 응답 구조

Page 객체를 반환하는 경우:

```json
{
  "status": 200,
  "data": {
    "content": [ /* 데이터 배열 */ ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 42,
    "totalPages": 5,
    "last": false,
    "first": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 10,
    "empty": false
  }
}
```

---

## Enum 정의

### ActionType

```java
public enum ActionType {
    BUTTER_COVER,              // 오디오 커버 생성
    DIGITAL_GOODS,             // 디지털 굿즈 생성
    VIRTUAL_CASTING,           // 가상 캐스팅
    FANMEETING_STUDIO,         // 팬미팅 스튜디오
    STYLIST,                   // 스타일리스트
    DIGITAL_GOODS_EDIT,        // 디지털 굿즈 편집
    VIRTUAL_CASTING_EDIT,      // 가상 캐스팅 편집
    FANMEETING_STUDIO_EDIT,    // 팬미팅 스튜디오 편집
    STYLIST_EDIT               // 스타일리스트 편집
}
```

### GenerationStatus

```java
public enum GenerationStatus {
    PENDING,      // 대기 중
    PROCESSING,   // 처리 중
    COMPLETED,    // 완료
    FAILED        // 실패
}
```

### TaskCategory (필터링용)

```java
public enum TaskCategory {
    IMAGE,  // 이미지 생성 작업
    AUDIO   // 오디오 생성 작업
}
```

---

## Task 생성 API

### 1. Digital Goods Task 생성

아이돌/팬 이미지를 업로드하여 디지털 굿즈 생성

**Endpoint**
```
POST /api/v1/tasks/digital-goods
```

**Request**
- Content-Type: `multipart/form-data`
- Authorization: Required

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `image` | File | ✅ | 아이돌 이미지 파일 (JPEG, PNG 등) |
| `style` | String | ❌ | 디지털 굿즈 스타일 (예: `GHIBLI`, `ANIME`, `REALISTIC`) |

**Request Example**
```bash
curl -X POST "https://api.likebutter.io/api/v1/tasks/digital-goods" \
  -H "Authorization: Bearer {token}" \
  -F "image=@idol.jpg" \
  -F "style=GHIBLI"
```

**Response**
```json
{
  "status": 200,
  "data": {
    "taskId": 12345,
    "status": "PENDING",
    "actionType": "DIGITAL_GOODS",
    "createdAt": "2025-01-15T10:30:45"
  }
}
```

**Response Fields**

| 필드 | 타입 | 설명 |
|-----|------|------|
| `taskId` | Long | 생성된 Task ID |
| `status` | GenerationStatus | Task 상태 (초기값: PENDING) |
| `actionType` | ActionType | 작업 타입 (DIGITAL_GOODS) |
| `createdAt` | DateTime | 생성 시각 (ISO 8601) |

---

### 2. Virtual Casting Task 생성

아이돌 이미지를 기반으로 가상 캐스팅 이미지 생성

**Endpoint**
```
POST /api/v1/tasks/virtual-casting
```

**Request**
- Content-Type: `multipart/form-data`
- Authorization: Required

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `image` | File | ✅ | 아이돌 이미지 파일 (JPEG, PNG 등) |
| `style` | String | ❌ | 버추얼 캐스팅 스타일 (예: `FROZEN`, `SIMPSONS`, `FANTASY`) |

**Request Example**
```bash
curl -X POST "https://api.likebutter.io/api/v1/tasks/virtual-casting" \
  -H "Authorization: Bearer {token}" \
  -F "image=@idol.jpg" \
  -F "style=FROZEN"
```

**Response**
```json
{
  "status": 200,
  "data": {
    "taskId": 12346,
    "status": "PENDING",
    "actionType": "VIRTUAL_CASTING",
    "createdAt": "2025-01-15T10:31:00"
  }
}
```

---

### 3. Stylist Task 생성

아이돌 이미지에 다양한 스타일 요소를 적용하여 새로운 스타일링 제안

**Endpoint**
```
POST /api/v1/tasks/stylist
```

**Request**
- Content-Type: `multipart/form-data`
- Authorization: Required

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `image` | File | ✅ | 주 아이돌 이미지 파일 (JPEG, PNG 등) |
| `prompt` | String | ❌ | 스타일 프롬프트 (전체적인 스타일 설명) |
| `hairStyleReference` | File | ❌ | 헤어 스타일 참조 이미지 |
| `outfitReference` | File | ❌ | 의상 참조 이미지 |
| `backgroundReference` | File | ❌ | 배경 참조 이미지 |
| `accessoryReference` | File | ❌ | 액세서리 참조 이미지 |
| `moodReference` | File | ❌ | 무드/분위기 참조 이미지 |
| `customPrompt` | String | ❌ | 커스텀 프롬프트 (추가 상세 요청사항) |

**Request Example**
```bash
curl -X POST "https://api.likebutter.io/api/v1/tasks/stylist" \
  -H "Authorization: Bearer {token}" \
  -F "image=@idol.jpg" \
  -F "prompt=elegant and modern style" \
  -F "hairStyleReference=@hairstyle.jpg" \
  -F "outfitReference=@dress.jpg"
```

**Response**
```json
{
  "status": 200,
  "data": {
    "taskId": 12347,
    "status": "PENDING",
    "actionType": "STYLIST",
    "createdAt": "2025-01-15T10:32:00"
  }
}
```

---

### 4. Fanmeeting Studio Task 생성

팬과 아이돌의 가상 팬미팅 이미지 생성 (2인 합성)

**Endpoint**
```
POST /api/v1/tasks/fanmeeting-studio
```

**Request**
- Content-Type: `multipart/form-data`
- Authorization: Required

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `image1` | File | ✅ | 첫 번째 이미지 파일 (JPEG, PNG 등) |
| `image2` | File | ✅ | 두 번째 이미지 파일 (JPEG, PNG 등) |
| `situationPrompt` | String | ❌ | 상황 프롬프트 (만남의 상황 설명) |
| `backgroundPrompt` | String | ❌ | 배경 프롬프트 (배경 설명) |
| `customPrompt` | String | ❌ | 커스텀 프롬프트 (추가 요청사항) |

**Request Example**
```bash
curl -X POST "https://api.likebutter.io/api/v1/tasks/fanmeeting-studio" \
  -H "Authorization: Bearer {token}" \
  -F "image1=@person1.jpg" \
  -F "image2=@person2.jpg" \
  -F "situationPrompt=handshake" \
  -F "backgroundPrompt=concert hall"
```

**Response**
```json
{
  "status": 200,
  "data": {
    "taskId": 12348,
    "status": "PENDING",
    "actionType": "FANMEETING_STUDIO",
    "createdAt": "2025-01-15T10:33:00"
  }
}
```

---

### 5. Butter Cover Task 생성

음성 파일을 업로드하고 AI 보이스 모델로 커버 생성

**Endpoint**
```
POST /api/v1/tasks/butter-cover
```

**Request**
- Content-Type: `multipart/form-data`
- Authorization: Required

**Parameters**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `audio` | File | ✅ | - | 오디오 파일 (MP3, WAV 등) |
| `voiceModel` | String | ✅ | - | 사용할 AI 보이스 모델 ID |
| `pitchAdjust` | Integer | ❌ | 0 | 피치 조정 값 (-12 ~ +12 반음) |
| `outputFormat` | String | ❌ | mp3 | 출력 오디오 포맷 (mp3, wav 등) |

**Request Example**
```bash
curl -X POST "https://api.likebutter.io/api/v1/tasks/butter-cover" \
  -H "Authorization: Bearer {token}" \
  -F "audio=@song.mp3" \
  -F "voiceModel=idol_voice_001" \
  -F "pitchAdjust=2" \
  -F "outputFormat=mp3"
```

**Response**
```json
{
  "status": 200,
  "data": {
    "taskId": 12349,
    "status": "PENDING",
    "actionType": "BUTTER_COVER",
    "createdAt": "2025-01-15T10:34:00"
  }
}
```

**참고사항**
- BUTTER_COVER는 편집 기능을 지원하지 않습니다.
- 오디오 작업은 이미지 작업보다 처리 시간이 길 수 있습니다.

---

## Task 편집 API

완료된 Task를 기반으로 프롬프트를 변경하여 새로운 버전 생성

### 지원하는 편집 타입
- `DIGITAL_GOODS` → `DIGITAL_GOODS_EDIT`
- `VIRTUAL_CASTING` → `VIRTUAL_CASTING_EDIT`
- `STYLIST` → `STYLIST_EDIT`
- `FANMEETING_STUDIO` → `FANMEETING_STUDIO_EDIT`

**참고:** `BUTTER_COVER`는 편집을 지원하지 않습니다.

---

### 편집 메커니즘 (점진적 편집)

편집 시 **이전 Task의 결과 이미지**가 새로운 편집 Task의 입력 이미지로 사용됩니다.

**동작 방식:**
1. **Task #1 생성** → 원본 이미지 업로드 → 결과: `image_A.jpg`
2. **Task #1 편집** → Task #2 생성 (입력: `image_A.jpg`) → 결과: `image_B.jpg`
3. **Task #2 편집** → Task #3 생성 (입력: `image_B.jpg`) → 결과: `image_C.jpg`

**장점:**
- **점진적 수정**: 이전 결과를 기반으로 계속 개선 가능
- **일관성 유지**: AI가 얼굴 동일성을 유지하면서 수정 적용
- **반복 작업**: 원하는 결과가 나올 때까지 여러 번 편집 가능

**Stylist 및 Fanmeeting Studio 특별 처리:**
- **Stylist**: 메인 이미지는 이전 결과 사용, 참조 이미지들(헤어, 의상 등)은 원본 유지
- **Fanmeeting Studio**: 결과 이미지가 imageKey1으로 사용, imageKey2는 원본 유지 (두 번째 인물은 그대로)

---

### 1. Digital Goods Task 편집

**Endpoint**
```
POST /api/v1/tasks/digital-goods/{taskId}/edit
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `taskId` | Long | 원본 Task ID (편집할 Task) |

**Request Body**
```json
{
  "originalTaskId": 12345,
  "editPrompt": "Make the background more vibrant"
}
```

**Request Fields**

| 필드 | 타입 | 필수 | 설명 |
|-----|------|------|------|
| `originalTaskId` | Long | ✅ | 원본 Task ID (경로의 taskId와 일치해야 함) |
| `editPrompt` | String | ✅ | 편집 프롬프트 (어떻게 수정할지 설명) |

**Response**
```json
{
  "status": 200,
  "data": {
    "taskId": 12350,
    "originalTaskId": 12345,
    "status": "PENDING",
    "actionType": "DIGITAL_GOODS_EDIT",
    "editSequence": 1,
    "createdAt": "2025-01-15T10:35:00"
  }
}
```

**Response Fields**

| 필드 | 타입 | 설명 |
|-----|------|------|
| `taskId` | Long | 새로 생성된 편집 Task ID |
| `originalTaskId` | Long | 원본 Task ID |
| `status` | GenerationStatus | 편집 Task 상태 |
| `actionType` | ActionType | 편집 작업 타입 (예: DIGITAL_GOODS_EDIT) |
| `editSequence` | Integer | 편집 순서 (1부터 시작) |
| `createdAt` | DateTime | 편집 Task 생성 시각 |

**편집 제약사항**
1. 원본 Task는 `COMPLETED` 상태여야 함
2. 원본 Task는 편집 타입이 아니어야 함 (isEditTask = false)
3. 사용자가 원본 Task의 소유자여야 함

---

### 2. Virtual Casting Task 편집

**Endpoint**
```
POST /api/v1/tasks/virtual-casting/{taskId}/edit
```

**Request/Response 구조는 Digital Goods와 동일**

응답 시 `actionType`이 `VIRTUAL_CASTING_EDIT`로 반환됩니다.

---

### 3. Stylist Task 편집

**Endpoint**
```
POST /api/v1/tasks/stylist/{taskId}/edit
```

**Request/Response 구조는 Digital Goods와 동일**

응답 시 `actionType`이 `STYLIST_EDIT`로 반환됩니다.

---

### 4. Fanmeeting Studio Task 편집

**Endpoint**
```
POST /api/v1/tasks/fanmeeting-studio/{taskId}/edit
```

**Request/Response 구조는 Digital Goods와 동일**

응답 시 `actionType`이 `FANMEETING_STUDIO_EDIT`로 반환됩니다.

---

## Task 조회 API

### 1. Task 단일 조회 (상세 정보)

완료된 Task의 상세 정보 조회 (결과 포함)

**Endpoint**
```
GET /api/v1/tasks/{taskId}
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `taskId` | Long | 조회할 Task ID |

**Request Example**
```bash
curl -X GET "https://api.likebutter.io/api/v1/tasks/12345" \
  -H "Authorization: Bearer {token}"
```

**Response (DIGITAL_GOODS 예시)**
```json
{
  "status": 200,
  "data": {
    "taskId": 12345,
    "actionType": "DIGITAL_GOODS",
    "status": "COMPLETED",
    "createdAt": "2025-01-15T10:30:45",
    "parentTaskId": null,
    "editSequence": null,
    "isOriginal": true,
    "isEditTask": false,
    "digitalGoods": {
      "imageUrl": "https://cdn.likebutter.io/results/12345.jpg",
      "filename": "digital_goods_12345.jpg",
      "fileSize": 2048576,
      "executionTime": 12.5,
      "requestImageUrl": "https://cdn.likebutter.io/digital-goods/original_123.jpg"
    },
    "error": null
  }
}
```

**Response (VIRTUAL_CASTING 예시)**
```json
{
  "status": 200,
  "data": {
    "taskId": 12346,
    "actionType": "VIRTUAL_CASTING",
    "status": "COMPLETED",
    "createdAt": "2025-01-15T10:31:00",
    "parentTaskId": null,
    "editSequence": null,
    "isOriginal": true,
    "isEditTask": false,
    "virtualCasting": {
      "imageUrl": "https://cdn.likebutter.io/results/12346.jpg",
      "filename": "virtual_casting_12346.jpg",
      "fileSize": 3145728,
      "executionTime": 15.2,
      "requestImageUrl": "https://cdn.likebutter.io/virtual-casting/original_456.jpg"
    },
    "error": null
  }
}
```

**Response (STYLIST 예시)**
```json
{
  "status": 200,
  "data": {
    "taskId": 12347,
    "actionType": "STYLIST",
    "status": "COMPLETED",
    "createdAt": "2025-01-15T10:32:00",
    "parentTaskId": null,
    "editSequence": null,
    "isOriginal": true,
    "isEditTask": false,
    "stylist": {
      "imageUrl": "https://cdn.likebutter.io/results/12347.jpg",
      "filename": "stylist_12347.jpg",
      "fileSize": 2621440,
      "executionTime": 18.7,
      "requestImageUrl": "https://cdn.likebutter.io/stylist/idol_789.jpg",
      "hairStyleImageUrl": "https://cdn.likebutter.io/stylist/hair_ref.jpg",
      "outfitImageUrl": "https://cdn.likebutter.io/stylist/outfit_ref.jpg",
      "backgroundImageUrl": null,
      "accessoryImageUrl": null,
      "moodImageUrl": null
    },
    "error": null
  }
}
```

**Response (FANMEETING_STUDIO 예시)**
```json
{
  "status": 200,
  "data": {
    "taskId": 12348,
    "actionType": "FANMEETING_STUDIO",
    "status": "COMPLETED",
    "createdAt": "2025-01-15T10:33:00",
    "parentTaskId": null,
    "editSequence": null,
    "isOriginal": true,
    "isEditTask": false,
    "fanmeetingStudio": {
      "imageUrl": "https://cdn.likebutter.io/results/12348.jpg",
      "filename": "fanmeeting_12348.jpg",
      "fileSize": 4194304,
      "executionTime": 22.3,
      "requestImage1Url": "https://cdn.likebutter.io/fanmeeting-studio/person1.jpg",
      "requestImage2Url": "https://cdn.likebutter.io/fanmeeting-studio/person2.jpg"
    },
    "error": null
  }
}
```

**Response (BUTTER_COVER 예시)**
```json
{
  "status": 200,
  "data": {
    "taskId": 12349,
    "actionType": "BUTTER_COVER",
    "status": "COMPLETED",
    "createdAt": "2025-01-15T10:34:00",
    "parentTaskId": null,
    "editSequence": null,
    "isOriginal": true,
    "isEditTask": false,
    "butterCover": {
      "audioUrl": "https://cdn.likebutter.io/results/12349.mp3",
      "filename": "butter_cover_12349.mp3",
      "fileSize": 5242880,
      "executionTime": 45.6
    },
    "error": null
  }
}
```

**Response (편집 Task 예시)**
```json
{
  "status": 200,
  "data": {
    "taskId": 12350,
    "actionType": "DIGITAL_GOODS_EDIT",
    "status": "COMPLETED",
    "createdAt": "2025-01-15T10:35:00",
    "parentTaskId": 12345,
    "editSequence": 1,
    "isOriginal": false,
    "isEditTask": true,
    "digitalGoods": {
      "imageUrl": "https://cdn.likebutter.io/results/12350.jpg",
      "filename": "digital_goods_edit_12350.jpg",
      "fileSize": 2097152,
      "executionTime": 11.8
    },
    "error": null
  }
}
```

**Response Fields (공통)**

| 필드 | 타입 | 설명 |
|-----|------|------|
| `taskId` | Long | Task ID |
| `actionType` | ActionType | 작업 타입 |
| `status` | GenerationStatus | Task 상태 |
| `createdAt` | DateTime | 생성 시각 |
| `parentTaskId` | Long \| null | 원본 Task ID (편집본인 경우) |
| `editSequence` | Integer \| null | 편집 순서 (편집본인 경우) |
| `isOriginal` | Boolean | 원본 Task 여부 |
| `isEditTask` | Boolean | 편집 Task 여부 |
| `error` | String \| null | 에러 메시지 (실패 시) |

**ActionType별 결과 필드**

각 ActionType에 따라 다음 중 하나의 필드가 포함됩니다:

#### digitalGoods (DIGITAL_GOODS, DIGITAL_GOODS_EDIT)
| 필드 | 타입 | 설명 |
|-----|------|------|
| `imageUrl` | String | 결과 이미지 CDN URL |
| `filename` | String | 파일명 |
| `fileSize` | Long | 파일 크기 (bytes) |
| `executionTime` | Double | 실행 시간 (초) |

#### virtualCasting (VIRTUAL_CASTING, VIRTUAL_CASTING_EDIT)
| 필드 | 타입 | 설명 |
|-----|------|------|
| `imageUrl` | String | 결과 이미지 CDN URL |
| `filename` | String | 파일명 |
| `fileSize` | Long | 파일 크기 (bytes) |
| `executionTime` | Double | 실행 시간 (초) |

#### stylist (STYLIST, STYLIST_EDIT)
| 필드 | 타입 | 설명 |
|-----|------|------|
| `imageUrl` | String | 결과 이미지 CDN URL |
| `filename` | String | 파일명 |
| `fileSize` | Long | 파일 크기 (bytes) |
| `executionTime` | Double | 실행 시간 (초) |

#### fanmeetingStudio (FANMEETING_STUDIO, FANMEETING_STUDIO_EDIT)
| 필드 | 타입 | 설명 |
|-----|------|------|
| `imageUrl` | String | 결과 이미지 CDN URL |
| `filename` | String | 파일명 |
| `fileSize` | Long | 파일 크기 (bytes) |
| `executionTime` | Double | 실행 시간 (초) |

#### butterCover (BUTTER_COVER)
| 필드 | 타입 | 설명 |
|-----|------|------|
| `audioUrl` | String | 결과 오디오 CDN URL |
| `filename` | String | 파일명 |
| `fileSize` | Long | 파일 크기 (bytes) |
| `executionTime` | Double | 실행 시간 (초) |

---

### 2. 내 Task 목록 조회

사용자의 모든 Task 목록 조회 (페이징, 필터링 지원)

**Endpoint**
```
GET /api/v1/tasks
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `summary` | Boolean | ❌ | true | true: 요약 정보만, false: 상세 정보 포함 |
| `actionTypes` | List<ActionType> | ❌ | - | 필터링할 ActionType 목록 (쉼표 구분) |
| `category` | TaskCategory | ❌ | - | 카테고리 필터 (IMAGE, AUDIO) |
| `page` | Integer | ❌ | 0 | 페이지 번호 (0부터 시작) |
| `size` | Integer | ❌ | 10 | 페이지 크기 |
| `sort` | String | ❌ | createdAt,desc | 정렬 기준 |

**Request Examples**

```bash
# 기본 조회 (요약 정보, 최신순 10개)
curl -X GET "https://api.likebutter.io/api/v1/tasks" \
  -H "Authorization: Bearer {token}"

# 상세 정보 포함 조회
curl -X GET "https://api.likebutter.io/api/v1/tasks?summary=false" \
  -H "Authorization: Bearer {token}"

# ActionType 필터링 (DIGITAL_GOODS만)
curl -X GET "https://api.likebutter.io/api/v1/tasks?actionTypes=DIGITAL_GOODS" \
  -H "Authorization: Bearer {token}"

# 여러 ActionType 필터링
curl -X GET "https://api.likebutter.io/api/v1/tasks?actionTypes=DIGITAL_GOODS,VIRTUAL_CASTING" \
  -H "Authorization: Bearer {token}"

# 카테고리 필터링 (이미지만)
curl -X GET "https://api.likebutter.io/api/v1/tasks?category=IMAGE" \
  -H "Authorization: Bearer {token}"

# 카테고리 필터링 (오디오만)
curl -X GET "https://api.likebutter.io/api/v1/tasks?category=AUDIO" \
  -H "Authorization: Bearer {token}"

# 페이징 (2페이지, 20개씩)
curl -X GET "https://api.likebutter.io/api/v1/tasks?page=1&size=20" \
  -H "Authorization: Bearer {token}"
```

**Response (summary=true, 요약 정보)**
```json
{
  "status": 200,
  "data": {
    "content": [
      {
        "taskId": 12350,
        "actionType": "DIGITAL_GOODS_EDIT",
        "status": "COMPLETED",
        "createdAt": "2025-01-15T10:35:00",
        "parentTaskId": 12345,
        "editSequence": 1,
        "isOriginal": false,
        "isEditTask": true
      },
      {
        "taskId": 12349,
        "actionType": "BUTTER_COVER",
        "status": "PROCESSING",
        "createdAt": "2025-01-15T10:34:00",
        "parentTaskId": null,
        "editSequence": null,
        "isOriginal": true,
        "isEditTask": false
      },
      {
        "taskId": 12348,
        "actionType": "FANMEETING_STUDIO",
        "status": "COMPLETED",
        "createdAt": "2025-01-15T10:33:00",
        "parentTaskId": null,
        "editSequence": null,
        "isOriginal": true,
        "isEditTask": false
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "empty": false
      }
    },
    "totalElements": 42,
    "totalPages": 5,
    "last": false,
    "first": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 3,
    "empty": false
  }
}
```

**Response (summary=false, 상세 정보)**
```json
{
  "status": 200,
  "data": {
    "content": [
      {
        "taskId": 12350,
        "actionType": "DIGITAL_GOODS_EDIT",
        "status": "COMPLETED",
        "createdAt": "2025-01-15T10:35:00",
        "parentTaskId": 12345,
        "editSequence": 1,
        "isOriginal": false,
        "isEditTask": true,
        "digitalGoods": {
          "imageUrl": "https://cdn.likebutter.io/results/12350.jpg",
          "filename": "digital_goods_edit_12350.jpg",
          "fileSize": 2097152,
          "executionTime": 11.8
        },
        "error": null
      },
      {
        "taskId": 12349,
        "actionType": "BUTTER_COVER",
        "status": "PROCESSING",
        "createdAt": "2025-01-15T10:34:00",
        "parentTaskId": null,
        "editSequence": null,
        "isOriginal": true,
        "isEditTask": false,
        "butterCover": null,
        "error": null
      }
    ],
    "pageable": { /* 동일 */ },
    "totalElements": 42,
    "totalPages": 5,
    "last": false,
    "first": true
  }
}
```

**필터링 동작 방식**

1. **actionTypes 필터**: 지정된 ActionType만 조회
   - 원본 타입 지정 시 자동으로 해당 편집 타입도 포함
   - 예: `DIGITAL_GOODS` 지정 시 `DIGITAL_GOODS_EDIT`도 함께 조회

2. **category 필터**: 카테고리별 조회
   - `IMAGE`: DIGITAL_GOODS, VIRTUAL_CASTING, STYLIST, FANMEETING_STUDIO 및 편집본
   - `AUDIO`: BUTTER_COVER만

3. **actionTypes + category 조합**: category가 우선 적용되고, actionTypes로 추가 필터링

---

### 3. Task 편집 이력 조회

특정 Task의 모든 편집본 조회

**Endpoint**
```
GET /api/v1/tasks/{taskId}/history
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `taskId` | Long | 원본 Task ID |

**Request Example**
```bash
curl -X GET "https://api.likebutter.io/api/v1/tasks/12345/history" \
  -H "Authorization: Bearer {token}"
```

**Response**
```json
{
  "status": 200,
  "data": [
    {
      "taskId": 12355,
      "actionType": "DIGITAL_GOODS_EDIT",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T11:00:00",
      "parentTaskId": 12345,
      "editSequence": 3,
      "isOriginal": false,
      "isEditTask": true
    },
    {
      "taskId": 12352,
      "actionType": "DIGITAL_GOODS_EDIT",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:50:00",
      "parentTaskId": 12345,
      "editSequence": 2,
      "isOriginal": false,
      "isEditTask": true
    },
    {
      "taskId": 12350,
      "actionType": "DIGITAL_GOODS_EDIT",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:35:00",
      "parentTaskId": 12345,
      "editSequence": 1,
      "isOriginal": false,
      "isEditTask": true
    }
  ]
}
```

**참고사항**
- 편집 이력은 최신순으로 정렬됩니다.
- 원본 Task는 포함되지 않습니다.

---

### 4. Task 편집 가능 여부 조회

특정 Task가 편집 가능한지 확인

**Endpoint**
```
GET /api/v1/tasks/{taskId}/can-edit
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `taskId` | Long | 확인할 Task ID |

**Request Example**
```bash
curl -X GET "https://api.likebutter.io/api/v1/tasks/12345/can-edit" \
  -H "Authorization: Bearer {token}"
```

**Response (편집 가능)**
```json
{
  "status": 200,
  "data": true
}
```

**Response (편집 불가)**
```json
{
  "status": 200,
  "data": false
}
```

**편집 가능 조건**
1. Task 상태가 `COMPLETED`
2. Task가 이미 편집본이 아님 (isEditTask = false)
3. ActionType이 다음 중 하나:
   - DIGITAL_GOODS
   - VIRTUAL_CASTING
   - STYLIST
   - FANMEETING_STUDIO

**편집 불가 사유**
- BUTTER_COVER는 편집 불가
- PENDING, PROCESSING, FAILED 상태는 편집 불가
- 이미 편집본인 경우 재편집 불가

---

### 5. 원본 Task만 조회

편집본을 제외한 원본 Task만 조회

**Endpoint**
```
GET /api/v1/tasks/originals
```

**Request Example**
```bash
curl -X GET "https://api.likebutter.io/api/v1/tasks/originals" \
  -H "Authorization: Bearer {token}"
```

**Response**
```json
{
  "status": 200,
  "data": [
    {
      "taskId": 12349,
      "actionType": "BUTTER_COVER",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:34:00",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    },
    {
      "taskId": 12348,
      "actionType": "FANMEETING_STUDIO",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:33:00",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    },
    {
      "taskId": 12345,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:30:45",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    }
  ]
}
```

---

### 6. 편집 가능한 Task만 조회

완료된 원본 Task만 조회 (편집 가능한 Task 목록)

**Endpoint**
```
GET /api/v1/tasks/editable
```

**Request Example**
```bash
curl -X GET "https://api.likebutter.io/api/v1/tasks/editable" \
  -H "Authorization: Bearer {token}"
```

**Response**
```json
{
  "status": 200,
  "data": [
    {
      "taskId": 12348,
      "actionType": "FANMEETING_STUDIO",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:33:00",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    },
    {
      "taskId": 12347,
      "actionType": "STYLIST",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:32:00",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    },
    {
      "taskId": 12345,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:30:45",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    }
  ]
}
```

**참고사항**
- BUTTER_COVER는 제외됩니다.
- COMPLETED 상태만 포함됩니다.
- 편집본은 제외됩니다.

---

### 7. Task 배치 조회

여러 Task를 한 번에 조회

**Endpoint**
```
GET /api/v1/tasks/batch
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `taskIds` | List<Long> | ✅ | 조회할 Task ID 목록 (쉼표 구분) |

**Request Example**
```bash
curl -X GET "https://api.likebutter.io/api/v1/tasks/batch?taskIds=12345,12346,12347" \
  -H "Authorization: Bearer {token}"
```

**Response**
```json
{
  "status": 200,
  "data": [
    {
      "taskId": 12347,
      "actionType": "STYLIST",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:32:00",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    },
    {
      "taskId": 12346,
      "actionType": "VIRTUAL_CASTING",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:31:00",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    },
    {
      "taskId": 12345,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED",
      "createdAt": "2025-01-15T10:30:45",
      "parentTaskId": null,
      "editSequence": null,
      "isOriginal": true,
      "isEditTask": false
    }
  ]
}
```

**참고사항**
- 소유하지 않은 Task ID는 조회되지 않습니다.
- 존재하지 않는 Task ID는 무시됩니다.

---

## Task 관리 API

### 1. Task 삭제

**Endpoint**
```
DELETE /api/v1/tasks/{taskId}
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `taskId` | Long | 삭제할 Task ID |

**Request Example**
```bash
curl -X DELETE "https://api.likebutter.io/api/v1/tasks/12345" \
  -H "Authorization: Bearer {token}"
```

**Response**
```json
{
  "status": 200,
  "data": null
}
```

**Status Code**: `200 OK`

---

### 2. Task 배치 삭제

여러 Task를 한 번에 삭제

**Endpoint**
```
DELETE /api/v1/tasks/batch
```

**Request Body**
```json
{
  "taskIds": [12345, 12346, 12347]
}
```

**Request Example**
```bash
curl -X DELETE "https://api.likebutter.io/api/v1/tasks/batch" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskIds": [12345, 12346, 12347]}'
```

**Response**
```json
{
  "status": 200,
  "data": {
    "message": "Successfully deleted 3 tasks",
    "deletedCount": "3"
  }
}
```

**참고사항**
- taskIds는 비어있을 수 없습니다.
- 소유하지 않은 Task는 삭제되지 않습니다.

---

### 3. Task 재시도

실패한 Task를 재시도

**Endpoint**
```
POST /api/v1/tasks/{taskId}/retry
```

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `taskId` | Long | 재시도할 Task ID |

**Request Example**
```bash
curl -X POST "https://api.likebutter.io/api/v1/tasks/12345/retry" \
  -H "Authorization: Bearer {token}"
```

**Response**
```json
{
  "status": 200,
  "data": {
    "message": "Task retry successful",
    "taskId": "12345"
  }
}
```

**동작 방식**
1. Task 상태를 `PENDING`으로 변경
2. TaskCreatedEvent 재발행
3. Worker가 이벤트를 수신하여 재처리

**참고사항**
- 주로 FAILED 상태의 Task에 사용
- 소유자만 재시도 가능

---

## 에러 응답

### 에러 응답 구조

```json
{
  "status": 400,
  "msg": "에러 메시지"
}
```

### 주요 에러 상태 코드

| HTTP Status | 설명 |
|------------|------|
| 400 | 잘못된 요청 (필수 파라미터 누락, 형식 오류) |
| 401 | 인증 실패 (토큰 없음, 만료, 유효하지 않음) |
| 403 | 권한 없음 (다른 사용자의 Task 접근) |
| 404 | Task를 찾을 수 없음 |
| 409 | Task 편집 불가 (상태, 타입 제약) |
| 413 | 파일 크기 초과 |
| 415 | 지원하지 않는 파일 형식 |
| 500 | 서버 내부 오류 |

### 에러 응답 예시

**400 Bad Request - 필수 파라미터 누락**
```json
{
  "status": 400,
  "msg": "Required request part 'image' is not present"
}
```

**401 Unauthorized - 인증 실패**
```json
{
  "status": 401,
  "msg": "JWT token is expired or invalid"
}
```

**403 Forbidden - 권한 없음**
```json
{
  "status": 403,
  "msg": "You don't have permission to view this task"
}
```

**404 Not Found - Task 없음**
```json
{
  "status": 404,
  "msg": "Task with ID 99999 not found"
}
```

**409 Conflict - 편집 불가**
```json
{
  "status": 409,
  "msg": "Task must be in COMPLETED status to edit"
}
```

**413 Payload Too Large - 파일 크기 초과**
```json
{
  "status": 413,
  "msg": "File size exceeds maximum limit of 10MB"
}
```

**415 Unsupported Media Type - 지원하지 않는 형식**
```json
{
  "status": 415,
  "msg": "File type 'video/mp4' is not supported. Supported types: image/jpeg, image/png"
}
```

---

## 부록

### Task 생명주기

```
1. 생성 (POST /api/v1/tasks/{type})
   ↓
2. PENDING → Worker가 작업 수신
   ↓
3. PROCESSING → AI 모델 실행 중
   ↓
4. COMPLETED (성공) 또는 FAILED (실패)
   ↓
5. 편집 가능 (COMPLETED 상태인 경우)
   ↓
6. 편집 생성 (POST /api/v1/tasks/{type}/{taskId}/edit)
   ↓
7. 편집본도 동일한 생명주기
```

### 파일 제한사항

| 항목 | 제한 |
|-----|-----|
| 이미지 최대 크기 | 10MB |
| 오디오 최대 크기 | 50MB |
| 지원 이미지 형식 | JPEG, PNG, WebP |
| 지원 오디오 형식 | MP3, WAV, M4A |

### 처리 시간 가이드

| ActionType | 평균 처리 시간 |
|-----------|--------------|
| DIGITAL_GOODS | 10-15초 |
| VIRTUAL_CASTING | 15-20초 |
| STYLIST | 15-25초 |
| FANMEETING_STUDIO | 20-30초 |
| BUTTER_COVER | 40-60초 |

*실제 처리 시간은 파일 크기, 복잡도, 서버 부하에 따라 달라질 수 있습니다.*

### 크레딧 소비

각 Task 생성 시 크레딧이 차감됩니다. 자세한 내용은 Credit API 명세서를 참고하세요.

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-01-15
**API 베이스 URL**: `https://api.likebutter.io`
