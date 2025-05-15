# Build
FROM node:22.11.0-alpine

WORKDIR /usr/src/app

COPY . .

COPY package*.json  ./

RUN npm install 

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
