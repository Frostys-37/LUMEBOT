const { EmbedBuilder, MessageFlags, version, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");
const emojis = require("../../emojis.json");

module.exports = {
  name: "info",
  description: "Muestra información del bot y el estado de Lumecraft.",
  category: "Information",

  run: async (client, interaction) => {
    const msg = await interaction.deferReply({ fetchReply: true });

    const ipServidor = "mc.lumecraft.com"; 

    let mcStatus = "Desconocido";
    let playersInfo = "0/0";
    let versionMC = "N/A";

    try {
        const response = await axios.get(`https://api.mcstatus.io/v2/status/java/${ipServidor}`);
        const data = response.data;

        if (data.online) {
            mcStatus = `${emojis.succes || "🟢"} **Online**`;
            playersInfo = `\`${data.players.online}/${data.players.max}\``;
            versionMC = `\`${data.version.name_clean}\``;
        } else {
            mcStatus = `${emojis.error || "🔴"} **Offline**`;
            playersInfo = "`0/0`";
            versionMC = "`N/A`";
        }
    } catch (e) {
        mcStatus = `${emojis.warn || "⚠️"} **Error al conectar**`;
    }

    const ping = msg.createdTimestamp - interaction.createdTimestamp;
    const apiPing = client.ws.ping;
    const uptime = formatUptime(process.uptime());

    const embed = new EmbedBuilder()
      .setTitle(`${emojis.user || "ℹ️"} | Panel de Información Lumecraft`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setColor(client.embedColor || "Blue")
      .addFields(
        { 
          name: "🎮 Servidor Minecraft", 
          value: `**Estado:** ${mcStatus}\n**Jugadores:** ${playersInfo}\n**Versión:** ${versionMC}`, 
          inline: false 
        },
        { 
          name: `${emojis.ping || "🤖"} Latencia Bot`, 
          value: `**Bot:** \`${ping}ms\`\n**API:** \`${apiPing}ms\``, 
          inline: true 
        },
        { 
          name: `${emojis.reloj || "⏳"} Actividad`, 
          value: `\`${uptime}\``, 
          inline: true 
        },
        { 
          name: "📊 Comunidad", 
          value: `**Usuarios:** \`${client.users.cache.size}\` miembros`, 
          inline: true 
        }
      )
      .setFooter({ text: `LUMECRAFT NETWORK`, iconURL: client.user.avatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Tienda')
            .setStyle(ButtonStyle.Link)
            .setURL('https://tienda.lumecraft.net/'),
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
  },
};

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? d + "d " : ""}${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`;
}