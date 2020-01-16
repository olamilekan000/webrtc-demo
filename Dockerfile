FROM node:8.16.2

RUN mkdir /app

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 9090

CMD ["npm", "run", "start"]
