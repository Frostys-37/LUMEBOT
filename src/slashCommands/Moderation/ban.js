const { ApplicationCommandOptionType } = require("discord.js")
const Discord = require("discord.js")
const emojis = require("./../../emojis.json")
module.exports = {
    name: "ban",
    description: "Banea a un usuario del servidor.",
    category: "Moderation",
    userPrems: ["BanMembers"],
    options: [
        {
            name: "usuario",
            description: "Menciona a un usuario del servidor.",
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: "reason",
            description: "Coloca una razón para banear al usuario.",
            type: ApplicationCommandOptionType.String,
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
            ephemeral: false
          });

        const target = interaction.options.getUser("usuario")
        if(!target) return interaction.reply({content: "Necesito que coloques el usuario a banear.", ephemeral: true})
        const reason = interaction.options.getString("reason")
        if(!reason) return interaction.reply({content: "Necesito que coloques la razón.", ephemeral: true})

        await interaction.guild.members.ban(target, {reason: reason})
        
        const banembed = new Discord.EmbedBuilder()
        .setTitle(`${emojis.ban} | Usuario Baneado`)
        .addFields(
            { name: `${emojis.user} | Usuario:`, value:`${target} | ${target.id}`},
            { name: `${emojis.moder} | Moderador:`, value:`[${interaction.member.roles.highest}] ${interaction.user} | ${interaction.user.id}`},
            { name: `${emojis.razon} | Razón:`, value:`${reason}`},
            { name: `${emojis.channel} | Comando ejecutado en:`, value:`${interaction.channel.name}`}
        )
        .setColor(client.embedColor)
        .setTimestamp(Date.now())
        .setFooter({ text: 'Usuario Baneado del Servidor'}, client.user.avatarURL())

        await interaction.editReply({ embeds: [banembed], ephemeral: false })
        client.channels.cache.get('1074861661665636352').send({ embeds: [banembed] })


    }
}