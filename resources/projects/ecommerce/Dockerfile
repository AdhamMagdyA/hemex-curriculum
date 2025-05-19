# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install openssl
RUN apk add --no-cache openssl

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run prisma:generate

# Stage 2: Production
FROM node:18-slim

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./
COPY --from=builder /app/.env ./

# Create uploads directory
RUN mkdir -p /app/uploads/profile-pictures

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
