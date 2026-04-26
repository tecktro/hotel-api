# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
# Use legacy-peer-deps to resolve Apollo Server v4/v5 conflict
RUN npm ci --legacy-peer-deps

# Fix security vulnerabilities (allow exit with unfixable issues)
# Note: uuid vulnerability is upstream in @apollo/server, no fix available
RUN npm audit fix --legacy-peer-deps || true

# Copy source code
COPY . .

# Generate Prisma client if needed and build
RUN npm run build

# Runtime stage - optimize image size
FROM node:20-alpine

WORKDIR /usr/src/app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Copy built application from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Remove unnecessary node_modules packages
RUN npm prune --omit=dev --legacy-peer-deps

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app

USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]
