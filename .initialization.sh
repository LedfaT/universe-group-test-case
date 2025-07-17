#!/bin/bash
echo "Copying .env.sample to .env"
cp  .env.sample .env

echo "Copying prisma files to services"
cp -r ./prisma ./services/ttk-collector/
cp -r ./prisma ./services/fb-collector/
cp -r ./prisma ./services/reporter/

echo "Installing dependencies and generating Prisma client for each service"
cd ./services/ttk-collector 
npm i
npx prisma generate 

echo "Installing dependencies and generating Prisma client for fb-collector"
cd ../fb-collector
npm i
npx prisma generate

echo "Installing dependencies and generating Prisma client for reporter"
cd ../reporter
npm i
npx prisma generate

echo "Installing dependencies for gateway"
cd ../gateway
npm i

cd ../../

echo "Starting services with Docker Compose"
docker compose up --build