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
ENV DB_URL=file:checkouts.sqlite

COPY --from=build /app/packages/server/dist /app
COPY --from=build /app/packages/server/package.json /app
COPY --from=build /app/packages/server/drizzle /app
RUN chmod +x /app/migrations-entrypoint.sh

RUN pnpm install --prod --prefer-offline

COPY --from=build /app/packages/client/dist /app/client

EXPOSE 3000

ENTRYPOINT ["/app/migrations-entrypoint.sh"]
CMD ["node", "index.js"]