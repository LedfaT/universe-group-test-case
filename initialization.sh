#!/bin/bash
echo "Copying .env.sample to .env"
cp  .env.sample .env

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
