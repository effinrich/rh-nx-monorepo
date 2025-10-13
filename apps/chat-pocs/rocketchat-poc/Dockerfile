FROM nginx:stable

COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
COPY dist/apps/rocketchat-poc  /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
