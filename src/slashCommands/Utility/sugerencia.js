const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const SuggestionCooldown = require("../../schema/suggestionCooldown");
const emojis = require("../../emojis.json");

module.exports = {
    name: "sugerir",
    description: "Envía una sugerencia para el servidor (Límite: 1 al día).",
    usage: "/sugerir <sugerencia>",
    category: "Utility",
    options: [
        {
            name: "sugerencia",
            description: "Describe tu sugerencia de forma clara.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const sugerencia = interaction.options.getString("sugerencia");
        const userId = interaction.user.id;
        
        const staffIds = [
            "793926625765883955",
            "535945446087065621",
            "857874928534814720"
        ];

        const isOwner = interaction.guild.ownerId === userId;
        const isStaff = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);
        const isDev = staffIds.includes(userId);

        const bypassCooldown = isOwner || isStaff || isDev;

        try {
            if (!bypassCooldown) {
                const cooldownTime = 24 * 60 * 60 * 1000;
                let userCooldown = await SuggestionCooldown.findOne({ userId });

                if (userCooldown) {
                    const tiempoPasado = Date.now() - userCooldown.lastSuggestion;

                    if (tiempoPasado < cooldownTime) {
                        const tiempoRestante = cooldownTime - tiempoPasado;
                        const horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
                        const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));

                        return interaction.editReply({
                            content: `Ya has enviado una sugerencia hoy. Podrás enviar otra en **${horas}h ${minutos}m**.`
                        });
                    }
                }
            }

            const canalSugerencias = await client.channels.fetch("1504589471151161453"); 
            if (!canalSugerencias) return interaction.editReply({ content: "Error: No se encontró el canal de sugerencias." });

            const embedSugerencia = new EmbedBuilder()
            .setTitle("💡 | Nueva Sugerencia")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`\`\`\`\n${sugerencia}\n\`\`\``)
            .addFields({ name: "Estado", value: `${emojis.reloj} Esperando valoración...` })
            .setColor(client.embedColor || "Blue")
            .setFooter({ text: bypassCooldown ? "Sugerencia de Staff" : "Vota usando las reacciones de abajo" })
            .setTimestamp();

            const mensaje = await canalSugerencias.send({ embeds: [embedSugerencia] });
            await mensaje.react(`${emojis.succes}`);
            await mensaje.react(`${emojis.error}`);

            if (!bypassCooldown) {
                await SuggestionCooldown.findOneAndUpdate(
                    { userId }, 
                    { lastSuggestion: Date.now() }, 
                    { upsert: true }
                );
            }

            await interaction.editReply({ 
                content: bypassCooldown ? "Sugerencia enviada (Bypass de Staff activo)." : "Tu sugerencia ha sido enviada." 
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "Hubo un error al procesar tu sugerencia." });
        }
    }
};