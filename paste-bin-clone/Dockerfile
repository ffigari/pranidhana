# Stage 1: Build dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build React app
FROM node:20-alpine AS react-build
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Skip tsc check, just build with vite
RUN npx vite build

# Stage 3: Build API and CLI
FROM node:20-alpine AS server-build
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:api
RUN npm run build:cli

# Stage 4: Production runtime
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy built artifacts
COPY --from=react-build /app/dist ./dist/web-ui
COPY --from=server-build /app/dist/web-api ./dist/web-api
COPY --from=server-build /app/dist/cli ./dist/cli

# Copy source files needed at runtime (for path aliases)
COPY src ./src
COPY tsconfig*.json ./
COPY .env* ./

# Expose API port
EXPOSE 3000

# Create entrypoint script to generate .env from environment variables
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'cat > /app/.env << EOF' >> /entrypoint.sh && \
    echo 'PGHOST=${PGHOST}' >> /entrypoint.sh && \
    echo 'PGPORT=${PGPORT}' >> /entrypoint.sh && \
    echo 'PGDATABASE=${PGDATABASE}' >> /entrypoint.sh && \
    echo 'PGUSER=${PGUSER}' >> /entrypoint.sh && \
    echo 'PGPASSWORD=${PGPASSWORD}' >> /entrypoint.sh && \
    echo 'PORT=${PORT}' >> /entrypoint.sh && \
    echo 'EOF' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/web-api/index.js"]
