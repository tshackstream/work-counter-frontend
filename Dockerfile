FROM node:12-alpine

RUN apk add --no-cache nginx

ADD ./nginx/work-counter-front.conf /etc/nginx/conf.d/
COPY ./ /var/www/work-counter

WORKDIR /var/www/work-counter/frontend

RUN npm install && npm run build && mkdir -p /run/nginx

EXPOSE 8080

CMD nginx -g 'daemon off;'
