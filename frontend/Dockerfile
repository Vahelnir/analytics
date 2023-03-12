FROM nginx:1.10-alpine

COPY --from=builder /usr/src/analytics/frontend/dist /usr/share/nginx/html
COPY ./nginx_conf/gzip.conf /etc/nginx/conf.d/gzip.conf
