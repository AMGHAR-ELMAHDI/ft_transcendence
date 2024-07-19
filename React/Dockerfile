FROM node:latest

RUN apt-get update

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

RUN npm install -g vite

ENV PATH /app/node_modules/.bin:$PATH

CMD [ "npm", "start" ]
