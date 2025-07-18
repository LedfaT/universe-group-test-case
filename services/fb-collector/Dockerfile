FROM node:20

WORKDIR /app

COPY ./package*.json ./
COPY ./prisma ./

RUN npm install 

COPY . .

RUN npx prisma generate

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

CMD ["bash", "./wait-for-it.sh", "http://gateway:3000/healthz", "npm", "run", "start:prod"]