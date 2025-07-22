FROM node:20

WORKDIR /app

COPY services/reporter/package*.json ./
COPY prisma ./

RUN npm install 

COPY services/reporter .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]