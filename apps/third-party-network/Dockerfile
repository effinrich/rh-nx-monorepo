FROM nginx:stable

COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
COPY dist/apps/third-party-network  /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
