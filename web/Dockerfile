FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 8000
CMD ["yarn", "dev", "--port", "8000"]
