const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remueve una canción de la cola.",
  userPrems: [],
  player: true,
  category: "Music",
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Mira el numero de una canción de la cola.",
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
        .setDescription("Esta canción no esta en la lista.");
      return await interaction.editReply({ embeds: [thing] });
    }

    const position = (Number(args) - 1);
    if (position > player.queue.size) {
      const number = (position + 1);
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`No encontre una canción con el número ${number}.\nTotal de canciones: ${player.queue.size}`);
      return await interaction.editReply({ embeds: [thing] });
    }

    const song = player.queue[position]
    player.queue.remove(position);

    const emojieject = client.emoji.remove;

    let thing = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTimestamp()
      .setDescription(`${emojieject} Removida\n[${song.title}](${song.uri})`)
    return await interaction.editReply({ embeds: [thing] });

  }
};
