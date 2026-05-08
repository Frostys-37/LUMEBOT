const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "skipto",
  category: "Music",
  description: "Salta una canción especifica.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Numero de la canción en la lista.",
      required: true,
      type: ApplicationCommandOptionType.Number,
    }
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const args = interaction.options.getNumber("number");
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("No hay nada sonando ahora mismo.");
      return await interaction.editReply({ embeds: [thing] });
    }

    const position = Number(args);

    if (!position || position < 0 || position > player.queue.size) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Usa: ${prefix}skipto <canción # en lista>`)
      return await interaction.editReply({ embeds: [thing] });
    }

    player.queue.remove(0, position);
    player.stop();

    const emojijump = client.emoji.jump;

    let thing = new EmbedBuilder()
      .setDescription(`${emojijump} Saltando **${position}**.`)
      .setColor(client.embedColor)
      .setTimestamp()

    return await interaction.editReply({ embeds: [thing] });

  }
};
