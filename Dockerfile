FROM nikolaik/python-nodejs AS dev

ENV ORCHESTRATOR_URL=http://grpcwebproxy:8080

WORKDIR /app

COPY . .
RUN npm install -g npm@6
RUN npm i
RUN npx npm-run-all init:*

CMD npm run test:jest && npm run test:reports
