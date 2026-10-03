const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const emojis = require("../../emojis.json");
const { obtenerEstadoDetallado } = require("../../services/serverMonitor/estado");

module.exports = {
  name: "info",
  description: "Muestra información del bot y el estado de Lumecraft.",
  category: "Information",

  run: async (client, interaction) => {
    const msg = await interaction.deferReply({ fetchReply: true });

    const modalidades = await obtenerEstadoDetallado(client);

    const lineasModalidades = modalidades.length
      ? modalidades
          .map((m) => {
            const estadoEmoji = m.online ? (emojis.succes || "🟢") : (emojis.error || "🔴");

            if (!m.online) {
              return `${estadoEmoji} **${m.nombre}:** Sin respuesta`;
            }

            const jugadores = m.jugadores ? `${m.jugadores.online}/${m.jugadores.max}` : "N/A";
            return `${estadoEmoji} **${m.nombre}:** \`${jugadores}\` jugadores${m.ping != null ? ` • ${m.ping}ms` : ""}`;
          })
          .join("\n")
      : "No hay modalidades configuradas para monitorear.";

    const ping = msg.createdTimestamp - interaction.createdTimestamp;
    const apiPing = client.ws.ping;
    const uptime = formatUptime(process.uptime());

    const embed = new EmbedBuilder()
      .setTitle(`${emojis.user || "ℹ️"} | Panel de Información Lumecraft`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.embedColor || "Blue")
      .setDescription(`Conéctate en \`mc.lumecraft.net\``)
      .addFields(
        { name: "🎮 Modalidades", value: lineasModalidades, inline: false },
        { name: `${emojis.ping || "🤖"} Latencia Bot`, value: `**Bot:** \`${ping}ms\`\n**API:** \`${apiPing}ms\``, inline: true },
        { name: `${emojis.reloj || "⏳"} Actividad`, value: `\`${uptime}\``, inline: true },
        { name: "📊 Comunidad", value: `**Usuarios:** \`${client.users.cache.size}\` miembros`, inline: true },
      )
      .setFooter({ text: `LUMECRAFT NETWORK`, iconURL: client.user.avatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Tienda").setStyle(ButtonStyle.Link).setURL("https://tienda.lumecraft.net/"),
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row],
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