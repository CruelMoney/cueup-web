FROM node:12-alpine as stage1
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build:with-sourcemaps --sentry-upload

# remove sourcemaps from public
RUN rm -rf **/*.map

# only copy the build to the final stage
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
COPY --from=stage1 /usr/src/app/build /usr/src/app/build

EXPOSE 8500
CMD [ "node", "build/server/server.js" ]