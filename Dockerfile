# specify the node base image with your desired version node:<version>
FROM node:12-alpine as builder
WORKDIR /usr/src/app
COPY package*.json  yarn.lock ./
RUN yarn install

FROM node:12-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont 


# Add user so we don't need --no-sandbox.
# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN yarn build \
     && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
     && mkdir -p /home/pptruser/Downloads \
     && chown -R pptruser:pptruser /home/pptruser \
     && chown -R pptruser:pptruser /usr/src/app

# Run everything after as non-privileged user.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /app /usr/src/app

USER pptruser

EXPOSE 8500
CMD [ "yarn", "start" ]