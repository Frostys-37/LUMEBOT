const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "pause",
  description: "Pausa la playlist o canción.",
  userPrems: [],
  dj: true,
  player: true,
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
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("RED")
        .setDescription("No hay nada sonando ahora mismo.");
      return interaction.editReply({ embeds: [thing] });
    }

    const emojipause = client.emoji.pause;

    if (player.paused) {
      let thing = new EmbedBuilder()
        .setColor("RED")
        .setDescription(`${emojipause} La canción/playlist ha sido pausada.`)
        .setTimestamp()
      return interaction.editReply({ embeds: [thing] });
    }

    player.pause(true);

    const song = player.queue.current;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojipause} **Pausado**\n[${song.title}](${song.uri})`)
    return interaction.editReply({ embeds: [thing] });

  }
};
