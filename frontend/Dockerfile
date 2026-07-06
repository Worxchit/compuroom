FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY public /usr/share/nginx/html
COPY config.js.template /etc/nginx/config.js.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV API_BASE_URL=http://localhost:3000
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
