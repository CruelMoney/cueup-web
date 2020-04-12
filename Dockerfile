# specify the node base image with your desired version node:<version>
FROM node:12-alpine as builder

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont 

WORKDIR /usr/src/app
COPY package*.json  yarn.lock ./
RUN yarn install

RUN yarn build

# Run everything after as non-privileged user.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /app /usr/src/app

USER pptruser

EXPOSE 8500
CMD [ "yarn", "start" ]