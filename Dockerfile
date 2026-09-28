FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN node build.mjs

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/security-headers.conf /etc/nginx/security-headers.conf
RUN printf '%s\n' \
    'server {' \
    '  listen 80;' \
    '  listen [::]:80;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  server_tokens off;' \
    '  include /etc/nginx/security-headers.conf;' \
    '  gzip on;' \
    '  gzip_vary on;' \
    '  gzip_min_length 1024;' \
    '  gzip_types text/plain text/css application/javascript application/json application/xml image/svg+xml;' \
    '  error_page 404 /404.html;' \
    '  location = /404.html { internal; }' \
    '  location /assets/ { expires 30d; try_files $uri =404; }' \
    '  location / { expires -1; try_files $uri $uri/ $uri.html =404; }' \
    '}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
