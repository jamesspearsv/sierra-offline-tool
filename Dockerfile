FROM node:lts-alpine AS base

FROM base AS deps

RUN npm install -g pnpm

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

FROM  base AS build

RUN npm install -g pnpm
WORKDIR /app

COPY --from=deps /app /app
RUN pnpm run -r build

FROM base AS runner

WORKDIR /app

COPY --from=build /app/packages/server/dist /app
COPY --from=build /app/packages/client/dist /app/client

EXPOSE 3000

CMD ["node", "index.js"]