# booklog-web 이미지: 멀티스테이지 — Node로 빌드하고, 결과물(dist/)만 Nginx 이미지에 담는다

# ---- 1단계: 빌드 (Node 24, ①과 같은 버전) ----
FROM node:24.22.3-slim AS build
WORKDIR /src

# 의존성 먼저: package*.json이 그대로면 npm ci 레이어를 캐시에서 재사용
COPY package.json package-lock.json ./
RUN npm ci

# 소스는 나중에 (자주 바뀜)
COPY index.html vite.config.js ./
COPY src ./src

# 화면 하단에 표시할 web 버전을 빌드할 때 번들에 고정 (docker build --build-arg APP_VERSION=1.0.0)
ARG APP_VERSION=dev
RUN VITE_APP_VERSION=$APP_VERSION npm run build

# ---- 2단계: 실행 (Nginx, root가 아닌 uid 101로 실행되는 이미지) ----
FROM nginxinc/nginx-unprivileged:1.30.6-alpine

# WAS_URL: /api를 넘길 was 주소 (실행할 때 -e로 바꿀 수 있음)
# NGINX_ENTRYPOINT_LOCAL_RESOLVERS: 시작할 때 /etc/resolv.conf의 DNS 서버를 NGINX_LOCAL_RESOLVERS로 만들어 줌
ENV WAS_URL=http://was:8000 \
    NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

# 설정 템플릿 (시작할 때 환경 변수를 채워 conf.d/default.conf 생성)
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
# 1단계의 빌드 결과물만 복사 → Node · node_modules · 소스는 최종 이미지에 없음
COPY --from=build /src/dist /usr/share/nginx/html

ARG APP_VERSION=dev
ARG GIT_SHA=unknown
LABEL org.opencontainers.image.title="booklog-web" \
      org.opencontainers.image.version=$APP_VERSION \
      org.opencontainers.image.revision=$GIT_SHA \
      org.opencontainers.image.source="https://github.com/zlfm78/booklog_web"

EXPOSE 8080
# CMD · USER는 베이스 이미지 그대로 (nginx -g 'daemon off;', uid 101)
