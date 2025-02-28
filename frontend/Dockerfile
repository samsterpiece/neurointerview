# frontend/Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build app
# RUN npm run build  # Uncomment for production

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]