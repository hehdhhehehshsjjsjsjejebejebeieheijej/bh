const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const client = new Client({
    checkUpdate: false,
    patchVoice: true // Mengatasi enkripsi patch suara baru Discord
});

// ==================== PENGATURAN UTAMA ====================
const TOKEN = "MTUyMTc5Mzc0MjY5OTM2ODQ5MQ.GFmBYt.FRrNf3sf5GKG3Lv-2Yl1GWRg3186QaxwK7uNNg"; // Token akun Anda
const GUILD_ID = "1492249698596290794";   // ID Server / Guild Discord
const CHANNEL_ID = "1492249697744715787";     // ID Voice Channel tujuan
// ==========================================================

console.log("[LOG] Memulai script... Mencoba login ke Discord...");

client.on('ready', async () => {
    console.log(`=================================`);
    console.log(`[SUKSES] Berhasil login sebagai: ${client.user.tag}`);
    console.log(`=================================`);

    // Memanggil fungsi untuk masuk ke Voice Channel secara paksa
    connectToVoice();
});

async function connectToVoice() {
    try {
        console.log(`[LOG] Mencoba masuk secara paksa ke VC dengan ID: ${CHANNEL_ID}`);

        // Mengambil data channel dari cache Discord
        const channel = client.channels.cache.get(CHANNEL_ID);
        
        if (!channel) {
            console.error("[CRITICAL ERROR] ID Voice Channel tidak ditemukan! Pastikan ID sudah benar dan akun Anda sudah masuk ke server tersebut.");
            return;
        }

        // Melakukan koneksi ke Voice Channel
        const connection = joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfMute: true,  // Otomatis bisu (mute)
            selfDeaf: true   // Otomatis tuli (deafen) agar hemat kuota Termux
        });

        // Memantau proses jabat tangan (handshake) jaringan audio
        connection.on(VoiceConnectionStatus.Connecting, () => {
            console.log('[LOG] Sedang menghubungkan ke server suara Discord...');
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('=============== BERHASIL ===============');
            console.log(' Akun Anda SUDAH MASUK ke Voice Channel!');
            console.log(' Sekarang akun akan stand by AFK selamanya.');
            console.log('========================================');
        });

        // Menunggu status Ready dalam waktu maksimal 20 detik
        await entersState(connection, VoiceConnectionStatus.Ready, 20000);

        // Fitur Anti-Kick: Jika ditendang atau terputus, otomatis masuk lagi dalam 5 detik
        connection.on('disconnect', () => {
            console.log("[WARNING] Terputus dari VC! Mencoba masuk kembali dalam 5 detik...");
            setTimeout(() => connectToVoice(), 5000);
        });

    } catch (error) {
        console.error("[ERROR KONEKSI AUDIO]:", error);
        console.log("Mencoba ulang koneksi dalam 10 detik...");
        setTimeout(() => connectToVoice(), 10000);
    }
}

// Proses login
client.login(TOKEN).catch(err => {
    console.error("[ERROR LOGIN] Gagal masuk ke akun Discord:", err.message);
});