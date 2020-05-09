FROM node:12-alpine

ARG API_HOST
ARG API_PORT
ARG BASIC_USER
ARG BASIC_PASSWORD

RUN apk add --no-cache nginx apache2-utils && htpasswd -c -b /etc/nginx/.htpasswd ${BASIC_USER} ${BASIC_PASSWORD}

COPY ./infra/frontend/default.conf /etc/nginx/conf.d/default.conf
COPY ./frontend /var/www/work-counter/frontend

WORKDIR /var/www/work-counter/frontend

RUN npm install && npm run build && mkdir -p /run/nginx

EXPOSE 8080

CMD nginx -g 'daemon off;' 