# Menggunakan base image Ubuntu resmi
FROM ubuntu:24.04

# Install Node.js, NPM, dan PM2 (diperlukan untuk menjalankan pm2-runtime)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://nodesource.com | bash - && \
    apt-get install -y nodejs && \
    npm install -g pm2

# Jika script kamu menggunakan Python, hapus tanda pagar (#) di bawah ini untuk menginstalnya:
# RUN apt-get install -y python3 python3-pip

# Tentukan folder kerja di dalam container
WORKDIR /app

# Salin semua file dari laptop kamu ke dalam container
COPY . .

# PERINTAH UTAMA: Menjalankan script menggunakan pm2-runtime agar stay 24 jam di foreground
# Ganti "index.js" dengan nama file utama script kamu (misal: "bot.py" jika pakai Python)
CMD ["pm2-runtime", "start", "afk.js"]
