const { ApplicationCommandOptionType, MessageFlags, EmbedBuilder } = require(`discord.js`);
const emojis = require(`../../emojis.json`);
const warningSchema = require("../../schema/warns");

module.exports = {
    name: `warnings`,
    category: "Staff",
    usage: "/warnings <usuario>",
    description: `Mira las advertencias del usuario.`,
    userPrems: [`ModerateMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const guildId = interaction.guildId;
        const target = interaction.options.getUser("usuario");

        try {
            const data = await warningSchema.findOne({ GuildID: guildId, UserID: target.id });

            if (data && data.Content.length > 0) {
                const listaWarns = data.Content.map((w, i) => {
                    return `**#${i + 1}** | Mod: <@${w.ExecuterId}>\n> Razón: ${w.Reason}`;
                }).join("\n\n");

                const embed1 = new EmbedBuilder()
                    .setTitle(`${emojis.warn || "⚠️"} | Historial de Warns`)
                    .addFields(
                        { name: `${emojis.user || "👤"} | Usuario:`, value: `${target} (\`${target.id}\`)`, inline: true },
                        { name: `${emojis.moder || "🛡️"} | Solicitado por:`, value: `${interaction.user}`, inline: true }
                    )
                    .setDescription(`${emojis.warns || "📋"} | **Lista de advertencias:**\n\n${listaWarns}`)
                    .setColor(client.embedColor || "Orange")
                    .setTimestamp()
                    .setFooter({ text: `Consultado por ${interaction.user.username}`, iconURL: client.user.avatarURL() });

                await interaction.editReply({ embeds: [embed1] });

            } else {
                const nowarningEmbed = new EmbedBuilder()
                    .setColor(client.embedColor || "Green")
                    .setDescription(`${emojis.error || "✅"} | El usuario **${target.username}** no cuenta con advertencias registradas.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [nowarningEmbed] });
            }

        } catch (error) {
            console.error("Error al consultar warns:", error);
            await interaction.editReply({ content: "Hubo un error al conectar con la base de datos." });
        }
    }
}