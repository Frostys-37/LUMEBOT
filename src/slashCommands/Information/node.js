const { EmbedBuilder, MessageFlags, version } = require("discord.js");
const os = require("os");

module.exports = {
  name: "node",
  description: "Mira información técnica del sistema y del bot.",
  category: "Information",

  run: async (client, interaction) => {
    await interaction.deferReply({
      flags: [MessageFlags.Ephemeral],
    });

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const botUsedMem = process.memoryUsage().heapUsed;

    const stats = 
      `Bot Uptime: ${formatUptime(process.uptime())}` +
      `\nNode.js Version: ${process.version}` +
      `\nDiscord.js Version: v${version}` +
      `\n\n[ MEMORIA DEL SISTEMA ]` +
      `\nTotal: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB` +
      `\nUsada: ${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB` +
      `\nLibre: ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB` +
      `\n\n[ PROCESO DEL BOT ]` +
      `\nRAM Usada: ${(botUsedMem / 1024 / 1024).toFixed(2)} MB` +
      `\n\n[ CPU ]` +
      `\nModelo: ${os.cpus()[0].model}` +
      `\nCores: ${os.cpus().length}` +
      `\nPlataforma: ${os.platform()} ${os.arch()}`;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Información de Node.js - ${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(`\`\`\`ml\n${stats}\`\`\``)
      .setColor(client.embedColor || "Blue")
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });
  },
};

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}