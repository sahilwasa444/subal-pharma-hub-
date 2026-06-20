FROM node:20

WORKDIR /app

# Install the app's root dependencies because the backend uses the root package.json.
COPY package*.json ./
RUN npm install --omit=dev

# Copy only the backend code into the image.
COPY backend ./backend

EXPOSE 5000

CMD ["node", "backend/server.js"]
