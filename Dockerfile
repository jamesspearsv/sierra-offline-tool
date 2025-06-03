FROM node:lts-alpine AS base

############################
### INSTALL DEPENDENCIES ###
############################
FROM base AS deps

RUN npm install -g pnpm

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

#############################
### BUILD CLIENT & SERVER ###
#############################
FROM base AS build

RUN npm install -g pnpm
WORKDIR /app
COPY --from=deps /app /app
RUN pnpm build:server
RUN pnpm build:client

###############
### RUN APP ###
###############
FROM base AS runner

RUN npm install -g pnpm
WORKDIR /app

ENV DB_URL=file:/app/data/db.sqlite

COPY --from=build /app/packages/server/dist /app
COPY --from=build /app/packages/server/package.json /app
COPY --from=build /app/packages/server/drizzle /app/drizzle
COPY --from=build /app/packages/client/dist /app/client

RUN pnpm install --prod --prefer-offline
RUN chmod +x /app/drizzle/migrations-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/drizzle/migrations-entrypoint.sh"]
CMD ["node", "index.js"]