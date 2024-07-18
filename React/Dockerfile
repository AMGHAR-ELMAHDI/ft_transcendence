FROM node:20

WORKDIR /app
COPY package*.json ./

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install bash -y

RUN npm install -g npm@latest

RUN npm install

# CMD ["/bin/sh", "-c", "while true; do sleep 3600; done"]


CMD [ "npm", "start" ]