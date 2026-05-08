const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "leave",
  description: "Desconecta el bot del canal de voz.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  category: "Music",

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const player = client.manager.get(interaction.guildId);

    const emojiLeave = client.emoji.leave;

    player.destroy();

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(`${emojiLeave} **Salí del canal de voz.**\nGracias por usarme, ${interaction.client.user.username}!`)
    return interaction.editReply({ embeds: [thing] });

  }
};
