# Use the lightweight node image from official Docker Hub
FROM node:23-slim
ENV NODE_VERSION=22.12.0
# set the working directory
WORKDIR /src/
# Copy the package files to the working directory in the container
COPY package.json /
RUN npm cache clean --force
# Install the project dependencies
RUN  npm install
# Copy the rest of the project files to the container
COPY . .
# Expose the port 8080 & 80
EXPOSE 8080
EXPOSE 80
USER node
CMD ["npm", "run", "serve"]
