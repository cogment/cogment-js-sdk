FROM nikolaik/python-nodejs AS dev

ARG PROTOC_URL=https://github.com/protocolbuffers/protobuf/releases/download/v3.14.0/protoc-3.14.0-linux-x86_64.zip
ENV NODE_ENV=development
ENV ORCHESTRATOR_URL=http://grpcwebproxy:8080

WORKDIR /app

COPY . .
RUN npm install -g npm@6 && npm i

CMD npm run test:jest
