# specify the node base image with your desired version node:<version>
FROM node:12-slim as builder
WORKDIR /usr/src/app
COPY package*.json  yarn.lock ./
RUN yarn install

FROM node:12-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .


# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*



# Add user so we don't need --no-sandbox.
# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN yarn build \
     && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
     && mkdir -p /home/pptruser/Downloads \
     && chown -R pptruser:pptruser /home/pptruser \
     && chown -R pptruser:pptruser /node_modules

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 8500
CMD [ "yarn", "start" ]