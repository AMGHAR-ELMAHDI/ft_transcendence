FROM node:20.6.1

WORKDIR /app/

RUN npm install || true

RUN rm -rf /app/logs.txt || true

CMD npm start | tee /app/logs.txt
