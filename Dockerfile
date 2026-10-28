# syntax=docker/dockerfile:1

# ---- base: shared runtime deps (openssl is needed by the Prisma schema engine)
FROM node:22-bookworm-slim AS base
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: install all node_modules (dev deps needed for build + prisma CLI)
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --no-audit --no-fund

# ---- migrator: runs `prisma migrate deploy` against DATABASE_URL, then exits
FROM deps AS migrator
CMD ["npx", "prisma", "migrate", "deploy"]

# ---- build: compile the Next.js standalone server
FROM deps AS build
COPY . .
# Build-only placeholders so prisma.config.ts / module init don't fail.
# Never used at runtime: the runner stage doesn't inherit them.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    DATABASE_SSL=disable \
    BETTER_AUTH_SECRET="build-time-placeholder-not-used-at-runtime"
RUN npx prisma generate && npm run build

# ---- runner: minimal production image
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/data/uploads

# Persistent data (uploads, generated auth secret). Mount a volume here.
RUN mkdir -p /app/data/uploads && chown -R node:node /app/data

COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
