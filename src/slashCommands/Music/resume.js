const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "resume",
  description: "Reanuda la musica.",
  userPrems: [],
  category: "Music",
  player: true,
  dj: true,
  inVoiceChannel: true,
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
    const song = player.queue.current;

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Esta canción no esta sonando.");
      return interaction.editReply({ embeds: [thing] });
    }

    const emojiresume = client.emoji.resume;

    if (!player.paused) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`${emojiresume} La canción esta reanudada **reanudada**.`)
        .setTimestamp()
      return interaction.editReply({ embeds: [thing] });
    }

    player.pause(false);

    let thing = new EmbedBuilder()
      .setDescription(`${emojiresume} **Reanudada**\n[${song.title}](${song.uri})`)
      .setColor(client.embedColor)
      .setTimestamp()
    return interaction.editReply({ embeds: [thing] });

  }
};
