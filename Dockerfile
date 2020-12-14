FROM node:14.15.1-buster-slim AS dev

ARG ALLURE_URL=https://github.com/allure-framework/allure2/releases/download/2.13.7/allure_2.13.7-1_all.deb
ARG PROTOC_URL=https://github.com/protocolbuffers/protobuf/releases/download/v3.14.0/protoc-3.14.0-linux-x86_64.zip
ENV NODE_ENV=development
ENV CODECOV_TOKEN=""

WORKDIR /app

RUN curl -LSso /tmp/protoc.zip ${PROTOC_URL} \
  && unzip -d /usr/local/ /tmp/protoc.zip \
  && rm -rf /tmp/protoc.zip

RUN curl -LSso /tmp/allure.deb ${ALLURE_URL} \
  && apt-get update \
  && apt-get install --fix-broken -y /tmp/allure.deb \
  && rm -rf /tmp/allure.deb /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY __tests__/end-to-end/cogment-app/clients/web/package*.json __tests__/end-to-end/cogment-app/clients/web/
RUN cd __tests__/end-to-end/cogment-app/clients/web && npm install

COPY . .

CMD npm run build
