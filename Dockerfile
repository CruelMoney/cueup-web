# specify the node base image with your desired version node:<version>
FROM node:12-alpine as builder
WORKDIR /usr/src/app
COPY package*.json  yarn.lock ./
RUN yarn install

FROM node:12-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .
RUN yarn build
EXPOSE 8500
CMD [ "yarn", "start" ]