const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "clearqueue",
  description: "Remueve todas las canciones de la lista.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  category: "Music",
  sameVoiceChannel: true,

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
    let player = interaction.client.manager.get(interaction.guildId);
    player.queue.clear();

    const emojieject = client.emoji.remove;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojieject} Canciones removidas de la lista.`)
    return interaction.editReply({ embeds: [thing] });

  }
};
