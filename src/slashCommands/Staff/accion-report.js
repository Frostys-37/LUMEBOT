const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require(`discord.js`);
const Reporte = require("../../schema/reports");

module.exports = {
    name: "accion",
    description: "Toma una acción sobre un reporte.",
    category: "Staff",
    usage: "/accion <id> <estado> <explicacion> [prueba_staff]",
    userPrems: ["ManageMessages"],
    options: [
        { name: "id", description: "ID del reporte (#XXXXXX)", type: ApplicationCommandOptionType.String, required: true },
        { name: "estado", description: "Estado del reporte", type: ApplicationCommandOptionType.String, required: true,
            choices: [
                { name: "Aceptado - Sancionado", value: "Aceptado" },
                { name: "Denegado - Pruebas Insuficientes", value: "Denegado" },
                { name: "Falsa Alarma", value: "Resuelto" }
            ]
        },
        { name: "explicacion", description: "Detalles de la sanción o por qué se denegó.", type: ApplicationCommandOptionType.String, required: true },
        { name: "prueba_staff", description: "Imagen o enlace de la sanción aplicada.", type: ApplicationCommandOptionType.String, required: false }
    ],

    run: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const reportId = interaction.options.getString("id").toUpperCase();
        const estado = interaction.options.getString("estado");
        const explicacion = interaction.options.getString("explicacion");
        const pruebaStaff = interaction.options.getString("prueba_staff") || "No adjunta";

        const data = await Reporte.findOne({ reportId });
        if (!data) return interaction.editReply({ content: `${emojis.error} | No encontré ningún reporte con esa ID.`, flags: [MessageFlags.Ephemeral] });

        data.status = estado;
        data.staffAction = explicacion;
        await data.save();

        const embedSancion = new EmbedBuilder()
            .setTitle(`⚖️ | Acción Tomada - Reporte #${reportId}`)
            .setColor(estado === "Aceptado" ? "Green" : "Red")
            .addFields(
                { name: "Staff responsable:", value: `${interaction.user.tag}` },
                { name: "Usuario MC Reportado:", value: `\`${data.mcUser}\`` },
                { name: "Estado Final:", value: estado },
                { name: "Explicación:", value: explicacion },
                { name: "Prueba de Sanción:", value: pruebaStaff }
            )
            .setTimestamp();

        const logChannel = await client.channels.fetch("793949145986760785");
        await logChannel.send({ embeds: [embedSancion] });

        const user = await client.users.fetch(data.userId).catch(() => null);
        if (user) {
            const embedUser = new EmbedBuilder()
                .setTitle(`📰 | Actualización de tu reporte #${reportId}`)
                .setDescription(`El Staff ha revisado tu reporte contra **${data.mcUser}**.`)
                .addFields(
                    { name: "Estado:", value: `**${estado}**` },
                    { name: "Nota del Staff:", value: explicacion }
                )
                .setColor("Blue")
                .setFooter({ text: "Gracias por hacer de este lugar un lugar mejor." });

            await user.send({ embeds: [embedUser] }).catch(() => {});
        }

        await interaction.editReply({ content: `Acción registrada para el reporte #${reportId}`, flags: [MessageFlags.Ephemeral] });
    }
}