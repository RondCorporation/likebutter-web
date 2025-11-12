# Like Butter Web

크리에이터를 위한 AI 기반 창작 스튜디오

## 설치 및 실행

**사전 준비**

- Node.js 18 이상
- npm 또는 yarn

**설치**

```bash
git clone https://github.com/RondCorporation/likebutter-web.git
cd likebutter-web
npm install
```

**환경 변수 설정**

프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**개발 서버 실행**

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 빌드

```bash
npm run build
npm start
```

## 기술 스택

Next.js 15, TypeScript, Tailwind CSS, Zustand, Framer Motion, i18next

## 라이선스

MIT
