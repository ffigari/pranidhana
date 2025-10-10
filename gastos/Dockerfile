FROM node:20 AS builder

WORKDIR /app/lib
COPY ../lib/package*.json ./
COPY ../lib/tsconfig.json ./
COPY ../lib/src ./src
RUN npm install
RUN npx tsc

WORKDIR /app/gastos
COPY ./gastos/package*.json ./
COPY ./gastos/tsconfig.json ./
COPY ./gastos/src ./src
RUN npm install
RUN npx tsc


FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/gastos/node_modules /app/gastos/node_modules
COPY --from=builder /app/lib/node_modules /app/gastos/node_modules/@pranidhana/lib/node_modules
COPY --from=builder /app/lib/dist /app/gastos/node_modules/@pranidhana/lib/
COPY --from=builder /app/gastos/dist /app/gastos/dist

WORKDIR /app/gastos

EXPOSE 3000

CMD ["node", "dist/index.js"]
