const { Client, GatewayIntentBits } = require('passport-discord'); // Menggunakan Client bawaan discord.js
const { Client: DiscordClient, IntentsBitField } = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const { SpotifyPlugin } = require('@distube/spotify');
const { AppleMusicPlugin } = require('@distube/apple-music');

const client = new DiscordClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent
  ]
});

// Inisialisasi DisTube dengan plugin YouTube, Spotify, dan Apple Music
const distube = new DisTube(client, {
  leaveOnEmpty: false,
  leaveOnFinish: false,
  emitNewGuildOwnerOnly: false,
  plugins: [
    new YouTubePlugin(),
    new SpotifyPlugin({ emitEventsAfterQueue: true }),
    new AppleMusicPlugin()
  ]
});

const PREFIX = '!'; // Prefiks perintah bot kamu

client.on('ready', () => {
  console.log(`Bot Musik Resmi \${client.user.tag} aktif 24 jam di Railway!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Perintah memutar musik (!play <judul/link youtube/spotify/apple music>)
  if (command === 'play') {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Kamu harus masuk ke voice channel terlebih dahulu!');

    const query = args.join(' ');
    if (!query) return message.reply('Masukkan judul lagu atau link (YouTube/Spotify/Apple Music)!');

    try {
      await distube.play(voiceChannel, query, {
        textChannel: message.channel,
        member: message.member,
        message
      });
      message.reply(`🔍 Mencari dan memutar: **\${query}**`);
    } catch (err) {
      console.error(err);
      message.reply('Terjadi kesalahan saat mencoba memutar lagu.');
    }
  }

  // Perintah skip lagu (!skip)
  if (command === 'skip') {
    try {
      const queue = distube.getQueue(message);
      if (!queue) return message.reply('Tidak ada lagu yang sedang diputar.');
      await distube.skip(message);
      message.reply('⏭️ Lagu dilewati!');
    } catch (err) {
      message.reply('Tidak ada lagu berikutnya di antrean.');
    }
  }

  // Perintah berhenti (!stop)
  if (command === 'stop') {
    const queue = distube.getQueue(message);
    if (!queue) return message.reply('Tidak ada musik yang sedang aktif.');
    distube.stop(message);
    message.reply('🛑 Musik dihentikan dan antrean dihapus.');
  }
});

// Menangkap event saat lagu mulai diputar
distube.on('playSong', (queue, song) => {
  queue.textChannel.send(`🎶 Sekarang memutar: **\${song.name}** - \`${song.formattedDuration}\``);
});

// Menangkap token bot aman dari Environment Variable Railway
client.login(process.env.DISCORD_TOKEN);
