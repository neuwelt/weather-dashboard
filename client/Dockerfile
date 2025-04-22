FROM node:23-slim
ENV NODE_VERSION=22.12.0
# ENV NODE_ENV=production
WORKDIR /src/
COPY package.json /
RUN npm cache clean --force
RUN  npm install
# RUN npm run serve

COPY . .
EXPOSE 8080
EXPOSE 80
# RUN chown -R node /
USER node
CMD ["npm", "run", "serve"]
