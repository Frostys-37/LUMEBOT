const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const emojis = require("../../emojis.json");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {LUMEBOT} client
     * @param {Interaction} interaction
     */
    run: async (client, interaction) => {
        if (!interaction.isButton()) return;
        if (!["video_accept", "video_deny"].includes(interaction.customId)) return;

        const staffIds = client.config.staffBypassIds || [];
        if (!staffIds.includes(interaction.user.id)) {
            return interaction.reply({
                content: "No tienes permiso para gestionar los videos.",
                ephemeral: true
            });
        }

        const embedOriginal = interaction.message.embeds[0];
        if (!embedOriginal) {
            return interaction.reply({
                content: "No se encontró la información del embed original.",
                ephemeral: true
            });
        }

        const linkField = embedOriginal.fields.find(f => f.name.includes("Enlace"));
        const link = linkField ? linkField.value : null;

        const userField = embedOriginal.fields.find(f => f.name.includes("Usuario"));
        const userIdMatch = userField ? userField.value.match(/<@!?(\d+)>/) : null;
        const authorUser = userIdMatch ? await client.users.fetch(userIdMatch[1]).catch(() => null) : null;

        if (interaction.customId === "video_accept") {
            const publicChannel = await client.channels.fetch(client.config.videoPublicChannelId).catch(() => null);

            if (publicChannel && link) {
                const btnLink = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setURL(link)
                        .setLabel("¡Ve al vídeo!")
                        .setStyle(ButtonStyle.Link)
                );

                await publicChannel.send({
                    content: "¡Nuevo contenido publicado!",
                    embeds: [embedOriginal],
                    components: [btnLink]
                }).catch(() => {});
            }

            if (authorUser) {
                await authorUser.send({
                    content: `${emojis.succes || "✅"} Tu contenido enviado (${link || "Vídeo"}) ha sido **aceptado** por el equipo de moderación y publicado en el servidor.`
                }).catch(() => {
            
                });
            }

            await interaction.update({
                content: `${emojis.succes || "✅"} | Aceptado por ${interaction.user.tag}`,
                components: []
            });
        }

        if (interaction.customId === "video_deny") {
            if (authorUser) {
                await authorUser.send({
                    content: `${emojis.error || "❌"} Tu contenido enviado (${link || "Vídeo"}) ha sido **denegado** por el equipo de moderación.`
                }).catch(() => {
                    
                });
            }

            await interaction.update({
                content: `${emojis.error || "❌"} | Denegado por ${interaction.user.tag}`,
                components: []
            });
        }
    }
};