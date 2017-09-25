FROM node:8-alpine
MAINTAINER Ozzy Ndiaye <snekshaar@gmail.com>

ENV NODE_PATH "src"
ENV NODE_ENV "production"
ENV APP_PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json yarn.lock ./
RUN yarn

ADD . /usr/src/app

EXPOSE 3000
CMD [ "node", "src" ]
