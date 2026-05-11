FROM node:18-alpine

WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

RUN npm ci --only=production

# Copy the rest of the code
COPY src/ ./src/

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["node", "src/index.js"]
