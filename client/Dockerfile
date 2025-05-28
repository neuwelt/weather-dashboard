FROM node:23-slim

ENV NODE_VERSION=22.12.0

# Set working directory
WORKDIR /src

# Copy package.json and install dependencies as root
COPY package.json /src/
RUN npm cache clean --force && npm install

# Copy the rest of the app
COPY . .

# Change ownership to the 'node' user for all project files
RUN chown -R node:node /src

# Switch to the non-root user
USER node

# Expose ports for the dev server
EXPOSE 8080
EXPOSE 80

# Start the Vue dev server
CMD ["npm", "run", "serve"]