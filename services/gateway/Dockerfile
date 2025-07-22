FROM node:20

WORKDIR /app

COPY services/gateway/package*.json ./

RUN npm install 

COPY services/gateway .

RUN npm run build

CMD ["npm", "run", "start:prod"]