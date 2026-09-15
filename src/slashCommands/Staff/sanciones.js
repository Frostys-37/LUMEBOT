const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags } = require(`discord.js`);
const Reporte = require("../../schema/reports");
const emojis = require("../../emojis.json");

const ESTADO_EMOJI = {
    Pendiente: emojis.reloj,
    Aceptado: emojis.succes,
    Denegado: emojis.error,
    Resuelto: emojis.succes,
};

const ESTADO_COLOR = {
    Pendiente: "Grey",
    Aceptado: "Green",
    Denegado: "Red",
    Resuelto: "Blue",
};

module.exports = {
    name: "sanciones",
    description: "Muestra la lista de reportes registrados para ver sus detalles.",
    category: "Staff",
    usage: "/sanciones",
    userPrems: ["ManageMessages"],

    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const reportes = await Reporte.find({})
            .sort({ timestamp: -1 })
            .limit(25);

        if (reportes.length === 0) {
            return interaction.editReply({ content: `${emojis.error} | No hay reportes registrados en la base de datos.`, flags: [MessageFlags.Ephemeral] });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('select-sancion')
            .setPlaceholder('Selecciona una ID de reporte para ver detalles')
            .addOptions(
                reportes.map(rep => ({
                    label: `ID: ${rep.reportId}`,
                    description: `Usuario: ${rep.mcUser} | Estado: ${rep.status}`,
                    value: rep.reportId,
                    emoji: ESTADO_EMOJI[rep.status] || emojis.error
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        const embedPrincipal = new EmbedBuilder()
            .setTitle("⚖️ | Historial de Reportes - Lumecraft")
            .setDescription("Selecciona un reporte del menú de abajo para ver la información completa, pruebas y staff responsable.")
            .setColor(client.embedColor)
            .setFooter({ text: `Mostrando los últimos ${reportes.length} registros.` });

        const response = await interaction.editReply({ 
            embeds: [embedPrincipal], 
            components: [row], 
            flags: [MessageFlags.Ephemeral]
        });

        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect, 
            time: 60000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: "No puedes usar este menú.", flags: [MessageFlags.Ephemeral] });

            const seleccionado = reportes.find(r => r.reportId === i.values[0]);

            const embedDetalle = new EmbedBuilder()
                .setTitle(`📄 | Detalle del Reporte #${seleccionado.reportId}`)
                .setColor(ESTADO_COLOR[seleccionado.status] || "Grey")
                .addFields(
                    { name: `${emojis.user} | Usuario Minecraft:`, value: `\`${seleccionado.mcUser}\``, inline: true },
                    { name: `${emojis.razon} | Estado:`, value: seleccionado.status, inline: true },
                    { name: `${emojis.reportmsg} | Motivo del Reporte:`, value: seleccionado.reason },
                    { name: `${emojis.moder} | Acción del Staff:`, value: seleccionado.staffAction || "Ninguna" },
                    { name: `${emojis.link} | Enlace de Prueba (Usuario):`, value: seleccionado.link || "Ninguno" },
                    { name: `${emojis.reloj} | Fecha:`, value: `<t:${Math.floor(new Date(seleccionado.timestamp).getTime() / 1000)}:R>`, inline: true }
                )
                .setImage(seleccionado.evidence || null)
                .setFooter({ text: `ID de base de datos: ${seleccionado._id}` });

            await i.update({ embeds: [embedDetalle] });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(() => {});
        });
    }
}