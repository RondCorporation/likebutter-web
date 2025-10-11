# 📚 Likebutter API 상세 명세서 (v1)

> **Base URL**: `/api/v1`
>
> **Environment**: Production
>
> **Last Updated**: 2025-10-10

---

## 📋 목차

1. [공통 응답 구조](#1-공통-응답-구조)
2. [인증 (Authentication) API](#2-인증-authentication-api)
3. [사용자 (User) API](#3-사용자-user-api)
4. [국가 (Country) API](#4-국가-country-api)
5. [크레딧 (Credit) API](#5-크레딧-credit-api)
6. [출석 (Attendance) API](#6-출석-attendance-api)
7. [결제 (Payment) API](#7-결제-payment-api)
8. [플랜 (Plan) API](#8-플랜-plan-api)
9. [구독 (Subscription) API](#9-구독-subscription-api)
10. [태스크 (Task) API](#10-태스크-task-api)

---

## 1. 공통 응답 구조

### 1.1 성공 응답 (Success Response)

모든 성공 응답은 다음 구조를 따릅니다:

```json
{
  "status": 200,
  "data": {
    // 실제 응답 데이터
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | `integer` | HTTP 상태 코드 |
| `data` | `object` or `null` | 실제 응답 데이터 (없을 경우 null) |

### 1.2 에러 응답 (Error Response)

모든 에러 응답은 다음 구조를 따릅니다:

```json
{
  "status": 400,
  "msg": "에러 메시지"
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | `integer` | HTTP 에러 상태 코드 |
| `msg` | `string` | 에러 메시지 |

### 1.3 공통 HTTP 상태 코드

| 코드 | 의미 | 설명 |
|------|------|------|
| `200` | OK | 요청 성공 |
| `201` | Created | 리소스 생성 성공 |
| `204` | No Content | 요청 성공, 응답 데이터 없음 |
| `400` | Bad Request | 잘못된 요청 |
| `401` | Unauthorized | 인증 실패 |
| `403` | Forbidden | 권한 없음 |
| `404` | Not Found | 리소스 없음 |
| `500` | Internal Server Error | 서버 에러 |

### 1.4 공통 헤더

#### 요청 헤더 (Request Headers)

```http
Content-Type: application/json
Authorization: Bearer {accessToken}  # 인증이 필요한 API에만 사용
Cookie: accessToken={token}; refreshToken={token}
```

#### 응답 헤더 (Response Headers)

```http
Content-Type: application/json
Set-Cookie: accessToken={token}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
Set-Cookie: refreshToken={token}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

---

## 2. 인증 (Authentication) API

### 2.1 회원가입

**Endpoint**: `POST /api/v1/auth/sign-up`

**설명**: 새로운 사용자 계정을 생성합니다.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "홍길동",
  "gender": "MALE",
  "countryCode": "KR",
  "phoneNumber": "010-1234-5678"
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 제약조건 | 설명 |
|------|------|------|----------|------|
| `email` | `string` | ✅ | 이메일 형식 | 사용자 이메일 |
| `password` | `string` | ✅ | 8자 이상, 대소문자/숫자/특수문자 포함 | 비밀번호 |
| `name` | `string` | ✅ | - | 사용자 이름 |
| `gender` | `enum` | ✅ | `MALE`, `FEMALE`, `OTHER` | 성별 |
| `countryCode` | `string` | ✅ | - | 국가 코드 (예: KR, US) |
| `phoneNumber` | `string` | ❌ | - | 전화번호 |

#### Response (201 Created)

```json
{
  "status": 201,
  "data": "SIGN_UP_SUCCESS"
}
```

#### Error Responses

| 상태 코드 | 에러 메시지 | 설명 |
|-----------|-------------|------|
| `400` | `INVALID_EMAIL_FORMAT` | 이메일 형식 오류 |
| `400` | `INVALID_PASSWORD_FORMAT` | 비밀번호 형식 오류 |
| `409` | `EMAIL_ALREADY_EXISTS` | 이메일 중복 |

---

### 2.2 로그인

**Endpoint**: `POST /api/v1/auth/login`

**설명**: 이메일과 비밀번호로 로그인합니다.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 제약조건 | 설명 |
|------|------|------|----------|------|
| `email` | `string` | ✅ | 이메일 형식 | 사용자 이메일 |
| `password` | `string` | ✅ | 8자 이상 | 비밀번호 |

#### Response (200 OK)

**Headers**:
```http
Set-Cookie: accessToken={token}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
Set-Cookie: refreshToken={token}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

**Body**:
```json
{
  "accessToken": {
    "grantType": "Bearer",
    "tokenType": "ACCESS_TOKEN",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "refreshToken": {
    "grantType": "Bearer",
    "tokenType": "REFRESH_TOKEN",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `accessToken.grantType` | `string` | 항상 "Bearer" |
| `accessToken.tokenType` | `enum` | `ACCESS_TOKEN` |
| `accessToken.value` | `string` | JWT 액세스 토큰 (유효기간: 1시간) |
| `refreshToken.grantType` | `string` | 항상 "Bearer" |
| `refreshToken.tokenType` | `enum` | `REFRESH_TOKEN` |
| `refreshToken.value` | `string` | JWT 리프레시 토큰 (유효기간: 30일) |

#### Error Responses

| 상태 코드 | 에러 메시지 | 설명 |
|-----------|-------------|------|
| `401` | `INVALID_CREDENTIALS` | 이메일 또는 비밀번호 오류 |
| `404` | `ACCOUNT_NOT_FOUND` | 계정 없음 |

---

### 2.3 토큰 재발급

**Endpoint**: `POST /api/v1/auth/reissue`

**설명**: 리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급받습니다.

#### Request (Cookie)

```http
Cookie: refreshToken={refreshTokenValue}
```

#### Response (200 OK)

**Headers**:
```http
Set-Cookie: accessToken={newAccessToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
Set-Cookie: refreshToken={newRefreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

**Body**:
```json
{
  "accessToken": {
    "grantType": "Bearer",
    "tokenType": "ACCESS_TOKEN",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "refreshToken": {
    "grantType": "Bearer",
    "tokenType": "REFRESH_TOKEN",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

| 상태 코드 | 에러 메시지 | 설명 |
|-----------|-------------|------|
| `401` | `INVALID_TOKEN` | 유효하지 않은 리프레시 토큰 |
| `401` | `TOKEN_EXPIRED` | 리프레시 토큰 만료 |

---

### 2.4 로그아웃

**Endpoint**: `POST /api/v1/auth/logout`

**설명**: 로그아웃하고 서버에서 리프레시 토큰을 무효화합니다.

**⚠️ HTTP Method 변경**: `DELETE` → `POST`

#### Request (Cookie)

```http
Cookie: refreshToken={refreshTokenValue}
```

#### Response (200 OK)

**Headers**:
```http
Set-Cookie: accessToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
```

**Body**:
```json
{
  "status": 200,
  "data": null
}
```

---

### 2.5 세션 삭제 (클라이언트 전용)

**Endpoint**: `POST /api/v1/auth/clear-session`

**설명**: 클라이언트 측의 쿠키만 삭제합니다 (서버 리프레시 토큰은 유지).

**⚠️ HTTP Method 변경**: `DELETE` → `POST`

#### Response (200 OK)

**Headers**:
```http
Set-Cookie: accessToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
```

**Body**:
```json
{
  "status": 200,
  "data": "SESSION_CLEARED"
}
```

---

## 3. 사용자 (User) API

### 3.1 내 프로필 조회

**Endpoint**: `GET /api/v1/users/me`

**인증**: 필수 (Bearer Token or Cookie)

**설명**: 로그인한 사용자의 프로필 정보를 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "accountId": 12345,
    "email": "user@example.com",
    "name": "홍길동",
    "roles": "ROLE_USER",
    "gender": "MALE",
    "countryCode": "KR",
    "phoneNumber": "010-1234-5678",
    "planId": 1
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `accountId` | `integer` | 계정 ID |
| `email` | `string` | 이메일 |
| `name` | `string` | 이름 |
| `roles` | `string` | 권한 (예: `ROLE_USER`, `ROLE_ADMIN`) |
| `gender` | `enum` | 성별 (`MALE`, `FEMALE`, `OTHER`) |
| `countryCode` | `string` | 국가 코드 |
| `phoneNumber` | `string` or `null` | 전화번호 |
| `planId` | `integer` or `null` | 구독 중인 플랜 ID |

---

## 4. 국가 (Country) API

### 4.1 국가 목록 조회

**Endpoint**: `GET /api/v1/countries`

**인증**: 불필요

**설명**: 지원하는 국가 목록을 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "code": "KR",
      "countryEn": "South Korea",
      "isoCode": "KOR"
    },
    {
      "code": "US",
      "countryEn": "United States",
      "isoCode": "USA"
    }
  ]
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `code` | `string` | 국가 코드 (2자리) |
| `countryEn` | `string` | 영문 국가명 |
| `isoCode` | `string` | ISO 3166-1 alpha-3 코드 |

---

## 5. 크레딧 (Credit) API

### 5.1 크레딧 잔액 조회

**Endpoint**: `GET /api/v1/credits/balance`

**인증**: 필수

**설명**: 현재 크레딧 잔액 및 통계를 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "currentBalance": 150,
    "totalEarned": 500,
    "totalSpent": 350,
    "lastDailyGrantDate": "2025-10-10",
    "dailyGranted": true
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `currentBalance` | `integer` | 현재 크레딧 잔액 |
| `totalEarned` | `integer` | 총 획득 크레딧 |
| `totalSpent` | `integer` | 총 사용 크레딧 |
| `lastDailyGrantDate` | `date` | 마지막 일일 크레딧 지급일 (yyyy-MM-dd) |
| `dailyGranted` | `boolean` | 오늘 일일 크레딧 지급 여부 |

---

### 5.2 크레딧 거래 내역 조회

**Endpoint**: `GET /api/v1/credits/history`

**인증**: 필수

**설명**: 크레딧 사용 및 획득 내역을 페이지네이션으로 조회합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `page` | `integer` | ❌ | `0` | 페이지 번호 (0부터 시작) |
| `size` | `integer` | ❌ | `20` | 페이지 크기 |
| `sort` | `string` | ❌ | `createdAt,desc` | 정렬 기준 |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "content": [
      {
        "transactionId": 100,
        "type": "DEDUCT",
        "amount": -10,
        "balanceBefore": 160,
        "balanceAfter": 150,
        "description": "Task generation - DIGITAL_GOODS",
        "createdAt": "2025-10-10T10:30:00",
        "taskId": 500
      },
      {
        "transactionId": 99,
        "type": "GRANT",
        "amount": 10,
        "balanceBefore": 150,
        "balanceAfter": 160,
        "description": "Daily attendance reward",
        "createdAt": "2025-10-10T09:00:00",
        "taskId": null
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      }
    },
    "totalElements": 50,
    "totalPages": 3,
    "last": false,
    "first": true,
    "numberOfElements": 20
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `transactionId` | `integer` | 거래 ID |
| `type` | `enum` | 거래 타입 (`GRANT`: 지급, `DEDUCT`: 차감) |
| `amount` | `integer` | 금액 (양수: 지급, 음수: 차감) |
| `balanceBefore` | `integer` | 거래 전 잔액 |
| `balanceAfter` | `integer` | 거래 후 잔액 |
| `description` | `string` | 거래 설명 |
| `createdAt` | `datetime` | 거래 일시 (yyyy-MM-dd'T'HH:mm:ss) |
| `taskId` | `integer` or `null` | 관련 Task ID |

---

## 6. 출석 (Attendance) API

### 6.1 출석 체크

**Endpoint**: `POST /api/v1/attendance/check`

**인증**: 필수

**설명**: 오늘 출석을 체크하고 크레딧을 지급받습니다.

#### Response (201 Created)

```json
{
  "status": 201,
  "data": {
    "attendanceId": 456,
    "attendanceDate": "2025-10-10",
    "creditGranted": 10,
    "consecutiveDays": 5,
    "isFirstTimeToday": true,
    "checkedAt": "2025-10-10T09:00:00"
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `attendanceId` | `integer` | 출석 ID |
| `attendanceDate` | `date` | 출석 날짜 |
| `creditGranted` | `integer` | 지급된 크레딧 (중복 출석 시 0) |
| `consecutiveDays` | `integer` | 연속 출석 일수 |
| `isFirstTimeToday` | `boolean` | 오늘 첫 출석 여부 |
| `checkedAt` | `datetime` | 출석 시각 |

---

### 6.2 출석 요약 조회 (월별)

**Endpoint**: `GET /api/v1/attendance/summary`

**인증**: 필수

**설명**: 특정 월의 출석 요약 정보를 조회합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `month` | `string` | ❌ | 현재 월 | 조회할 월 (yyyy-MM 형식) |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "month": "2025-10",
    "totalDays": 10,
    "consecutiveDays": 5,
    "attendanceDates": [
      "2025-10-01",
      "2025-10-02",
      "2025-10-03",
      "2025-10-06",
      "2025-10-07",
      "2025-10-08",
      "2025-10-09",
      "2025-10-10"
    ]
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `month` | `string` | 조회한 월 (yyyy-MM) |
| `totalDays` | `integer` | 해당 월 출석 일수 |
| `consecutiveDays` | `integer` | 현재 연속 출석 일수 |
| `attendanceDates` | `array[date]` | 출석한 날짜 목록 |

---

### 6.3 연속 출석 일수 조회

**Endpoint**: `GET /api/v1/attendance/consecutive`

**인증**: 필수

**설명**: 현재 연속 출석 일수를 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": 5
}
```

---

### 6.4 오늘 출석 상태 조회

**Endpoint**: `GET /api/v1/attendance/status/today`

**인증**: 필수

**설명**: 오늘 출석 여부를 확인합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "hasCheckedToday": true,
    "today": "2025-10-10",
    "consecutiveDays": 5
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `hasCheckedToday` | `boolean` | 오늘 출석 완료 여부 |
| `today` | `date` | 오늘 날짜 |
| `consecutiveDays` | `integer` | 연속 출석 일수 |

---

## 7. 결제 (Payment) API

### 7.1 내 결제 내역 조회

**Endpoint**: `GET /api/v1/payments/me`

**인증**: 필수

**설명**: 내 결제 내역을 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "paymentId": 789,
      "pgTxId": "imp_123456789",
      "paidAt": "2025-10-01T15:30:00",
      "amount": 9900,
      "currency": "KRW",
      "status": "PAID",
      "planName": "Basic Plan - Monthly",
      "orderName": "신규 구독"
    },
    {
      "paymentId": 790,
      "pgTxId": "imp_987654321",
      "paidAt": "2025-10-05T10:00:00",
      "amount": 19900,
      "currency": "KRW",
      "status": "PAID",
      "planName": "Premium Plan - Monthly",
      "orderName": "요금제 업그레이드"
    }
  ]
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `paymentId` | `integer` | 결제 ID |
| `pgTxId` | `string` | PG사 거래 ID |
| `paidAt` | `datetime` | 결제 일시 |
| `amount` | `decimal` | 결제 금액 |
| `currency` | `string` | 통화 (KRW, USD 등) |
| `status` | `enum` | 결제 상태 (`PAID`, `FAILED`, `CANCELLED`) |
| `planName` | `string` | 플랜명 |
| `orderName` | `string` | 주문명 |

---

## 8. 플랜 (Plan) API

### 8.1 플랜 목록 조회

**Endpoint**: `GET /api/v1/plans`

**인증**: 불필요

**설명**: 활성화된 플랜 목록을 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "planKey": "basic_monthly",
      "description": "Basic Plan - Monthly",
      "planType": "BASIC",
      "billingCycle": "MONTHLY",
      "priceKrw": 9900,
      "priceUsd": 9.99
    },
    {
      "planKey": "premium_monthly",
      "description": "Premium Plan - Monthly",
      "planType": "PREMIUM",
      "billingCycle": "MONTHLY",
      "priceKrw": 19900,
      "priceUsd": 19.99
    }
  ]
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `planKey` | `string` | 플랜 고유 키 |
| `description` | `string` | 플랜 설명 |
| `planType` | `enum` | 플랜 타입 (`FREE`, `BASIC`, `PREMIUM`) |
| `billingCycle` | `enum` | 결제 주기 (`MONTHLY`, `YEARLY`) |
| `priceKrw` | `decimal` | 한화 가격 |
| `priceUsd` | `decimal` | 달러 가격 |

---

## 9. 구독 (Subscription) API

### 9.1 내 구독 조회

**Endpoint**: `GET /api/v1/subscriptions/me`

**인증**: 필수

**설명**: 현재 구독 정보를 조회합니다.

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "status": "ACTIVE",
    "startDate": "2025-10-01T00:00:00",
    "endDate": "2025-11-01T00:00:00",
    "nextPaymentDate": "2025-11-01",
    "planInfo": {
      "planKey": "basic_monthly",
      "description": "Basic Plan - Monthly",
      "price": 9900,
      "currency": "KRW",
      "billingCycle": "MONTHLY"
    },
    "paymentHistory": [
      {
        "paymentId": 789,
        "pgTxId": "imp_123456789",
        "paidAt": "2025-10-01T15:30:00",
        "amount": 9900,
        "status": "PAID"
      }
    ]
  }
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | `enum` | 구독 상태 (`ACTIVE`, `CANCELLED`, `EXPIRED`) |
| `startDate` | `datetime` | 구독 시작일 |
| `endDate` | `datetime` | 구독 종료일 |
| `nextPaymentDate` | `date` | 다음 결제 예정일 |
| `planInfo.planKey` | `string` | 플랜 키 |
| `planInfo.description` | `string` | 플랜 설명 |
| `planInfo.price` | `decimal` | 가격 |
| `planInfo.currency` | `string` | 통화 |
| `planInfo.billingCycle` | `enum` | 결제 주기 |
| `paymentHistory` | `array` | 결제 내역 |

---

### 9.2 빌링키 등록

**Endpoint**: `POST /api/v1/subscriptions/billing-key`

**인증**: 필수

**설명**: Portone에서 발급받은 빌링키를 등록합니다.

**⚠️ 경로 변경**: `/subscriptions/register-billing-key` → `/subscriptions/billing-key`

#### Request Body

```json
{
  "billingKey": "billing_key_from_portone"
}
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "message": "Billing key registered successfully",
    "accountId": "12345"
  }
}
```

---

### 9.3 구독 생성

**Endpoint**: `POST /api/v1/subscriptions`

**인증**: 필수

**설명**: 새로운 구독을 생성합니다.

**⚠️ 경로 변경**: `/subscriptions/create` → `/subscriptions`

#### Request Body

```json
{
  "planKey": "basic_monthly"
}
```

#### Response (201 Created)

```json
{
  "status": 201,
  "data": {
    "id": 100,
    "accountId": 12345,
    "planId": 1,
    "status": "ACTIVE",
    "startDate": "2025-10-10T00:00:00",
    "endDate": "2025-11-10T00:00:00",
    "nextPaymentDate": "2025-11-10",
    "billingCycle": "MONTHLY"
  }
}
```

---

### 9.4 구독 업그레이드

**Endpoint**: `PUT /api/v1/subscriptions/upgrade`

**인증**: 필수

**설명**: 현재 구독을 업그레이드합니다.

**⚠️ HTTP Method & 경로 변경**: `POST /subscriptions/me/upgrade` → `PUT /subscriptions/upgrade`

#### Request Body

```json
{
  "newPlanKey": "premium_monthly"
}
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "id": 100,
    "accountId": 12345,
    "planId": 2,
    "status": "ACTIVE",
    "startDate": "2025-10-10T00:00:00",
    "endDate": "2025-11-10T00:00:00",
    "nextPaymentDate": "2025-11-10",
    "billingCycle": "MONTHLY"
  }
}
```

---

### 9.5 구독 취소

**Endpoint**: `DELETE /api/v1/subscriptions`

**인증**: 필수

**설명**: 현재 구독을 취소합니다.

**⚠️ 경로 변경**: `/subscriptions/me` → `/subscriptions`

#### Response (200 OK)

```json
{
  "status": 200,
  "data": null
}
```

---

### 9.6 결제 상세 조회

**Endpoint**: `GET /api/v1/subscriptions/payments/{paymentId}`

**인증**: 필수

**설명**: 특정 결제의 상세 정보를 조회합니다.

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `paymentId` | `integer` | 결제 ID |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "id": 789,
    "paymentId": "create_sub_12345_1633024800",
    "accountId": 12345,
    "pgTxId": "imp_123456789",
    "amount": 9900,
    "currency": "KRW",
    "status": "PAID",
    "paidAt": "2025-10-01T15:30:00"
  }
}
```

---

## 10. 태스크 (Task) API

### 10.1 공통 Task 구조

모든 Task는 다음 공통 구조를 가집니다:

```json
{
  "id": 500,
  "accountId": 12345,
  "actionType": "DIGITAL_GOODS",
  "details": "{\"imageUrl\":\"https://...\",\"style\":\"ANIME\"}",
  "status": "COMPLETED",
  "deleted": false,
  "deletedAt": null,
  "parentTaskId": null,
  "editSequence": 1,
  "createdAt": "2025-10-10T10:00:00",
  "updatedAt": "2025-10-10T10:30:00"
}
```

#### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `integer` | Task ID |
| `accountId` | `integer` | 계정 ID |
| `actionType` | `enum` | Task 타입 (아래 참조) |
| `details` | `string` (JSON) | Task 상세 정보 (JSON 문자열) |
| `status` | `enum` | Task 상태 (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`) |
| `deleted` | `boolean` | 삭제 여부 |
| `deletedAt` | `datetime` or `null` | 삭제 일시 |
| `parentTaskId` | `integer` or `null` | 원본 Task ID (편집 Task인 경우) |
| `editSequence` | `integer` | 편집 순서 (원본: 1, 편집본: 2, 3, ...) |
| `createdAt` | `datetime` | 생성 일시 |
| `updatedAt` | `datetime` | 수정 일시 |

#### ActionType 목록

| ActionType | 설명 | 편집 가능 |
|------------|------|-----------|
| `DIGITAL_GOODS` | 디지털 굿즈 생성 | ✅ |
| `DIGITAL_GOODS_EDIT` | 디지털 굿즈 편집 | ❌ |
| `VIRTUAL_CASTING` | 버추얼 캐스팅 | ✅ |
| `VIRTUAL_CASTING_EDIT` | 버추얼 캐스팅 편집 | ❌ |
| `STYLIST` | 스타일리스트 | ✅ |
| `STYLIST_EDIT` | 스타일리스트 편집 | ❌ |
| `FANMEETING_STUDIO` | 팬미팅 스튜디오 | ✅ |
| `FANMEETING_STUDIO_EDIT` | 팬미팅 스튜디오 편집 | ❌ |
| `BUTTER_COVER` | 버터커버 (음성 변환) | ❌ |

#### GenerationStatus 목록

| Status | 설명 |
|--------|------|
| `PENDING` | 대기 중 |
| `PROCESSING` | 처리 중 |
| `COMPLETED` | 완료 |
| `FAILED` | 실패 |

---

### 10.2 Digital Goods Task 생성

**Endpoint**: `POST /api/v1/tasks/digital-goods`

**인증**: 필수

**설명**: 디지털 굿즈 생성 Task를 생성합니다.

#### Request (multipart/form-data)

```http
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="idol.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
--boundary
Content-Disposition: form-data; name="style"

ANIME
--boundary--
```

#### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `image` | `file` | ✅ | 이미지 파일 |
| `style` | `string` | ❌ | 스타일 (예: ANIME, REALISTIC) |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 500,
    "status": "PENDING",
    "actionType": "DIGITAL_GOODS",
    "createdAt": "2025-10-10T10:00:00"
  }
}
```

---

### 10.3 Digital Goods Task 편집

**Endpoint**: `POST /api/v1/tasks/digital-goods/{taskId}/edit`

**인증**: 필수

**설명**: 완료된 Digital Goods Task를 편집합니다.

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `taskId` | `integer` | 편집할 원본 Task ID |

#### Request Body

```json
{
  "originalTaskId": 500,
  "editPrompt": "배경을 더 밝게 만들어주세요"
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `originalTaskId` | `integer` | ✅ | 원본 Task ID (경로의 taskId와 일치해야 함) |
| `editPrompt` | `string` | ✅ | 편집 요청 프롬프트 |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 501,
    "originalTaskId": 500,
    "status": "PENDING",
    "actionType": "DIGITAL_GOODS_EDIT",
    "editSequence": 2,
    "createdAt": "2025-10-10T11:00:00"
  }
}
```

---

### 10.4 Virtual Casting Task 생성

**Endpoint**: `POST /api/v1/tasks/virtual-casting`

**인증**: 필수

**설명**: 버추얼 캐스팅 Task를 생성합니다.

#### Request (multipart/form-data)

```http
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="idolImage"; filename="idol.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
--boundary
Content-Disposition: form-data; name="style"

FANTASY
--boundary--
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 502,
    "status": "PENDING",
    "actionType": "VIRTUAL_CASTING",
    "createdAt": "2025-10-10T12:00:00"
  }
}
```

---

### 10.5 Virtual Casting Task 편집

**Endpoint**: `POST /api/v1/tasks/virtual-casting/{taskId}/edit`

**인증**: 필수

**설명**: 완료된 Virtual Casting Task를 편집합니다.

#### Request Body

```json
{
  "originalTaskId": 502,
  "editPrompt": "의상을 더 화려하게 변경해주세요"
}
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 503,
    "originalTaskId": 502,
    "status": "PENDING",
    "actionType": "VIRTUAL_CASTING_EDIT",
    "editSequence": 2,
    "createdAt": "2025-10-10T12:30:00"
  }
}
```

---

### 10.6 Stylist Task 생성

**Endpoint**: `POST /api/v1/tasks/stylist`

**인증**: 필수

**설명**: 스타일리스트 Task를 생성합니다.

#### Request (multipart/form-data)

```http
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="idol.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
--boundary
Content-Disposition: form-data; name="stylePreference"

캐주얼한 스타일로 변경
--boundary--
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 504,
    "status": "PENDING",
    "actionType": "STYLIST",
    "createdAt": "2025-10-10T13:00:00"
  }
}
```

---

### 10.7 Stylist Task 편집

**Endpoint**: `POST /api/v1/tasks/stylist/{taskId}/edit`

**인증**: 필수

**설명**: 완료된 Stylist Task를 편집합니다.

#### Request Body

```json
{
  "originalTaskId": 504,
  "editPrompt": "헤어스타일을 웨이브로 변경"
}
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 505,
    "originalTaskId": 504,
    "status": "PENDING",
    "actionType": "STYLIST_EDIT",
    "editSequence": 2,
    "createdAt": "2025-10-10T13:30:00"
  }
}
```

---

### 10.8 Fanmeeting Studio Task 생성

**Endpoint**: `POST /api/v1/tasks/fanmeeting-studio`

**인증**: 필수

**설명**: 팬미팅 스튜디오 Task를 생성합니다.

#### Request (multipart/form-data)

```http
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="idol.jpg"
Content-Type: image/jpeg

[이미지 바이너리 데이터]
--boundary--
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 506,
    "status": "PENDING",
    "actionType": "FANMEETING_STUDIO",
    "createdAt": "2025-10-10T14:00:00"
  }
}
```

---

### 10.9 Fanmeeting Studio Task 편집

**Endpoint**: `POST /api/v1/tasks/fanmeeting-studio/{taskId}/edit`

**인증**: 필수

**설명**: 완료된 Fanmeeting Studio Task를 편집합니다.

#### Request Body

```json
{
  "originalTaskId": 506,
  "editPrompt": "배경을 카페로 변경"
}
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 507,
    "originalTaskId": 506,
    "status": "PENDING",
    "actionType": "FANMEETING_STUDIO_EDIT",
    "editSequence": 2,
    "createdAt": "2025-10-10T14:30:00"
  }
}
```

---

### 10.10 Butter Cover Task 생성

**Endpoint**: `POST /api/v1/tasks/butter-cover`

**인증**: 필수

**설명**: 버터커버 (음성 변환) Task를 생성합니다.

**⚠️ 주의**: Butter Cover는 편집 불가능

#### Request (multipart/form-data)

```http
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="image"; filename="audio.mp3"
Content-Type: audio/mpeg

[오디오 바이너리 데이터]
--boundary--
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "taskId": 508,
    "status": "PENDING",
    "actionType": "BUTTER_COVER",
    "createdAt": "2025-10-10T15:00:00"
  }
}
```

---

### 10.11 Task 단일 조회

**Endpoint**: `GET /api/v1/tasks/{taskId}`

**인증**: 필수

**설명**: 특정 Task의 상세 정보를 조회합니다.

**⚠️ 경로 변경**: `/tasks/me/{taskId}` → `/tasks/{taskId}`

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `taskId` | `integer` | Task ID |

#### Response (200 OK)

**Digital Goods 예시**:
```json
{
  "status": 200,
  "data": {
    "taskId": 500,
    "actionType": "DIGITAL_GOODS",
    "status": "COMPLETED",
    "createdAt": "2025-10-10T10:00:00",
    "parentTaskId": null,
    "editSequence": 1,
    "isOriginal": true,
    "isEditTask": false,
    "digitalGoods": {
      "imageUrl": "https://cdn.example.com/result-image.jpg",
      "filename": "digital_goods_500.jpg",
      "fileSize": 2048576,
      "executionTime": 12.5,
      "requestImageUrl": "https://cdn.example.com/request-image.jpg",
      "style": "GHIBLI"
    }
  }
}
```

**Virtual Casting 예시**:
```json
{
  "status": 200,
  "data": {
    "taskId": 502,
    "actionType": "VIRTUAL_CASTING",
    "status": "COMPLETED",
    "createdAt": "2025-10-10T12:00:00",
    "parentTaskId": null,
    "editSequence": 1,
    "isOriginal": true,
    "isEditTask": false,
    "virtualCasting": {
      "imageUrl": "https://cdn.example.com/result-image.jpg",
      "filename": "virtual_casting_502.jpg",
      "fileSize": 3145728,
      "executionTime": 15.2,
      "requestImageUrl": "https://cdn.example.com/request-image.jpg",
      "style": "FROZEN"
    }
  }
}
```

**Stylist 예시**:
```json
{
  "status": 200,
  "data": {
    "taskId": 504,
    "actionType": "STYLIST",
    "status": "COMPLETED",
    "createdAt": "2025-10-10T13:00:00",
    "parentTaskId": null,
    "editSequence": 1,
    "isOriginal": true,
    "isEditTask": false,
    "stylist": {
      "imageUrl": "https://cdn.example.com/result-image.jpg",
      "filename": "stylist_504.jpg",
      "fileSize": 4194304,
      "executionTime": 18.3,
      "requestImageUrl": "https://cdn.example.com/request-image.jpg",
      "hairStyleImageUrl": "https://cdn.example.com/hair-ref.jpg",
      "outfitImageUrl": "https://cdn.example.com/outfit-ref.jpg",
      "backgroundImageUrl": "https://cdn.example.com/bg-ref.jpg",
      "accessoryImageUrl": "https://cdn.example.com/accessory-ref.jpg",
      "moodImageUrl": "https://cdn.example.com/mood-ref.jpg"
    }
  }
}
```

**Fanmeeting Studio 예시**:
```json
{
  "status": 200,
  "data": {
    "taskId": 506,
    "actionType": "FANMEETING_STUDIO",
    "status": "COMPLETED",
    "createdAt": "2025-10-10T14:00:00",
    "parentTaskId": null,
    "editSequence": 1,
    "isOriginal": true,
    "isEditTask": false,
    "fanmeetingStudio": {
      "imageUrl": "https://cdn.example.com/result-image.jpg",
      "filename": "fanmeeting_506.jpg",
      "fileSize": 5242880,
      "executionTime": 20.1,
      "requestImage1Url": "https://cdn.example.com/image1.jpg",
      "requestImage2Url": "https://cdn.example.com/image2.jpg"
    }
  }
}
```

#### 응답 필드 설명

**공통 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `taskId` | `integer` | Task ID |
| `actionType` | `enum` | Task 타입 |
| `status` | `enum` | Task 상태 (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`) |
| `createdAt` | `datetime` | 생성 일시 |
| `parentTaskId` | `integer` or `null` | 원본 Task ID (편집 Task인 경우) |
| `editSequence` | `integer` | 편집 순서 |
| `isOriginal` | `boolean` | 원본 Task 여부 |
| `isEditTask` | `boolean` | 편집 Task 여부 |
| `error` | `string` or `null` | 에러 메시지 (실패 시) |

**Digital Goods / Virtual Casting 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `imageUrl` | `string` | 결과 이미지 CDN URL |
| `filename` | `string` | 파일명 |
| `fileSize` | `integer` | 파일 크기 (bytes) |
| `executionTime` | `decimal` | 실행 시간 (seconds) |
| `requestImageUrl` | `string` | 요청 이미지 CDN URL |
| `style` | `string` | 적용된 스타일 (예: `GHIBLI`, `FROZEN`, `SIMPSONS`) |

**Stylist 추가 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `hairStyleImageUrl` | `string` or `null` | 헤어 참조 이미지 URL |
| `outfitImageUrl` | `string` or `null` | 의상 참조 이미지 URL |
| `backgroundImageUrl` | `string` or `null` | 배경 참조 이미지 URL |
| `accessoryImageUrl` | `string` or `null` | 액세서리 참조 이미지 URL |
| `moodImageUrl` | `string` or `null` | 무드 참조 이미지 URL |

**Fanmeeting Studio 추가 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `requestImage1Url` | `string` | 첫 번째 요청 이미지 URL |
| `requestImage2Url` | `string` | 두 번째 요청 이미지 URL |

---

### 10.12 내 Task 목록 조회

**Endpoint**: `GET /api/v1/tasks`

**인증**: 필수

**설명**: 내 Task 목록을 조회합니다.

**⚠️ 경로 변경**: `/tasks/me` → `/tasks`

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "id": 508,
      "accountId": 12345,
      "actionType": "BUTTER_COVER",
      "status": "PENDING",
      "createdAt": "2025-10-10T15:00:00"
    },
    {
      "id": 507,
      "accountId": 12345,
      "actionType": "FANMEETING_STUDIO_EDIT",
      "status": "COMPLETED",
      "createdAt": "2025-10-10T14:30:00"
    }
  ]
}
```

---

### 10.13 Task 편집 이력 조회

**Endpoint**: `GET /api/v1/tasks/{taskId}/history`

**인증**: 필수

**설명**: 특정 Task의 편집 이력을 조회합니다.

**⚠️ 경로 통합**: Task 타입별 경로 → 공통 경로

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `taskId` | `integer` | 원본 Task ID |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "id": 500,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED",
      "editSequence": 1,
      "createdAt": "2025-10-10T10:00:00"
    },
    {
      "id": 501,
      "actionType": "DIGITAL_GOODS_EDIT",
      "status": "COMPLETED",
      "editSequence": 2,
      "parentTaskId": 500,
      "createdAt": "2025-10-10T11:00:00"
    }
  ]
}
```

---

### 10.14 Task 편집 가능 여부 조회

**Endpoint**: `GET /api/v1/tasks/{taskId}/can-edit`

**인증**: 필수

**설명**: Task가 편집 가능한지 확인합니다.

**⚠️ 경로 통합**: Task 타입별 경로 → 공통 경로

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `taskId` | `integer` | Task ID |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": true
}
```

#### 편집 가능 조건

- Task 상태가 `COMPLETED`
- 삭제되지 않음 (`deleted = false`)
- 편집 가능한 ActionType (`DIGITAL_GOODS`, `VIRTUAL_CASTING`, `STYLIST`, `FANMEETING_STUDIO`)
- 이미 편집본이 아님 (원본 Task만 편집 가능)

---

### 10.15 Task 삭제

**Endpoint**: `DELETE /api/v1/tasks/{taskId}`

**인증**: 필수

**설명**: 특정 Task를 삭제합니다 (Soft Delete).

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `taskId` | `integer` | Task ID |

#### Response (204 No Content)

```json
{
  "status": 204,
  "data": null
}
```

---

### 10.16 Task 일괄 삭제

**Endpoint**: `DELETE /api/v1/tasks/batch`

**인증**: 필수

**설명**: 여러 Task를 일괄 삭제합니다.

**⚠️ 경로 & Body 변경**: `/tasks` → `/tasks/batch`, Body 구조 변경

#### Request Body

```json
{
  "taskIds": [500, 501, 502]
}
```

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "message": "Successfully deleted 3 tasks",
    "deletedCount": "3"
  }
}
```

---

### 10.17 Task 재시도 ✨ (신규)

**Endpoint**: `POST /api/v1/tasks/{taskId}/retry`

**인증**: 필수

**설명**: 실패한 Task를 재시도합니다.

#### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `taskId` | `integer` | Task ID |

#### Response (200 OK)

```json
{
  "status": 200,
  "data": {
    "message": "Task retry successful",
    "taskId": "500"
  }
}
```

---

### 10.18 Task 배치 조회

**Endpoint**: `GET /api/v1/tasks/batch`

**인증**: 필수

**설명**: 여러 Task를 일괄 조회합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `taskIds` | `array[integer]` | ✅ | Task ID 목록 (쉼표로 구분) |

**예시**: `/api/v1/tasks/batch?taskIds=500,501,502`

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "id": 500,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED"
    },
    {
      "id": 501,
      "actionType": "DIGITAL_GOODS_EDIT",
      "status": "COMPLETED"
    }
  ]
}
```

---

### 10.19 원본 Task만 조회

**Endpoint**: `GET /api/v1/tasks/originals`

**인증**: 필수

**설명**: 원본 Task만 조회합니다 (편집본 제외).

**⚠️ 경로 변경**: `/tasks/me/originals` → `/tasks/originals`

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "id": 500,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED",
      "editSequence": 1,
      "parentTaskId": null
    },
    {
      "id": 502,
      "actionType": "VIRTUAL_CASTING",
      "status": "COMPLETED",
      "editSequence": 1,
      "parentTaskId": null
    }
  ]
}
```

---

### 10.20 편집 가능한 Task 조회

**Endpoint**: `GET /api/v1/tasks/editable`

**인증**: 필수

**설명**: 편집 가능한 Task 목록을 조회합니다.

**⚠️ 경로 변경**: `/tasks/me/editable` → `/tasks/editable`

#### Response (200 OK)

```json
{
  "status": 200,
  "data": [
    {
      "id": 500,
      "actionType": "DIGITAL_GOODS",
      "status": "COMPLETED",
      "editSequence": 1
    },
    {
      "id": 502,
      "actionType": "VIRTUAL_CASTING",
      "status": "COMPLETED",
      "editSequence": 1
    }
  ]
}
```

---

## 🔗 추가 리소스

- **Postman Collection**: TBD
- **Swagger UI**: `/swagger-ui/index.html` (개발 환경)
- **GitHub Repository**: TBD

---

**문서 버전**: 1.0.0
**최종 수정일**: 2025-10-10
**작성자**: Likebutter Backend Team
