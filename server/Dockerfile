# Use the lightweight node image from official Docker Hub
FROM node:23-slim
ENV NODE_VERSION=22.12.0
# ENV NODE_ENV=production
# set the working directory
WORKDIR /
# Copy the package files to the working directory in the container
COPY package.json /
RUN npm cache clean --force
# Install the project dependencies
RUN  npm install
# Copy the rest of the project files to the container
COPY . .
# Expose the port 5000
EXPOSE 5000
USER node
# run the start command to serve
CMD ["npm", "start"]
