# booklog_web

**booklog**(개인 서재 · 독서 기록장)의 **web** — 브라우저 화면입니다.
브라우저는 web에만 접속하고, `/api`로 시작하는 요청은 web이 was로 넘깁니다(같은 출처라 CORS 설정이 필요 없고 로그인 쿠키가 그대로 동작).

| 저장소 | 역할 |
|---|---|
| [booklog_was](https://github.com/zlfm78/booklog_was) | API 서버 → 이미지 `booklog-was` |
| **booklog_web** (이 저장소) | 화면 소스 → 이미지 `booklog-web` |
| [booklog_infra](https://github.com/zlfm78/booklog_infra) | 실행 · 배포 구성(compose, Kubernetes), 테스트 시나리오, 문서 |

## 기술 스택

JavaScript · React 19 · Vite 8 · Node 24 LTS(`.nvmrc`) · npm(`package-lock.json`으로 버전 고정, `npm ci`). 라우터 라이브러리 없이 해시 라우팅(`#/books/3`).

## 구성

```
src/
├── main.jsx  App.jsx     진입점, 로그인 상태와 주소(#/...)에 따른 화면 선택
├── api.js                /api 호출 (401이면 로그인 화면으로)
├── pages/                로그인 · 가입, 내 서재(목록 · 검색 · 상태 필터), 책 상세 · 등록, 내 정보, 탈퇴
├── components/           머리글 · 바닥글(web · was 버전 표시), 진행률, 독서 기록, 독후감 등
└── hooks/useRoute.js     해시 라우팅
vite.config.js            /api → was 프록시 (①에서만, ②부터는 Nginx)
```

## 로컬 실행 (WSL 2 Ubuntu, ①)

개발 서버가 아니라 **빌드 결과물(`dist/`)** 로 시험합니다. ②에서 Nginx 이미지에 넣는 것과 같은 파일입니다. was(8000)가 먼저 떠 있어야 합니다.

```bash
source ~/.nvm/nvm.sh && cd ~/booklog/booklog_web
nvm install                              # .nvmrc의 Node 24 (처음 한 번)
npm ci
VITE_APP_VERSION=1.0.0 npm run build     # 버전을 빌드할 때 고정 → 화면 하단 "web v1.0.0"
npm run preview                          # http://localhost:4173, /api/*는 was(127.0.0.1:8000)로 프록시
```

테스트 시나리오는 [booklog_infra](https://github.com/zlfm78/booklog_infra)의 `scripts/scenario.sh`.

## 버전

Git 태그와 이미지 태그를 맞춥니다: `v1.0.0` = `booklog-web:1.0.0`.
