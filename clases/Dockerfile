FROM node:20 AS builder

WORKDIR /app/lib
COPY ../lib/package*.json ./
COPY ../lib/tsconfig.json ./
COPY ../lib/src ./src
RUN npm install
RUN npx tsc

WORKDIR /app/clases
COPY ./clases/package*.json ./
COPY ./clases/tsconfig.json ./
COPY ./clases/tsconfig.node.json ./
COPY ./clases/tsconfig.web.json ./
COPY ./clases/vite.config.ts ./
COPY ./clases/src ./src
RUN npm install
RUN npm run build:server
RUN npm run build:client


FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/clases/node_modules /app/clases/node_modules
COPY --from=builder /app/lib/node_modules /app/clases/node_modules/@pranidhana/lib/node_modules
COPY --from=builder /app/lib/dist /app/clases/node_modules/@pranidhana/lib/
COPY --from=builder /app/clases/dist /app/clases/dist

WORKDIR /app/clases

ENV PGUSER=figari
ENV PGHOST=localhost
ENV PGDATABASE=clases
ENV PGPORT=5432
ENV PGPASSWORD=

EXPOSE 3000

CMD ["node", "dist/server/server/index.js"]
