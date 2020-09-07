FROM node:12-alpine as stage1
RUN apk --no-cache add git
WORKDIR /usr/src/app
COPY package*.json  yarn.lock ./
RUN yarn install --frozen-lockfile

# new stage so previous stage to optimize caching
FROM node:12-alpine

# Installs latest Chromium (77) package for puppeteer
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont 

WORKDIR /usr/src/app

# get the src code
COPY . ./
# get the node_modules from stage 1. This is kinda slow, could it be optimized by using 1 stage?
COPY --from=stage1 /usr/src/app /usr/src/app

ARG SENTRY_AUTH_TOKEN=secret
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}

RUN yarn build:with-sourcemaps --sentry-upload

# remove sourcemaps from public
RUN rm -rf **/*.map

EXPOSE 8500
CMD [ "yarn", "start" ]