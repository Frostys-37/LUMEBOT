const { EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const warningSchema = require("../../schema/warns");
const reportSchema = require("../../schema/reports"); 
const emojis = require("../../emojis.json");

module.exports = {
    name: "userinfo",
    description: "Muestra el expediente completo de un usuario (Warns, Sanciones y Datos).",
    usage: "/userinfo <usuario>",
    category: "Moderación",
    userPrems: ["ModerateMembers"],
    options: [
        {
            name: "usuario",
            description: "Usuario a consultar.",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const target = interaction.options.getUser("usuario");
        const member = await interaction.guild.members.fetch(target.id).catch(() => null);

        try {

            const warnData = await warningSchema.findOne({ GuildID: interaction.guildId, UserID: target.id });
            const totalWarns = warnData ? warnData.Content.length : 0;

            const sancionesData = await reportSchema.find({ 
                status: "Aceptado",
                $or: [
                    { mcUser: target.username }, 
                    { reportId: { $exists: true } } 
                ]
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Expediente de ${target.username}`, iconURL: target.displayAvatarURL() })
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .setColor(client.embedColor || "Blue")
                .addFields(
                    { 
                        name: `📌 Información de Discord`, 
                        value: `**ID:** \`${target.id}\`\n**Cuenta Creada:** <t:${Math.floor(target.createdTimestamp / 1000)}:R>\n**Entró al Servidor:** ${member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "No está en el servidor"}`,
                        inline: false 
                    },
                    { 
                        name: `${emojis.warns || "⚠️"} Historial de Advertencias`, 
                        value: `Total: \`${totalWarns}\` warns.`, 
                        inline: true 
                    },
                    { 
                        name: `⚖️ Historial de Sanciones`, 
                        value: `Total: \`${sancionesData.length}\` sanciones aplicadas.`, 
                        inline: true 
                    }
                );

            if (totalWarns > 0) {
                const ultimosWarns = warnData.Content.slice(-3).reverse()
                    .map((w, i) => `• **Razón:** ${w.Reason} (por <@${w.ExecuterId}>)`)
                    .join("\n");
                embed.addFields({ name: `${emojis.warn || "⚠️"} Últimos Warns`, value: ultimosWarns });
            }

            if (sancionesData.length > 0) {
                const ultimasSanciones = sancionesData.slice(-3).reverse()
                    .map((s) => `• **${s.staffAction}:** ${s.reason} (ID: #${s.reportId})`)
                    .join("\n");
                embed.addFields({ name: `${emojis.report || "📝"} Últimas Sanciones (MC)`, value: ultimasSanciones });
            }

            if (member) {
                embed.addFields({ 
                    name: `${emojis.rol || "🏷️"} Roles [${member.roles.cache.size - 1}]`, 
                    value: member.roles.cache.filter(r => r.id !== interaction.guildId).map(r => r).join(", ") || "Ninguno" 
                });
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "Hubo un error al consultar el expediente del usuario." });
        }
    }
};