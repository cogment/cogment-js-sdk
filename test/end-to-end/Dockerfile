# Dockerized development environment
# Inspired by https://github.com/nvm-sh/nvm/blob/d4eba354b5da6195e4017c0baa3c5664d9db1d1d/Dockerfile

FROM node:14 as development

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /usr/src/cogment-js-sdk

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "test"]
