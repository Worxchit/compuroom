#!/bin/sh
set -e

envsubst '${API_BASE_URL}' < /etc/nginx/config.js.template > /usr/share/nginx/html/config.js

exec "$@"
