FROM node:20

WORKDIR /app

COPY services/fb-collector/package*.json ./
COPY prisma ./

RUN npm install 

COPY services/fb-collector .

RUN npx prisma generate

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN npm run build

CMD ["bash", "./wait-for-it.sh", "http://gateway:3000/healthz", "npm", "run", "start:prod"]