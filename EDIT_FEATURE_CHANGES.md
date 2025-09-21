# 이미지 생성 수정하기 기능 구현 상세 변경 사항

## 개요
사용자가 이미지 생성 작업(Digital Goods, Virtual Casting, Fanmeeting Studio, Stylist) 완료 후 프롬프트를 통해 이미지를 수정할 수 있는 기능을 구현했습니다.

---

## 1. 데이터베이스 스키마 변경

### Task 테이블 확장
```sql
-- 추가된 컬럼들
ALTER TABLE task ADD COLUMN parent_task_id BIGINT NULL COMMENT 'Parent task ID for edit operations';
ALTER TABLE task ADD COLUMN edit_sequence INTEGER NOT NULL DEFAULT 1 COMMENT 'Edit sequence: 1=original, 2=first edit, 3=second edit, etc.';

-- 외래키 제약 조건
ALTER TABLE task ADD CONSTRAINT fk_task_parent_task FOREIGN KEY (parent_task_id) REFERENCES task (task_id);

-- 추가된 인덱스들
CREATE INDEX idx_task_parent_task_id ON task (parent_task_id);
CREATE INDEX idx_task_edit_sequence ON task (edit_sequence);
CREATE INDEX idx_task_parent_sequence ON task (parent_task_id, edit_sequence);
```

### 데이터 구조 설명
- `parent_task_id`: 수정본의 경우 원본 Task의 ID를 참조
- `edit_sequence`: 1=원본, 2=첫 번째 수정, 3=두 번째 수정... 순서로 관리

---

## 2. 도메인 모델 변경

### ActionType 추가 (서버 & Worker 양쪽)
```java
public enum ActionType {
    // 기존 타입들
    BUTTER_COVER,
    DIGITAL_GOODS,
    VIRTUAL_CASTING,
    FANMEETING_STUDIO,
    STYLIST,

    // 새로 추가된 수정 타입들
    DIGITAL_GOODS_EDIT,
    VIRTUAL_CASTING_EDIT,
    FANMEETING_STUDIO_EDIT,
    STYLIST_EDIT
}
```

### Task 엔티티 확장
```java
public class Task extends BaseEntity {
    // 추가된 필드들
    @Column(name = "parent_task_id")
    private Long parentTaskId;

    @Column(name = "edit_sequence", nullable = false)
    private Integer editSequence = 1;

    // 추가된 편의 메서드들
    public boolean isOriginalTask() {
        return this.parentTaskId == null && this.editSequence == 1;
    }

    public boolean isEditTask() {
        return this.parentTaskId != null;
    }

    public Long getRootTaskId() {
        return this.parentTaskId != null ? this.parentTaskId : this.id;
    }

    public boolean canBeEdited() {
        return this.status == GenerationStatus.COMPLETED && !this.isDeleted();
    }
}
```

---

## 3. TaskDetails 확장

### 모든 TaskDetails에 editPrompt 필드 추가
```java
// DigitalGoodsTaskDetails.DigitalGoodsRequest
private String editPrompt;

// VirtualCastingTaskDetails.VirtualCastingRequest
private String editPrompt;

// FanmeetingStudioTaskDetails.FanmeetingStudioRequest
private String editPrompt;

// StylistTaskDetails.StylistRequest
private String editPrompt;
```

**프론트엔드 중요사항**: 수정 요청 시 이 `editPrompt` 필드가 TaskDetails의 request 객체에 포함됩니다.

---

## 4. 새로운 API 엔드포인트

### 수정 기능 API

#### 1. 이미지 수정 요청
```http
POST /tasks/digital-goods/{taskId}/edit
POST /tasks/virtual-casting/{taskId}/edit
POST /tasks/fanmeeting-studio/{taskId}/edit
POST /tasks/stylist/{taskId}/edit
```

**Request Body:**
```json
{
  "originalTaskId": 123,
  "editPrompt": "Make the background more colorful and add some flowers"
}
```

**Response:**
```json
{
  "taskId": 456,
  "originalTaskId": 123,
  "actionType": "DIGITAL_GOODS_EDIT",
  "status": "PENDING",
  "editSequence": 2,
  "editPrompt": "Make the background more colorful and add some flowers",
  "createdAt": "2024-01-15T10:30:00"
}
```

#### 2. 수정 히스토리 조회
```http
GET /tasks/digital-goods/{taskId}/history
GET /tasks/virtual-casting/{taskId}/history
GET /tasks/fanmeeting-studio/{taskId}/history
GET /tasks/stylist/{taskId}/history
```

**Response:**
```json
[
  {
    "taskId": 123,
    "actionType": "DIGITAL_GOODS",
    "status": "COMPLETED",
    "editSequence": 1,
    "isOriginal": true,
    "createdAt": "2024-01-15T09:00:00",
    "resultImageUrl": "https://..."
  },
  {
    "taskId": 456,
    "actionType": "DIGITAL_GOODS_EDIT",
    "status": "COMPLETED",
    "editSequence": 2,
    "isOriginal": false,
    "createdAt": "2024-01-15T10:30:00",
    "resultImageUrl": "https://..."
  }
]
```

#### 3. 수정 가능 여부 확인
```http
GET /tasks/digital-goods/{taskId}/can-edit
GET /tasks/virtual-casting/{taskId}/can-edit
GET /tasks/fanmeeting-studio/{taskId}/can-edit
GET /tasks/stylist/{taskId}/can-edit
```

**Response:**
```json
true
```

### 조회 기능 API 확장

#### 1. TaskDetailsResponse 확장
```json
{
  "taskId": 123,
  "actionType": "DIGITAL_GOODS",
  "status": "COMPLETED",
  "createdAt": "2024-01-15T09:00:00",

  // 새로 추가된 필드들
  "parentTaskId": null,
  "editSequence": 1,
  "isOriginal": true,
  "isEditTask": false,

  "details": {
    "request": {
      "imageKey": "...",
      "imageUrl": "https://...",
      "style": "GHIBLI",
      "editPrompt": null  // 원본의 경우 null
    },
    "result": {
      "imageKey": "...",
      "imageUrl": "https://...",
      "filename": "...",
      "style": "GHIBLI",
      "promptUsed": "...",
      "fileSize": 1024000,
      "executionTime": 5.2
    }
  }
}
```

#### 2. 새로운 조회 엔드포인트
```http
# 원본 Task만 조회 (수정본 제외)
GET /tasks/me/originals?page=0&size=10&summary=false

# 수정 가능한 Task만 조회 (완료된 원본들)
GET /tasks/me/editable?page=0&size=10&summary=false
```

---

## 5. 크레딧 시스템 연동

### 수정 작업도 크레딧 소모
```java
@RequiresCredit(actionType = ActionType.DIGITAL_GOODS_EDIT)
@RequiresCredit(actionType = ActionType.VIRTUAL_CASTING_EDIT)
@RequiresCredit(actionType = ActionType.FANMEETING_STUDIO_EDIT)
@RequiresCredit(actionType = ActionType.STYLIST_EDIT)
```

**프론트엔드 중요사항**: 수정 기능도 크레딧을 소모하므로 UI에서 안내 필요

---

## 6. AI 처리 로직

### Gemini AI를 통한 이미지 수정
1. **원본 이미지**: 기존 Task의 결과 이미지 사용
2. **프롬프트 조합**: 기본 스타일 프롬프트 + 사용자 수정 프롬프트
3. **예시**:
   ```
   기본 프롬프트: "Transform this image into a Studio Ghibli-inspired illustration..."
   사용자 수정: "Make the background more colorful and add some flowers"
   최종 프롬프트: "Transform this image into a Studio Ghibli-inspired illustration...

   Additional modification request: Make the background more colorful and add some flowers"
   ```

---

## 7. 프론트엔드 대응 가이드

### 7.1 UI/UX 변경사항

#### Task 목록 화면
- **수정 버튼**: 완료된 Task에 "수정하기" 버튼 추가
- **수정 표시**: 수정본 Task는 "수정본 #2" 등으로 표시
- **원본 링크**: 수정본에서 원본으로 이동할 수 있는 링크
- **필터링**: "원본만 보기", "수정 가능한 것만 보기" 필터 옵션

#### 수정 요청 화면
- **수정 프롬프트 입력**: 텍스트 입력 필드
- **원본 이미지 미리보기**: 수정할 원본 이미지 표시
- **크레딧 안내**: 수정에도 크레딧이 소모됨을 안내
- **제출**: 수정 요청 버튼

#### 히스토리 화면
- **시간순 나열**: 원본 → 첫 번째 수정 → 두 번째 수정 순서
- **각 단계 표시**: 어떤 프롬프트로 수정했는지 표시
- **이미지 비교**: 이전 단계와 현재 단계 이미지 비교

### 7.2 API 호출 예시

#### 수정 요청
```javascript
// 수정 요청
const editTask = async (taskId, editPrompt) => {
  const response = await fetch(`/tasks/digital-goods/${taskId}/edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalTaskId: taskId,
      editPrompt: editPrompt
    })
  });
  return response.json();
};

// 수정 가능 여부 확인
const canEdit = async (taskId) => {
  const response = await fetch(`/tasks/digital-goods/${taskId}/can-edit`);
  return response.json();
};

// 히스토리 조회
const getHistory = async (taskId) => {
  const response = await fetch(`/tasks/digital-goods/${taskId}/history`);
  return response.json();
};
```

#### 목록 조회
```javascript
// 원본만 조회
const getOriginals = async (page = 0) => {
  const response = await fetch(`/tasks/me/originals?page=${page}&size=10`);
  return response.json();
};

// 수정 가능한 것만 조회
const getEditable = async (page = 0) => {
  const response = await fetch(`/tasks/me/editable?page=${page}&size=10`);
  return response.json();
};
```

### 7.3 상태 관리

#### Task 상태 구분
```javascript
const isOriginalTask = (task) => task.isOriginal === true;
const isEditTask = (task) => task.isEditTask === true;
const canBeEdited = (task) => task.status === 'COMPLETED' &&
                             !task.deleted &&
                             ['DIGITAL_GOODS', 'VIRTUAL_CASTING', 'FANMEETING_STUDIO', 'STYLIST'].includes(task.actionType);
```

#### ActionType 처리
```javascript
const isEditActionType = (actionType) => {
  return ['DIGITAL_GOODS_EDIT', 'VIRTUAL_CASTING_EDIT', 'FANMEETING_STUDIO_EDIT', 'STYLIST_EDIT'].includes(actionType);
};

const getOriginalActionType = (editActionType) => {
  const mapping = {
    'DIGITAL_GOODS_EDIT': 'DIGITAL_GOODS',
    'VIRTUAL_CASTING_EDIT': 'VIRTUAL_CASTING',
    'FANMEETING_STUDIO_EDIT': 'FANMEETING_STUDIO',
    'STYLIST_EDIT': 'STYLIST'
  };
  return mapping[editActionType];
};
```

---

## 8. 주요 특징 및 제약사항

### 8.1 특징
1. **무제한 수정**: 수정 횟수에 제한 없음 (크레딧만 있으면)
2. **히스토리 보존**: 모든 수정 단계가 보존됨
3. **원본 보호**: 원본 이미지와 설정은 변경되지 않음
4. **타입별 처리**: 각 이미지 생성 타입별로 최적화된 수정 처리

### 8.2 제약사항
1. **완료된 Task만 수정 가능**: COMPLETED 상태여야 함
2. **삭제된 Task 수정 불가**: deleted = false여야 함
3. **크레딧 필요**: 수정에도 크레딧 소모
4. **지원 타입 제한**: DIGITAL_GOODS, VIRTUAL_CASTING, FANMEETING_STUDIO, STYLIST만 지원

---

## 9. 에러 처리 및 예외 클래스

### 9.1 커스텀 예외 클래스 구현
기존의 `IllegalStateException`, `IllegalArgumentException` 대신 도메인별 커스텀 예외 클래스를 생성하여 적절한 에러 처리를 구현했습니다.

#### 새로 추가된 예외 클래스들
```java
// 작업을 찾을 수 없는 경우
public class TaskNotFoundException extends BadRequestException {
    private static final String errorMsg = "TASK_NOT_FOUND";
}

// 수정할 수 없는 상태인 경우
public class TaskCannotBeEditedException extends BadRequestException {
    private static final String errorMsg = "TASK_CANNOT_BE_EDITED";
}

// 수정을 지원하지 않는 작업 타입인 경우
public class TaskEditNotSupportedException extends BadRequestException {
    private static final String errorMsg = "TASK_EDIT_NOT_SUPPORTED";
}

// Task ID가 일치하지 않는 경우
public class TaskIdMismatchException extends BadRequestException {
    private static final String errorMsg = "TASK_ID_MISMATCH";
}
```

**프론트엔드 중요사항**: 모든 예외는 `BadRequestException`을 상속하여 HTTP 400 상태코드로 반환되며, 에러 메시지는 위의 상수값으로 표준화되었습니다.

### 9.2 에러 응답 형식
```json
// Task를 찾을 수 없음
{
  "error": "TASK_NOT_FOUND",
  "message": "TASK_NOT_FOUND"
}

// 수정 불가능한 상태
{
  "error": "TASK_CANNOT_BE_EDITED",
  "message": "TASK_CANNOT_BE_EDITED: Status: PROCESSING, Deleted: false"
}

// 지원하지 않는 타입
{
  "error": "TASK_EDIT_NOT_SUPPORTED",
  "message": "TASK_EDIT_NOT_SUPPORTED: BUTTER_COVER"
}

// Task ID 불일치
{
  "error": "TASK_ID_MISMATCH",
  "message": "TASK_ID_MISMATCH"
}
```

### 9.2 프론트엔드 에러 처리
```javascript
try {
  const result = await editTask(taskId, editPrompt);
  // 성공 처리
} catch (error) {
  const errorCode = error.response?.data?.error;

  switch (errorCode) {
    case 'TASK_NOT_FOUND':
      alert('작업을 찾을 수 없습니다.');
      break;
    case 'TASK_CANNOT_BE_EDITED':
      alert('이 작업은 수정할 수 없습니다. 작업이 완료된 상태인지 확인해주세요.');
      break;
    case 'TASK_EDIT_NOT_SUPPORTED':
      alert('이 작업 타입은 수정을 지원하지 않습니다.');
      break;
    case 'TASK_ID_MISMATCH':
      alert('요청한 작업 ID가 일치하지 않습니다.');
      break;
    default:
      alert('수정 요청 중 오류가 발생했습니다.');
  }
}
```

---

## 10. 테스트 시나리오

### 10.1 기본 수정 플로우
1. 이미지 생성 작업 완료
2. "수정하기" 버튼 클릭
3. 수정 프롬프트 입력
4. 수정 요청 제출
5. 수정 작업 진행 상황 확인
6. 수정 완료 후 결과 확인

### 10.2 히스토리 확인
1. 원본 이미지 생성
2. 첫 번째 수정 ("배경을 더 밝게")
3. 두 번째 수정 ("꽃을 추가해줘")
4. 히스토리 화면에서 모든 단계 확인

### 10.3 에러 케이스
1. 진행 중인 작업 수정 시도 → 에러
2. 삭제된 작업 수정 시도 → 에러
3. 크레딧 부족 시 → 에러
4. 빈 프롬프트로 수정 시도 → 에러

---

이 문서를 참고하여 프론트엔드에서 수정하기 기능을 구현하시면 됩니다. 추가 질문이나 구체적인 구현 방법이 궁금한 부분이 있으시면 언제든 말씀해 주세요!