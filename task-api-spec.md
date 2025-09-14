# Task API 명세서

## 1. 작업 목록 조회
### GET /tasks/me
- **설명**: 내 작업 목록을 페이지네이션으로 조회
- **헤더**: Authorization: Bearer {token}
- **쿼리 파라미터**:
  - `page` (integer, optional): 페이지 번호 (기본값: 0)
  - `size` (integer, optional): 페이지 크기 (기본값: 10)
  - `sort` (string, optional): 정렬 방식 (기본값: createdAt,desc)
  - `summary` (boolean, optional): 요약 정보만 조회 여부 (기본값: false)
- **응답**:
```json
{
  "status": 200,
  "data": {
    "content": [
      {
        "id": 123,
        "accountId": 456,
        "actionType": "STYLIST",
        "status": "COMPLETED",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:05:00",
        "details": {
          "request": {
            "prompt": "스타일링 요청",
            "idolImageKey": "images/stylist/idol_123.jpg",
            "idolImageUrl": "https://s3.amazonaws.com/bucket/images/stylist/idol_123.jpg",
            "hairStyleImageKey": "images/stylist/hair_456.jpg",
            "hairStyleImageUrl": "https://s3.amazonaws.com/bucket/images/stylist/hair_456.jpg",
            "customPrompt": "커스텀 프롬프트"
          },
          "result": {
            "imageKey": "images/stylist/result_789.jpg",
            "imageUrl": "https://s3.amazonaws.com/bucket/images/stylist/result_789.jpg"
          }
        }
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": "createdAt,desc"
    },
    "totalElements": 50,
    "totalPages": 5,
    "first": true,
    "last": false
  }
}
```

## 2. 특정 작업 조회
### GET /tasks/me/{taskId}
- **설명**: 특정 작업의 상세 정보 조회
- **헤더**: Authorization: Bearer {token}
- **경로 파라미터**:
  - `taskId` (long): 작업 ID
- **응답**:
```json
{
  "data": {
    "id": 123,
    "accountId": 456,
    "actionType": "DIGITAL_GOODS",
    "status": "COMPLETED",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:05:00",
    "details": {
      "request": {
        "imageKey": "images/digital-goods/input_123.jpg",
        "imageUrl": "https://s3.amazonaws.com/bucket/images/digital-goods/input_123.jpg",
        "style": "MODERN",
        "title": "상품 제목",
        "subtitle": "부제목",
        "accentColor": "#FF5733",
        "productName": "상품명",
        "brandName": "브랜드명"
      },
      "result": {
        "imageKey": "images/digital-goods/output_789.jpg",
        "imageUrl": "https://s3.amazonaws.com/bucket/images/digital-goods/output_789.jpg"
      }
    }
  },
  "status": 200
}
```

## 3. 작업 일괄 조회
### GET /tasks/batch
- **설명**: 여러 작업을 ID 목록으로 일괄 조회
- **헤더**: Authorization: Bearer {token}
- **쿼리 파라미터**:
  - `ids` (List<Long>, required): 조회할 작업 ID 목록 (예: ids=1,2,3)
  - `summary` (boolean, optional): 요약 정보만 조회 여부 (기본값: false)
- **응답**:
```json
{
  "data": [
    {
      "id": 123,
      "accountId": 456,
      "actionType": "STYLIST",
      "status": "COMPLETED",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:05:00",
      "details": {
        "request": {
          "prompt": "스타일링 요청",
          "idolImageKey": "images/stylist/idol_123.jpg",
          "idolImageUrl": "https://s3.amazonaws.com/bucket/images/stylist/idol_123.jpg"
        },
        "result": {
          "imageKey": "images/stylist/result_789.jpg",
          "imageUrl": "https://s3.amazonaws.com/bucket/images/stylist/result_789.jpg"
        }
      }
    },
    {
      "id": 124,
      "accountId": 456,
      "actionType": "DIGITAL_GOODS",
      "status": "PENDING",
      "createdAt": "2024-01-01T10:10:00",
      "updatedAt": "2024-01-01T10:10:00",
      "details": null
    }
  ],
  "status": 200
}
```

## 4. 스타일리스트 작업 생성
### POST /tasks/stylist
- **설명**: 스타일리스트 AI 작업 생성
- **헤더**: Authorization: Bearer {token}
- **Content-Type**: multipart/form-data
- **요청 파라미터**:
  - `idolImage` (file, required): 아이돌 이미지 파일
  - `prompt` (string, required): 스타일링 프롬프트
  - `hairStyleImage` (file, optional): 헤어스타일 참조 이미지
  - `outfitImage` (file, optional): 의상 참조 이미지
  - `backgroundImage` (file, optional): 배경 참조 이미지
  - `accessoryImage` (file, optional): 액세서리 참조 이미지
  - `moodImage` (file, optional): 분위기 참조 이미지
  - `customPrompt` (string, optional): 커스텀 프롬프트
- **응답**:
```json
{
  "data": {
    "taskId": 123,
    "status": "PENDING",
    "message": "Task created successfully"
  },
  "status": 200
}
```

## 5. 디지털 굿즈 작업 생성
### POST /tasks/digital-goods
- **설명**: 디지털 굿즈 AI 작업 생성
- **헤더**: Authorization: Bearer {token}
- **Content-Type**: multipart/form-data
- **요청 파라미터**:
  - `image` (file, optional): 입력 이미지 파일 (텍스트 전용 생성 시 생략 가능)
  - `style` (enum, required): 스타일 설정 (POSTER, STICKER, GHIBLI, FIGURE, CARTOON)
  - `customPrompt` (string, optional): 커스텀 프롬프트
  - `title` (string, optional): 제목
  - `subtitle` (string, optional): 부제목
  - `accentColor` (string, optional): 강조 색상
  - `productName` (string, optional): 상품명
  - `brandName` (string, optional): 브랜드명
- **응답**:
```json
{
  "data": {
    "taskId": 124,
    "status": "PENDING",
    "message": "Task created successfully"
  },
  "status": 200
}
```

## 6. 가상 캐스팅 작업 생성
### POST /tasks/virtual-casting
- **설명**: 가상 캐스팅 AI 작업 생성
- **헤더**: Authorization: Bearer {token}
- **Content-Type**: multipart/form-data
- **요청 파라미터**:
  - `idolImage` (file, required): 아이돌 이미지 파일
  - `keyword` (string, required): 키워드
  - `customPrompt` (string, optional): 커스텀 프롬프트
- **응답**:
```json
{
  "data": {
    "taskId": 125,
    "status": "PENDING",
    "message": "Task created successfully"
  },
  "status": 200
}
```

## 7. 팬미팅 스튜디오 작업 생성
### POST /tasks/fanmeeting-studio
- **설명**: 팬미팅 스튜디오 AI 작업 생성
- **헤더**: Authorization: Bearer {token}
- **Content-Type**: multipart/form-data
- **요청 파라미터**:
  - `fanImage` (file, required): 팬 이미지 파일
  - `idolImage` (file, required): 아이돌 이미지 파일
  - `situationPrompt` (string, required): 상황 프롬프트
  - `backgroundPrompt` (string, required): 배경 프롬프트
  - `customPrompt` (string, optional): 커스텀 프롬프트
- **응답**:
```json
{
  "data": {
    "taskId": 126,
    "status": "PENDING",
    "message": "Task created successfully"
  },
  "status": 200
}
```

## 8. 버터 커버 작업 생성
### POST /tasks/butter-cover
- **설명**: 버터 커버(AI 음성 변환) 작업 생성
- **헤더**: Authorization: Bearer {token}
- **Content-Type**: multipart/form-data
- **요청 파라미터**:
  - `audio` (file, required): 오디오 파일
  - `request` (json, required): 요청 설정 JSON
    - `voiceModel` (string, required): 음성 모델
    - `pitchAdjust` (integer, optional): 피치 조정 (-12~12, 기본값: 0)
    - `separatorModel` (string, optional): 분리 모델
    - `outputFormat` (string, optional): 출력 형식 (기본값: mp3)
    - `saveIntermediate` (boolean, optional): 중간 파일 저장 여부 (기본값: false)
    - `indexRate` (double, optional): 인덱스 비율 (0~1, 기본값: 0.75)
    - `filterRadius` (integer, optional): 필터 반경 (0~10, 기본값: 3)
    - `rmsMixRate` (double, optional): RMS 믹스 비율 (0~1, 기본값: 0.25)
    - `protect` (double, optional): 보호 설정 (0~1, 기본값: 0.33)
    - `f0Method` (string, optional): F0 메소드 (기본값: rmvpe)
    - `crepeHopLength` (integer, optional): Crepe Hop 길이 (64~512, 기본값: 128)
    - `reverbRmSize` (double, optional): 리버브 룸 크기 (0~1, 기본값: 0.15)
    - `reverbWet` (double, optional): 리버브 Wet (0~1, 기본값: 0.2)
    - `reverbDry` (double, optional): 리버브 Dry (0~1, 기본값: 0.8)
    - `reverbDamping` (double, optional): 리버브 댐핑 (0~1, 기본값: 0.7)
    - `mainGain` (integer, optional): 메인 게인 (-20~20, 기본값: 0)
    - `instGain` (integer, optional): 악기 게인 (-20~20, 기본값: 0)
    - `pitchChangeAll` (integer, optional): 전체 피치 변경 (-12~12, 기본값: 0)
- **응답**:
```json
{
  "data": {
    "taskId": 127,
    "status": "PENDING",
    "message": "Task created successfully"
  },
  "status": 200
}
```

## 공통 응답 코드

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 413 | 파일 크기 초과 |
| 415 | 지원하지 않는 파일 형식 |
| 500 | 서버 오류 |

## 작업 상태 (GenerationStatus)

| 상태 | 설명 |
|------|------|
| PENDING | 대기 중 |
| PROCESSING | 처리 중 |
| COMPLETED | 완료 |
| FAILED | 실패 |

## 작업 유형 (ActionType)

| 유형 | 설명 |
|------|------|
| STYLIST | 스타일리스트 AI |
| DIGITAL_GOODS | 디지털 굿즈 |
| VIRTUAL_CASTING | 가상 캐스팅 |
| FANMEETING_STUDIO | 팬미팅 스튜디오 |

## 파일 업로드 제한사항

- **지원 형식**: jpg, jpeg, png, gif, bmp, webp
- **최대 크기**: 10MB
- **MIME 타입**: image/* 형식만 허용