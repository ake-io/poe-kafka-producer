# syntax=docker/dockerfile:1

FROM node:16.3.0-slim
ENV NODE_ENV=develop

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --develop

COPY . .
EXPOSE 3000

CMD [ "node", "index.js" ]