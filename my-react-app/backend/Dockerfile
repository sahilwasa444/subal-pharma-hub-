FROM node:20-alpine

WORKDIR /app/backend

ENV NODE_ENV=production

# Install only the backend runtime dependencies.
COPY backend/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund \
    && npm cache clean --force

# Copy the backend service code after dependencies are installed.
COPY backend/. .

EXPOSE 5000

CMD ["node", "server.js"]
