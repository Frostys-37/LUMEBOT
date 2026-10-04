const { ApplicationCommandOptionType, ButtonStyle, MessageFlags } = require("discord.js");
const Discord = require("discord.js");
const emojis = require("./../../emojis.json");

module.exports = {
    name: "video",
    description: "Manda tu contenido al servidor.",
    usage: "/video <enlace>",
    userPrems: ["SendMessages"],
    category: "Utility",
    options: [
        {
            name: "enlace",
            description: "Coloca tu contenido (TikTok, YouTube, Twitch, etc.).",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    /**
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const link = interaction.options.getString("enlace");

        if (!link.startsWith("https://")) {
            return interaction.editReply({
                content: "El enlace debe empezar con `https://`",
                flags: [MessageFlags.Ephemeral]
            });
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${emojis.youtube || "🎥"} | Contenido de Usuario`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: `${emojis.user || "👤"} | Usuario:`, value: `${interaction.user}` },
                { name: `${emojis.link || "🔗"} | Enlace:`, value: link }
            )
            .setFooter({ text: "Sistema de Videos", iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setColor(client.embedColor || "Blurple");

        const btnAccept = new Discord.ButtonBuilder()
            .setCustomId("video_accept")
            .setLabel("Aceptar")
            .setStyle(ButtonStyle.Success)
            .setEmoji("855695983094267904");

        const btnDeny = new Discord.ButtonBuilder()
            .setCustomId("video_deny")
            .setLabel("Denegar")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("855703357238935592");

        const row = new Discord.ActionRowBuilder().addComponents(btnAccept, btnDeny);

        const staffChannel = await client.channels.fetch(client.config.videoStaffChannelId).catch(() => null);
        if (!staffChannel) {
            return interaction.editReply({
                content: "No se pudo encontrar el canal del Staff para enviar el video.",
                flags: [MessageFlags.Ephemeral]
            });
        }

        await staffChannel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({
            content: "Tu vídeo ha sido enviado al equipo de moderación, pronto lo revisarán.",
            flags: [MessageFlags.Ephemeral]
        });
    }
};