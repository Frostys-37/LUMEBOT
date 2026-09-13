const { ApplicationCommandOptionType, MessageFlags } = require("discord.js")
const Discord = require("discord.js")
const emojis = require("../../emojis.json");
const { usage } = require("./accion-report");
module.exports = {
    name: "ban",
    description: "Banea a un usuario del servidor.",
    category: "Staff",
    usage: "/ban <usuario> <reason>",
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
            flags: [MessageFlags.Ephemeral]
        });

        const target = interaction.options.getUser("usuario")
        if (!target) return interaction.reply({ content: "No has mencionado a un usuario.", flags: [MessageFlags.Ephemeral] })

        const reason = interaction.options.getString("reason")
        if (!reason) return interaction.reply({ content: "La razón es requerida.", flags: [MessageFlags.Ephemeral] })

        const member = await interaction.guild.members.fetch(target.id)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ content: "El usuario tiene un rol mas alto que el tuyo.", flags: [MessageFlags.Ephemeral] });

        if (member.id === client.config.ownerID) return interaction.reply({ content: "No puedes expulsar a mi desarrollador.", flags: [MessageFlags.Ephemeral] })

        await interaction.guild.members.ban(target, { reason: reason })

        const banembed = new Discord.EmbedBuilder()
            .setTitle(`${emojis.ban} | Usuario Baneado`)
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${target} | ${target.id}` },
                { name: `${emojis.moder} | Moderador:`, value: `[${interaction.member.roles.highest}] ${interaction.user} | ${interaction.user.id}` },
                { name: `${emojis.razon} | Razón:`, value: `${reason}` },
                { name: `${emojis.channel} | Comando ejecutado en:`, value: `${interaction.channel.name}` }
            )
            .setColor(client.embedColor)
            .setTimestamp(Date.now())
            .setFooter({ text: 'Usuario Baneado del Servidor' }, client.user.avatarURL())

        await interaction.editReply({ embeds: [banembed] })
        client.channels.fetch('1074861661665636352').then(channel => {
            channel.send({ embeds: [banembed] })
        })
    }
}