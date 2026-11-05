FROM node:22-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/. .
COPY dist /dist
EXPOSE 3002
CMD ["node", "index.js"]
