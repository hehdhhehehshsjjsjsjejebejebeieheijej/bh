const { Client } = require('discord.js-self-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    checkUpdate: false
});

// PENGATURAN UTAMA
const TOKEN = "TOKEN_AKUN_USER_ANDA"; // Masukkan token akun pribadi Anda

client.on('ready', () => {
    console.log(`Self-bot aktif sebagai: ${client.user.tag}`);
    console.log(`Ketik "!join" saat Anda berada di Voice Channel untuk memanggil akun ini.`);
});

client.on('messageCreate', async (message) => {
    // KEAMANAN: Script hanya merespon jika Anda sendiri yang mengetik !join
    if (message.author.id !== client.user.id) return;

    if (message.content === '!join') {
        // Mengambil informasi voice state Anda di server tersebut
        const memberVoiceState = message.member?.voice;

        // Memeriksa apakah Anda sedang berada di dalam Voice Channel saat mengetik perintah
        if (!memberVoiceState || !memberVoiceState.channelId) {
            return message.reply("❌ Anda harus masuk ke dalam Voice Channel terlebih dahulu sebelum mengetik !join!");
        }

        try {
            // Membuat akun Anda otomatis join ke VC yang sama dengan Anda
            const connection = joinVoiceChannel({
                channelId: memberVoiceState.channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfMute: true,  // Otomatis mute mikrofon
                selfDeaf: true   // Otomatis deafen agar hemat kuota/bandwidth
            });

            message.reply(`✅ Berhasil masuk ke Voice Channel: **${memberVoiceState.channel.name}** dan akan AFK di sana!`);

            // Menjaga koneksi jika terputus secara tidak sengaja
            connection.on('disconnect', () => {
                console.log("Terputus dari VC! Menunggu perintah !join berikutnya.");
            });

        } catch (error) {
            console.error("Gagal masuk ke VC:", error);
            message.reply("❌ Terjadi kesalahan saat mencoba masuk ke Voice Channel.");
        }
    }
});

// Menjalankan self-bot dengan akun Anda
client.login(TOKEN);
  
