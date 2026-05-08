const { EmbedBuilder, CommandInteraction, Client, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');

module.exports = {
  name: "grab",
  description: "Graba la canción que esta sonando.",
  userPrems: [],
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
    let player = interaction.client.manager.get(interaction.guildId);
    const song = player.queue.current
    const total = song.duration;
    const current = player.position;

    const dmbut = new ButtonBuilder().setLabel("Mira tu dm").setStyle(ButtonStyle.Link).setURL(`https://discord.com/users/${client.id}`)
    const row = new ActionRowBuilder().addComponents(dmbut)

    let dm = new EmbedBuilder()
    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
    .setDescription(`:mailbox_with_mail: \`Mira tu dm!\``)
    .setColor(client.embedColor)
    .setFooter({text: `Grabado por: ${interaction.user.tag}`})
    .setTimestamp()
    interaction.reply({embeds: [dm], components: [row]})
    const user = client.users.cache.get(interaction.member.user.id);
    const urlbutt = new ButtonBuilder().setLabel("Buscar").setStyle(ButtonStyle.Link).setURL(song.uri)
    const row2 = new ActionRowBuilder().addComponents(urlbutt)
    let embed = new EmbedBuilder()
        .setDescription(`**Detalles de canción** \n\n > **__Nombre__**: [${song.title}](${song.uri}) \n > **__Duración__**: \`[${convertTime(song.duration)}]\` \n > **__Pedido por:__**: [<@${song.requester.id}>] \n > **__Guardado por:__**: [<@${interaction.user.id}>]`)
        .setThumbnail(song.displayThumbnail())
        .setColor(client.embedColor)
        .addFields([
            { name: "\u200b", value: `\`${convertTime(current)} / ${convertTime(total)}\`` }
        ])
     return user.send({embeds: [embed], components: [row2]})

   }
};