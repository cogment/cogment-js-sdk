# syntax=docker.io/docker/dockerfile-upstream:1.2.0
FROM node:14 AS dev

ARG PROTOC_URL=https://github.com/protocolbuffers/protobuf/releases/download/v3.14.0/protoc-3.14.0-linux-x86_64.zip
ENV NODE_ENV=development

WORKDIR /app

RUN curl -LSso /tmp/protoc.zip ${PROTOC_URL} \
  && unzip -d /usr/local/ /tmp/protoc.zip \
  && rm -rf /tmp/protoc.zip

COPY package*.json .
RUN npm install

COPY . .

CMD npm run test

FROM dev as build

EXPOSE 4000

ENV NODE_ENV=production

RUN npm run build

CMD npm run build:webpack:watch
