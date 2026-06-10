const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags } = require("discord.js");
const emojis = require("../../emojis.json");

module.exports = {
    name: "help",
    description: "Muestra la lista de comandos y su modo de uso.",
    category: "Information",

    run: async (client, interaction) => {
        await interaction.deferReply();

        const categories = [...new Set(client.slashCommands.map(cmd => cmd.category || "General"))];

        const embedPrincipal = new EmbedBuilder()
            .setTitle(`${emojis.user || "📂"} | Panel de Ayuda de Lumecraft`)
            .setDescription("Selecciona una categoría en el menú para ver los comandos y cómo usarlos correctamente.")
            .setColor(client.embedColor || "Blue")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: "Lumecraft Network - Help" });

        const menu = new StringSelectMenuBuilder()
            .setCustomId("help-menu")
            .setPlaceholder("Selecciona una categoría")
            .addOptions(
                categories.map(cat => ({
                    label: `${cat}`,
                    value: `${cat}`,
                    emoji: getCategoryEmoji(cat)
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        const response = await interaction.editReply({
            embeds: [embedPrincipal],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000
        });

        collector.on("collect", async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: "Usa tu propio comando.", flags: [MessageFlags.Ephemeral] });

            const categoryName = i.values[0];
            const cmds = client.slashCommands.filter(cmd => cmd.category === categoryName);

            const embedCategory = new EmbedBuilder()
                .setTitle(`${getCategoryEmoji(categoryName)} | Categoría: ${categoryName}`)
                .setColor(client.embedColor || "Blue")
                .setDescription("Si un comando tiene [], significa que el argumento es opcional.\nSi tiene <>, el argumento es obligatorio.\n\n" +
                    cmds.map(cmd => {
                        const usage = cmd.usage ? `\`${cmd.usage}\`` : `\`/${cmd.name}\``;
                        return `**/${cmd.name}**\n> ${cmd.description || "Sin descripción"}\n> **Uso:** ${usage}`;
                    }).join("\n\n")
                );

            await i.update({ embeds: [embedCategory] });
        });

        collector.on("end", () => {
            interaction.editReply({ components: [] }).catch(() => {});
        });
    }
};

function getCategoryEmoji(category) {
    const categories = {
        "Config": "⚙️",
        "Information": "ℹ️",
        "Staff": "🛡️",
        "Utility": "🔧"
    };
    return categories[category] || "📁";
}