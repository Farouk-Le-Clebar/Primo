FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

COPY env-config.js.template /usr/share/nginx/html/env-config.js.template

RUN apk add --no-cache gettext


EXPOSE 5173
CMD ["sh", "-c", "envsubst '${VITE_API_URL} ${NGINX_BACKEND_URL}' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js && envsubst '${VITE_API_URL} ${NGINX_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]