FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverage Docker cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose HTTP / Socket.IO port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start Express & Socket.io server
CMD ["node", "src/server.js"]
