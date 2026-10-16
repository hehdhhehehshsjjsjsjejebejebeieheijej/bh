FROM ubuntu:24.04

# Menginstal Node.js dan PM2 secara global untuk pemrosesan suara
RUN apt-get update && apt-get install -y curl build-essential python3-minimal && \
    curl -fsSL https://nodesource.com | bash - && \
    apt-get install -y nodejs && \
    npm install -g pm2

WORKDIR /app

# Memasang package pustaka musik secara bersih
COPY package*.json ./
RUN npm install --omit=dev

# Menyalin seluruh file script ke server Railway
COPY . .

# Menjalankan script musik via pm2-runtime agar standby 24 jam penuh
CMD ["pm2-runtime", "start", "index.js"]
