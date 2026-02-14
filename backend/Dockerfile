# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port (Fly.io uses 8080 internally)
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application
CMD ["npm", "start"]
