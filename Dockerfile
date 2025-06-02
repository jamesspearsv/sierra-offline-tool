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

RUN npm install -g pnpm
WORKDIR /app

COPY --from=build /app/packages/server/dist /app
COPY --from=build /app/packages/server/package.json /app
COPY --from=build /app/packages/server/drizzle /app

RUN pnpm install --prod --prefer-offline

COPY --from=build /app/packages/client/dist /app/client

EXPOSE 3000

CMD ["node", "src/index.js"]