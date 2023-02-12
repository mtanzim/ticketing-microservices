FROM node:alpine

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD [ "npm", "start" ]