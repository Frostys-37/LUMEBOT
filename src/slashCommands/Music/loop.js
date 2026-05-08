const { CommandInteraction, Client, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "loop",
  description: "Activa la repetición.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  category: "Music",
  options: [
    {
      name: "input",
      description: "Elije la canción a repetir.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "track",
          value: "track"
        },
        {
          name: "queue",
          value: "queue"
        }
      ]
    }
  ],
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    if (!interaction.replied) await interaction.deferReply().catch(() => { });

    const input = interaction.options.getString("input");

    let player = client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let thing = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Esa musica no esta sonando.");
      return interaction.editReply({ embeds: [thing] });
    }
    const emojiloop = client.emoji.loop;

    if (input === "track") {
      if (player.trackRepeat) {
        player.setTrackRepeat(false);
        return await interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojiloop} Loop desactivado.`)]
        })
      } else {
        player.setTrackRepeat(true);
        return await interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojiloop} Loop activado.`)]
        })
      }
    } else if (input === "queue") {
      if (!player.queue.size) return await interaction.editReply({
        embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`No quedan mas canciones a repetir.`)]
      })
      if (player.queueRepeat) {
        player.setQueueRepeat(false);
        return await interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojiloop} Loop de playlist desactivado.`)]
        })
      } else {
        player.setQueueRepeat(true);
        return await interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojiloop} Loop de playlist activado.`)]
        })
      };
    }
  }
};
