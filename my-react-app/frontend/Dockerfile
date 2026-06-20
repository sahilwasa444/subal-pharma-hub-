FROM node:20

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

EXPOSE 5173

CMD ["./node_modules/.bin/vite", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
