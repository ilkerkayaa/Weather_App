FROM node:18-alpine

# Çalışma dizini
WORKDIR /app

# Backend bağımlılıklarını yükle
COPY backend_proxy/package*.json ./backend_proxy/
WORKDIR /app/backend_proxy
RUN npm install

# Geri köke dön
WORKDIR /app

# Tüm projeyi kopyala
COPY . .

# Backend dizinine gir
WORKDIR /app/backend_proxy

# Port aç
EXPOSE 5000

# Sunucuyu başlat
CMD ["node", "server.js"]