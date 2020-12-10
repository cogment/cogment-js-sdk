
FROM node:14-alpine AS dev

WORKDIR /app

COPY clients/web/package*.json ./

RUN npm install

COPY clients/web /app

CMD ["npm", "start"]
