FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production DATA_DIR=/data PORT=8787
VOLUME /data
EXPOSE 8787
CMD ["npx", "tsx", "src/server.ts"]
