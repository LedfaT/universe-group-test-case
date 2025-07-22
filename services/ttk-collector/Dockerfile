FROM node:20

WORKDIR /app

COPY services/ttk-collector/package*.json ./
COPY ./prisma ./prisma

RUN npm install 

COPY services/ttk-collector .

RUN npx prisma generate

RUN chmod +x /app/wait-for-it.sh
RUN npm run build

CMD ["bash", "./wait-for-it.sh", "http://gateway:3000/healthz", "npm", "run", "start:prod"]