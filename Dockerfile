FROM node:18-alpine as builder

WORKDIR /usr/src/analytics

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --offline --frozen-lockfile
RUN pnpm -r build