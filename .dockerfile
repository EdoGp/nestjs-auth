FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS dependencies
#
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the prefereed package manager
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ENV NODE_ENV production

RUN yarn build

RUN rm -rf node_modules && yarn install --production --frozen-lockfile && yarn cache clean


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Environment variables must be redifined at run time
ENV NODE_ENV production

# Copy code output and node_modules prod from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main"]
