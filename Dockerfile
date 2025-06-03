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
RUN ls /app
RUN pnpm build:server
RUN pnpm build:client

FROM base AS runner

RUN npm install -g pnpm
WORKDIR /app
ENV DB_URL=file:/app/data/db.sqlite

COPY --from=build /app/packages/server/dist /app
COPY --from=build /app/packages/server/package.json /app
COPY --from=build /app/packages/server/drizzle /app/drizzle
RUN chmod +x /app/drizzle/migrations-entrypoint.sh

RUN pnpm install --prod --prefer-offline

COPY --from=build /app/packages/client/dist /app/client

EXPOSE 3000

ENTRYPOINT ["/app/drizzle/migrations-entrypoint.sh"]
CMD ["node", "/app/index.js"]