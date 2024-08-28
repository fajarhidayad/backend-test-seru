FROM oven/bun:latest

WORKDIR /usr/src/app

EXPOSE 1234

COPY package.json bun.lockb ./

RUN bun install
COPY . .
RUN bun db:migrate
ENTRYPOINT [ "bun", "run", "index.ts" ]