FROM nikolaik/python-nodejs AS dev

WORKDIR /app

ENV ORCHESTRATOR_URL=http://orchestrator:8081

COPY . .
RUN npm install -g npm@6
RUN npm i
RUN npx npm-run-all init:*

CMD npm run test:jest
