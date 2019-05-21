FROM node:11-alpine

WORKDIR /usr/afterimage-backend

COPY package.json .

RUN npm install

COPY . .