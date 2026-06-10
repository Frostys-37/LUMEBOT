const { ApplicationCommandOptionType, MessageFlags } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require(`./../../emojis.json`)
module.exports = {
    name: `unban`,
    category: "Staff",
    usage: "/unban <id_usuario>",
    description: `Desbanea a un usuario del servidor.`,
    userPrems: [`BanMembers`],
    options: [
        {
            name: `usuario`,
            description: `Proporciona la ID del usuario.`,
            type: ApplicationCommandOptionType.User,
            required: true

        }
    ],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
          });

        const target = interaction.options.getUser("usuario")
        if(!target) return interaction.reply({content: `Necesito que coloques el usuario a desbanear.`, flags: [MessageFlags.Ephemeral]})

        await interaction.guild.members.unban(target)
        
        const embed = new Discord.EmbedBuilder()
        .setTitle(`${emojis.ban} | Usuario Desbaneado`)
        .addFields(
            { name: `${emojis.user} | Usuario:`, value:`[ REGRESA DEL BAN ] ${target} | ${target.id}`},
            { name: `${emojis.moder} | Moderador:`, value:`[${interaction.member.roles.highest}] ${interaction.user} | ${interaction.user.id}`},
            { name: `${emojis.channel} | Comando ejecutado en:`, value:`${interaction.channel.name}`}
        )
        .setColor(client.embedColor)
        .setTimestamp(Date.now())
        .setFooter({ text: 'Usuario Desbaneado del Servidor'}, client.user.avatarURL())

        await interaction.editReply({embeds: [embed]})
        client.channels.fetch('1074861661665636352').then(channel => {
            channel.send({ embeds: [embed] })
        })
    }
}