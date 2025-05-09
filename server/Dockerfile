FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json . 
RUN npm cache clean --force && npm install

# Copy remaining project files
COPY . .

# Expose the API port
EXPOSE 5000

# Use non-root user
USER node

# Start the server
CMD ["npm", "start"]