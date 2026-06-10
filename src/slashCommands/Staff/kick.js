const { ApplicationCommandOptionType, MessageFlags } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require("../../emojis.json")
module.exports = {
    name: `kick`,
    category: "Staff",
    usage: "/kick <usuario> <reason>",
    description: `Expulsa a un usuario del servidor.`,
    userPrems: [`BanMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: `reason`,
            description: `Coloca una razón para banear al usuario.`,
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
            flags: [MessageFlags.Ephemeral]
        });

        const target = interaction.options.getUser("usuario")
        if (!target) return interaction.reply({ content: "No has mencionado a un usuario.", flags: [MessageFlags.Ephemeral] })

        const reason = interaction.options.getString("reason")
        if (!reason) return interaction.reply({ content: "La razón es requerida.", flags: [MessageFlags.Ephemeral] })

        const member = await interaction.guild.members.fetch(target.id)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ content: "El usuario tiene un rol mas alto que el tuyo.", flags: [MessageFlags.Ephemeral] });

        if (target.id === client.config.ownerID) return interaction.reply({ content: "No puedes expulsar a mi desarrollador.", flags: [MessageFlags.Ephemeral] })

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ content: "No tengo permisos para moderar el servidor.", flags: [MessageFlags.Ephemeral] });

        await interaction.guild.members.kick(target, { reason: reason })

        const banembed = new Discord.EmbedBuilder()
            .setTitle(`${emojis.kick} | Usuario Expulsado`)
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${target} | ${target.id}` },
                { name: `${emojis.moder} | Moderador:`, value: `[${interaction.member.roles.highest}] ${interaction.user.tag} | ${interaction.user.id}` },
                { name: `${emojis.razon} | Razón:`, value: `${reason}` },
                { name: `${emojis.channel} | Comando ejecutado en:`, value: `${interaction.channel.name}` }
            )
            .setColor(client.embedColor)
            .setTimestamp(Date.now())
            .setFooter({ text: 'Usuario Expulsado del Servidor' }, client.user.avatarURL())

        await interaction.editReply({ embeds: [banembed] })
        client.channels.fetch('1074861661665636352').then(channel => {
            channel.send({ embeds: [banembed] })
        })    
    }
}