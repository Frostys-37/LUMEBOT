const { EmbedBuilder, CommandInteraction } = require("discord.js");
const LUMEBOT = require("../../structures/Client");
const { Player } = require("erela.js");
const Model = require("../../schema/247");

module.exports = {
  name: "247",
  description: "Establece el modo 24/7 para que el bot este permanentemente en el canal de voz.",
  default_member_permissions: ["ManageChannels"],
  player: true,
  category: "Config",
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    /**
     * @type {Player}
     */
    let player = interaction.client.manager.get(interaction.guildId);
    const data = await Model.findOne({ Guild: interaction.guildId });
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new EmbedBuilder()
        .setDescription("24/7 **desabilitado**.")
        .setColor(client.embedColor);
      await interaction
        .editReply({ embeds: [embed] })
        .catch((err) => console.error("Promise Rejected At", err));
    } else {
      player.twentyFourSeven = true;
      const embed = new EmbedBuilder()
        .setDescription("24/7 **habilitado**.")
        .setColor(client.embedColor);
      await interaction
        .editReply({ embeds: [embed] })
        .catch((err) => console.error("Promise Rejected At", err));
    }

    if (!data)
      return await Model.create({
        Guild: player.guild,
        247: player.twentyFourSeven,
        VoiceChannel: interaction.guild.members.me.voice?.channelId,
        TextChannel: interaction.channelId,
      });

    await data.update({
      Guild: player.guild,
      247: player.twentyFourSeven,
      VoiceChannel: interaction.guild.members.me.voice?.channelId,
      TextChannel: interaction.channelId,
    });
    return;
  },
};
