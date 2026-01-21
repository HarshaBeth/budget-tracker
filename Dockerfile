# -------------------------
# 1️⃣ Base image
# -------------------------
FROM node:20-alpine AS base

# Enable pnpm via corepack
RUN corepack enable

# -------------------------
# 2️⃣ Dependencies stage
# -------------------------
FROM base AS deps

WORKDIR /app

# Copy only dependency files (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# -------------------------
# 3️⃣ Build stage
# -------------------------
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of the app
COPY . .

# Build Next.js app
RUN pnpm build

# -------------------------
# 4️⃣ Production runtime
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Enable pnpm (needed to run start script)
RUN corepack enable

# Copy only necessary output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start Next.js
CMD ["pnpm", "start"]
