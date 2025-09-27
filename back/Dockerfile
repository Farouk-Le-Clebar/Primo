FROM node:22-alpine AS builder

WORKDIR /app

COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3000

CMD ["node", "dist/main"]
