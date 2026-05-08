const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Mira el ping del bot.",
    category: "Information",
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        await interaction.editReply({ content: "Pinging..." }).then(async () => {
            const ping = Date.now() - interaction.createdAt;
            const api_ping = client.ws.ping;

            await interaction.editReply({
                content: "`🏓`",
                embeds: [new EmbedBuilder().setAuthor({ name: `Pong`, iconURL: client.user.displayAvatarURL() }).setColor(client.embedColor).setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).addFields([{ name: "Latencia del bot", value: `\`\`\`ini\n[ ${ping}ms ]\n\`\`\``, inline: true }, { name: "Latencia de API", value: `\`\`\`ini\n[ ${api_ping}ms ]\n\`\`\``, inline: true }]).setTimestamp()]
            });
        })
    }
}
