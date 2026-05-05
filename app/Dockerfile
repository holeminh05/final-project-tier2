FROM node:18-alpine

WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]