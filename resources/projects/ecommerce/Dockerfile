# Use the official Node.js image.
FROM node:18.0.0-alpine

# Set the working directory in the container.
WORKDIR /ecommerce_app

# Copy the package.json and package-lock.json files to the container.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application files into the container.
COPY . .

# generate prisma client
RUN npx prisma generate

# Expose the port that your application listens on.
EXPOSE 3000

# Command to run the application.
CMD ["node", "src/server.js"]