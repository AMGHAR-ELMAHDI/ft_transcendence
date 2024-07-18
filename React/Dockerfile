FROM node:20

WORKDIR /app

RUN npm install -g npm@latest

COPY . .

RUN npm install


CMD [ "npm", "start" ]