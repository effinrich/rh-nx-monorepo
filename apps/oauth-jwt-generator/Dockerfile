FROM node:16.20.2-bookworm-slim

WORKDIR /app

COPY /dist/apps/oauth-jwt-generator/* .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
