FROM node:14-alpine AS dev

ENV NODE_ENV=development
ENV CODECOV_TOKEN=""

WORKDIR /app

RUN apk add curl protoc

COPY package*.json ./
RUN npm install

COPY . .

CMD npm run build
