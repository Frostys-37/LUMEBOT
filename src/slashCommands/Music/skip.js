const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  category: "Music",
  description: "Salta a la siguiente canción.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String} color
   */

  run: async (client, interaction) => {
    const player = interaction.client.manager.get(interaction.guild.id);

    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("No está sonando nada ahora mismo.");
      return interaction.reply({ embeds: [thing] });
    }
    const song = player.queue.current;

    player.stop();

    const emojiskip = interaction.client.emoji.skip;

    let thing = new EmbedBuilder()
      .setDescription(`${emojiskip} **Saltada**\n[${song.title}](${song.uri})`)
      .setColor(interaction.client.embedColor)
      .setTimestamp();
    return interaction.reply({ embeds: [thing], fetchReply: true }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 3000);
    });
  },
};
