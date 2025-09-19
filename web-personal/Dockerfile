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
COPY ./web-personal/src ./src
RUN npm install
RUN npx tsc


FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/lib/node_modules /app/web-personal/node_modules/@pranidhana/lib/node_modules
COPY --from=builder /app/lib/dist /app/web-personal/node_modules/@pranidhana/lib/
COPY --from=builder /app/web-personal/dist /app/web-personal/dist

WORKDIR /app/web-personal

EXPOSE 3000

CMD ["node", "dist/index.js"]
