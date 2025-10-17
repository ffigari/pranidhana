FROM node:20 AS builder

WORKDIR /app/lib
COPY ../lib/package*.json ./
COPY ../lib/tsconfig.json ./
COPY ../lib/src ./src
RUN npm install
RUN npx tsc

WORKDIR /app/web-personal
COPY ./web-personal/package*.json ./
COPY ./web-personal/tsconfig.json ./
COPY ./web-personal/tsconfig.node.json ./
COPY ./web-personal/tsconfig.web.json ./
COPY ./web-personal/vite.config.ts ./
COPY ./web-personal/src ./src
RUN npm install
RUN npm run build:server
RUN npm run build:client


FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/web-personal/node_modules /app/web-personal/node_modules
COPY --from=builder /app/lib/node_modules /app/web-personal/node_modules/@pranidhana/lib/node_modules
COPY --from=builder /app/lib/dist /app/web-personal/node_modules/@pranidhana/lib/
COPY --from=builder /app/web-personal/dist /app/web-personal/dist
COPY --from=builder /app/web-personal/src/pages /app/web-personal/dist/server/

WORKDIR /app/web-personal

EXPOSE 3000

CMD ["node", "dist/server/server/index.js"]
