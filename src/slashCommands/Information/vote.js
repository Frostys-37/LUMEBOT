const { EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const emojis = require("../../emojis.json");

module.exports = {
  name: "vote",
  description: "Lugares donde puedes votar por el servidor y recibir lumens.",
  category: "Information",

  run: async (client, interaction) => {
    await interaction.deferReply({
      flags: [MessageFlags.Ephemeral],
    });

    const embed = new EmbedBuilder()
      .setTitle(`${emojis.user || "ℹ️"} | ¡Vota por el servidor!`)
      .setDescription(
        "**Recuerda estar conectado cuando votes, no repondremos tus lumens/recompensas en caso contrario.**\n**Deberás estar conectado en la modalidad donde deseas las recompensas.**"
      )
      .setThumbnail(interaction.guild.iconURL({ size: 1024, extension: "png" }))
      .setColor(client.embedColor || "Blue")
      .addFields(
        {
          name: "🎮 TOPG",
          value: "[¡Vota por Lumecraft!](https://topg.org/es/servidores-de-minecraft/server-685180)",
          inline: false,
        },
        {
          name: "🎮 Top Minecraft Servers",
          value: "[¡Vota por Lumecraft!](https://topminecraftservers.org/vote/16515)",
          inline: false,
        },
        {
          name: "🎮 Minecraft Server List",
          value: "[¡Vota por Lumecraft!](https://minecraft-mp.com/server/362550/vote/)",
          inline: false,
        },
        {
          name: "🎮 Servidores de Minecraft",
          value: "[¡Vota por Lumecraft!](https://servidoresdeminecraft.es/server/vote/DNPUDQ/mc.lumecraft.net)",
          inline: false,
        },
        {
          name: "🎮 MCSERV",
          value: "[¡Vota por Lumecraft!](https://mcserv.org/es/vote/lumecraft)",
          inline: false,
        },
        {
          name: "🎮 40 Servidores",
          value: "[¡Vota por Lumecraft!](https://www.40servidoresmc.es/lumecraft/votar)",
          inline: false,
        },
        {
          name: "🎮 Planeta Minecraft",
          value: "[¡Vota por Lumecraft!](https://www.planetminecraft.com/server/lumecraft-network/vote/)",
          inline: false,
        }
      )
      .setFooter({ text: "¡Vota por Lumecraft!", iconURL: client.user.avatarURL() })
      .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("TOPG")
        .setStyle(ButtonStyle.Link)
        .setURL("https://topg.org/es/servidores-de-minecraft/server-685180"),
      new ButtonBuilder()
        .setLabel("Top Minecraft Servers")
        .setStyle(ButtonStyle.Link)
        .setURL("https://topminecraftservers.org/vote/16515"),
      new ButtonBuilder()
        .setLabel("Minecraft Server List")
        .setStyle(ButtonStyle.Link)
        .setURL("https://minecraft-mp.com/server/362550/vote/"),
      new ButtonBuilder()
        .setLabel("Servidores de Minecraft")
        .setStyle(ButtonStyle.Link)
        .setURL("https://servidoresdeminecraft.es/server/vote/DNPUDQ/mc.lumecraft.net"),
      new ButtonBuilder()
        .setLabel("MCSERV")
        .setStyle(ButtonStyle.Link)
        .setURL("https://mcserv.org/es/vote/lumecraft")
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("40Servidores")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.40servidoresmc.es/lumecraft/votar"),
      new ButtonBuilder()
        .setLabel("Planeta Minecraft")
        .setStyle(ButtonStyle.Link)
        .setURL("https://www.planetminecraft.com/server/lumecraft-network/vote/")
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row1, row2],
    });
  },
};