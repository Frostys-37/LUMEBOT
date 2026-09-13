const { ApplicationCommandOptionType, MessageFlags } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require(`./../../emojis.json`)
const warningSchema = require("../../schema/warns")
const { Timestamp } = require("mongodb")
module.exports = {
    name: `warn`,
    category: "Staff",
    description: `Advierte a un usuario en el servidor.`,
    usage: "/warn <usuario> <razón>",
    userPrems: [`BanMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: "razón",
            description: `Razón de la advertencia.`,
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

        const guildId = interaction.guildId;
        const user = interaction.user;

        const target = interaction.options.getUser("usuario");
        const reason = interaction.options.getString("razón");
        const userTag = `${target.username}`;

        if (!target) return interaction.reply({ content: "No has mencionado a un usuario.", flags: [MessageFlags.Ephemeral] })
        if (!reason) return interaction.reply({ content: "La razón es requerida.", flags: [MessageFlags.Ephemeral] })

        try {

            let data = await warningSchema.findOne({ GuildID: guildId, UserID: target.id })

            const WarnContent = {
                ExecuterId: user.id,
                ExecuterTag: user.tag,
                Reason: reason,
                Timestamp: Date.now()
            }

            if (!data) {
                data = new warningSchema({
                    GuildID: guildId,
                    UserID: target.id,
                    UserTag: userTag,
                    Content: [WarnContent]
                });
            } else {
                data.Content.push(WarnContent)
            }

            await data.save()

        } catch (err) {
            console.log(err)
            return interaction.reply({ content: "Ocurrió un error al guardar la advertencia en la base de datos.", flags: [MessageFlags.Ephemeral] })
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${emojis.warn} | Advertencia a Usuario`)
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${target} | ${target.id}` },
                { name: `${emojis.moder} | Moderador:`, value: `**[${interaction.member.roles.highest}]** ${interaction.user} | ${interaction.user.id}` },
                { name: `${emojis.razon} | Razón:`, value: `${reason}` },
                { name: `${emojis.channel} | Comando ejecutado en:`, value: `${interaction.channel.name}` }
            )
            .setColor(client.embedColor)
            .setTimestamp(Date.now())
            .setFooter({ text: 'Usuario Advertido' }, client.user.avatarURL())

        await interaction.editReply({ embeds: [embed] })

        target.send({ content: `Has sido advertido en: **${interaction.guild.name}**`, embeds: [embed] })
    }
}