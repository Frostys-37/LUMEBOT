const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    MessageFlags,
} = require(`discord.js`);
const Discord = require(`discord.js`);
const emojis = require("./../../emojis.json");
const ms = require("ms");
module.exports = {
    name: `mute`,
    category: "Staff",
    usage: "/mute <usuario> <tiempo> <razón>",
    description: `Silencia a un usuario en el servidor.`,
    userPrems: [`ModerateMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "tiempo",
            description: "Menciona el tiempo a mutear al usuario",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: `razón`,
            description: `Coloca una razón para mutear al usuario.`,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral],
        });

        const user = interaction.options.getMember("usuario");
        const tiempo = interaction.options.getString("tiempo");
        const convertedTime = ms(tiempo);
        const reason = interaction.options.getString("razón");
        const member = await interaction.guild.members.fetch(user.id);

        if (!user)
            return interaction.reply({
                content: "No has mencionado a un usuario.",
                flags: [MessageFlags.Ephemeral],
            });
        if (!tiempo)
            return interaction.reply({
                content: "No has mencionado un tiempo.",
                flags: [MessageFlags.Ephemeral],
            });
        if (!reason)
            return interaction.reply({
                content: "La razón es requerida.",
                flags: [MessageFlags.Ephemeral],
            });

        if (
            member.roles.highest.position >= interaction.member.roles.highest.position
        )
            return interaction.reply({
                content: "El usuario tiene un rol mas alto que el tuyo.",
                flags: [MessageFlags.Ephemeral],
            });

        if (
            !interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ModerateMembers,
            )
        )
            return interaction.reply({
                content: "No tengo permisos para moderar el servidor.",
                flags: [MessageFlags.Ephemeral],
            });

        if (convertedTime < 10000 || convertedTime > 2419200000)
            return interaction.reply({
                content: "El tiempo debe ser entre 10 segundos y 28 días.",
                flags: [MessageFlags.Ephemeral],
            });
        if (user.id === client.config.ownerID)
            return interaction.reply({
                content: "No puedes silenciar a mi desarrollador.",
                flags: [MessageFlags.Ephemeral],
            });

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${emojis.timeout} | Usuario Silenciado`)
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${user} | ${user.id}` },
                {
                    name: `${emojis.moder} | Moderador:`,
                    value: `[${interaction.member.roles.highest}] ${interaction.user.tag} | ${interaction.user.id}`,
                },
                { name: `${emojis.razon} | Razón:`, value: `${reason}` },
                { name: `${emojis.reloj} | Tiempo:`, value: `${tiempo}` },
                {
                    name: `${emojis.channel} | Comando ejecutado en:`,
                    value: `${interaction.channel.name}`,
                },
            )
            .setColor(client.embedColor)
            .setTimestamp(Date.now())
            .setFooter(
                { text: "Usuario Silenciado en el servidor" },
                client.user.avatarURL(),
            );

        try {
            await member.timeout(convertedTime, reason);

            await interaction.editReply({
                embeds: [embed],
                flags: [MessageFlags.Ephemeral],
            });
            client.channels.fetch("1074861661665636352").then((channel) => {
                channel.send({ embeds: [embed] });
            });
        } catch (err) {
            console.log(err);
        }
    },
};
