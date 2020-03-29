# specify the node base image with your desired version node:<version>
FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json  yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 8500
