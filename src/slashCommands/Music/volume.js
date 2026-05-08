const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  category: "Music",
  description: "Cambia el volumen del bot.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Volumen disponible de 0 a 100",
      required: true,
      type: ApplicationCommandOptionType.Number,
    }
  ],

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @param {String} color 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const emojivolume = client.emoji.volumehigh;

    const vol = interaction.options.getNumber("number");

    const player = client.manager.get(interaction.guildId);
    if (!player) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`No esta sonando nada.`)]
    }).catch(() => { });
    if (!player.queue.current) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`No esta sonando nada.`)]
    }).catch(() => { });
    const volume = Number(vol);
    if (!volume || volume < 0 || volume > 100) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Uso: ${client.prefix}volume <0 - 100>`)]
    }).catch(() => { });

    player.setVolume(volume);
    if (volume > player.volume) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojivolume} Volumen cambiado a: **${volume}%**`)]
    }).catch(() => { });
    else if (volume < player.volume) return await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojivolume} Volumen cambiado a: **${volume}%**`)]
    }).catch(() => { });
    else
      await interaction.editReply({
        embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`${emojivolume} Cambiado a: **${volume}%**`)]
      }).catch(() => { });
  }
}
