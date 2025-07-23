# 🧈 Like-Butter Web

**AI 기반의 올인원 크리에이티브 스튜디오**

Like-Butter는 콘텐츠 제작자를 위한 AI 기반 도구를 제공하여, 아이디어 구상부터 완성까지 창작의 모든 과정을 돕는 웹 애플리케이션입니다.

---

## ✨ 핵심 기능

- **🎨 Butter Art**: 텍스트 프롬프트로 고품질 이미지를 생성합니다.
- **🎵 Butter Cover**: 원하는 목소리로 노래 커버를 제작합니다.
- **✂️ Butter Cuts**: 비디오의 하이라이트를 자동으로 편집합니다.
- **🤖 Butter Gen**: 다양한 형식의 텍스트 콘텐츠를 생성합니다.
- **🎙️ Butter Talks**: 텍스트를 자연스러운 음성으로 변환합니다.
- **🧪 Butter Test**: 생성형 AI를 테스트하고 실험할 수 있는 환경을 제공합니다.
- **🗂️ History**: 모든 작업 내역을 추적하고 관리합니다.
- **🌐 다국어 지원**: 한국어와 영어를 완벽하게 지원합니다.

## 🛠️ 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) 15 (App Router)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
- **상태 관리**: [Zustand](https://zustand-demo.pmnd.rs/)
- **애니메이션**: [Framer Motion](https://www.framer.com/motion/)
- **국제화 (i18n)**: [i18next](https://www.i18next.com/)

## 🚀 시작하기

### 사전 준비

- [Node.js](https://nodejs.org/) (v18.x 이상 권장)
- [npm](https://www.npmjs.com/) 또는 [yarn](https://yarnpkg.com/)

### 설치 및 실행

1.  **저장소 복제:**
    ```bash
    git clone https://github.com/RondCorporation/likebutter-web.git
    cd likebutter-web
    ```

2.  **의존성 설치:**
    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 복사하여 채워주세요.
    ```env
    # Next.js 서버 기본 URL
    NEXT_PUBLIC_BASE_URL=http://localhost:3000

    # API 서버 주소
    NEXT_PUBLIC_API_URL=http://localhost:8000

    # 소셜 로그인 관련 (필요시)
    # NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
    # NEXT_PUBLIC_KAKAO_CLIENT_ID=...
    ```

4.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```

이제 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

## 📂 폴더 구조

이 프로젝트는 Next.js의 App Router를 기반으로 기능별 응집도를 높이는 구조를 채택했습니다.

```
/app
├── _components/      # 전역 공용 컴포넌트
├── _hooks/           # 전역 공용 React Hooks
├── _lib/             # API 클라이언트, 유틸리티 등
├── _stores/          # Zustand 상태 관리 스토어
├── _types/           # 전역 타입 정의
└── [lang]/           # 다국어 지원을 위한 동적 라우트
    ├── _components/  # 최상위 레이아웃 클라이언트 컴포넌트
    ├── layout.tsx    # 언어별 루트 레이아웃
    │
    ├── (auth)/       # 🔐 인증 관련 페이지 그룹 (URL에 영향 없음)
    │   ├── login/
    │   └── signup/
    │
    ├── (marketing)/  # 📢 마케팅/정보 페이지 그룹
    │   ├── page.tsx  # 랜딩 페이지
    │   ├── pricing/
    │   └── privacy/
    │
    └── (studio)/     # 🛠️ 핵심 기능 페이지 그룹
        └── studio/
            ├── _components/ # 스튜디오 공용 컴포넌트
            ├── layout.tsx   # 스튜디오 레이아웃
            ├── page.tsx     # 스튜디오 홈
            └── ... (각 기능별 페이지)
```

- **`_` 접두사 폴더**: `_components`, `_lib` 등 `_`로 시작하는 폴더는 라우팅 경로에서 제외되며, 관련된 모듈을 모아두는 역할을 합니다.
- **`(route-groups)`**: `(auth)`, `(marketing)` 등 괄호로 묶인 폴더는 URL 경로에 영향을 주지 않고 관련 페이지들을 그룹화하여 구조를 명확하게 합니다.
- **지역 컴포넌트**: 각 페이지 폴더 내의 `_components` 폴더에는 해당 페이지 또는 하위 페이지에서만 사용되는 지역 컴포넌트를 배치합니다.

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.