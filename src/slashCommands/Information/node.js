const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "node",
    description: "Mira información del bot.",
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
     const all = client.manager.nodes.map(node => 
            `Node ${(node.options.identifier)} conectado` +
            `\nusuarios: ${node.stats.players}` +
            `\nUsuarios escuchando: ${node.stats.playingPlayers}` +
            `\nUptime: ${new Date(node.stats.uptime).toISOString().slice(11, 19)}` +
            `\n\nMemoria` +
            `\nReservas de memoria: ${Math.round(node.stats.memory.reservable / 1024 / 1024)}mb` +
            `\nMemoria usada: ${Math.round(node.stats.memory.used / 1024 / 1024)}mb` +
            `\nMemoria Libre: ${Math.round(node.stats.memory.free / 1024 / 1024)}mb` +
            `\nMemoria asignada: ${Math.round(node.stats.memory.allocated / 1024 / 1024)}mb` +
            "\n\nCPU" +
            `\nCores: ${node.stats.cpu.cores}` +
            `\nSystem Load: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` +
            `\nLavalink Load: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`).join('\n\n----------------------------\n');

        const embed = new EmbedBuilder()
            .setAuthor({name: 'Lavalink Node', iconURL: client.user.displayAvatarURL()})
            .setDescription(`\`\`\`${all}\`\`\``)
            .setColor(client.embedColor)
        await interaction.followUp({embeds: [embed]})
    }
}
