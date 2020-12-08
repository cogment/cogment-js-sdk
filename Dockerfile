# syntax=docker.io/docker/dockerfile-upstream:1.2.0
FROM node:14 AS dev

ARG PROTOC_URL=https://github.com/protocolbuffers/protobuf/releases/download/v3.14.0/protoc-3.14.0-linux-x86_64.zip
ENV NODE_ENV=development

WORKDIR /app

RUN curl -LSso /tmp/protoc.zip ${PROTOC_URL} \
  && unzip -d /usr/local/ /tmp/protoc.zip \
  && rm -rf /tmp/protoc.zip

#RUN --mount ls /run

#RUN mkdir -pm 0700 ~/.ssh \
# && eval $(ssh-agent -s) \
# && ssh-add /run/secrets/cogment_api_deploy_key \
# && ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

#RUN eval $(ssh-agent -s) \
#  && ssh-add /etc/secrets/cogment-api-deploy-key.asc \
#  && mkdir -p ~/.ssh \
#  && chmod 0700 ~/.ssh \
#  && ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

COPY package*.json .
RUN --mount=type=ssh npm install

COPY . .

CMD npm run test

FROM dev as build

EXPOSE 4000

RUN npm run build

CMD npm run test:ui

