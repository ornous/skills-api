FROM node:8.8.1-alpine as builder
MAINTAINER Ozzy Ndiaye <snekshaark@gmail.com>
ARG APP_VERSION
LABEL version=${VERSION}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
#RUN yarn config set version-git-tag false && \
#    yarn version --new-version "$APP_VERSION" && \
RUN yarn install --no-progress --ignore-scripts --emoji # (:

COPY . .

FROM node:8.8.1-alpine
ENV NODE_ENV "production"
ENV APP_PORT 3000
EXPOSE 3000

COPY --from=builder /usr/src/app .
CMD [ "node", "src" ]
