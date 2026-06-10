const { ApplicationCommandOptionType, MessageFlags } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require("./../../emojis.json");
const { usage } = require("./VideoPost");
module.exports = {
    name: `reporte`,
    category: "Utility",
    description: `Reporta una acción o comportamiento no apropiado del servidor.`,
    usage: "/reporte <usuario> <reporte> <imagen> [link]",
    userPrems: [`SendMessages`],
    options: [
        {
            name: `usuario`,
            description: `Usuario al que quieres reportar (nick Minecraft).`,
            type: ApplicationCommandOptionType.String,
            required: true

        },
        {
            name: `reporte`,
            description: `Describe la situación, trata de ser breve y objetivo por favor.`,
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: `imagen`,
            description: "Para poder tomar acciones, necesitamos pruebas de que tu reporte es veridico.",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },
        {
            name: `link`,
            description: `Si tienes un enlace relacionado con tu reporte, colócalo aquí.`,
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
        });

        const usuario = interaction.options.getString("usuario");
        const reporte = interaction.options.getString("reporte");
        const img = interaction.options.getAttachment("imagen");
        const link = interaction.options.getString("link") || "No proporcionado";

        if (!usuario || !reporte || !img) return interaction.editReply({ content: "Faltan argumentos, por favor revisa el comando e intenta de nuevo.", flags: [MessageFlags.Ephemeral] })

        const reporteId = Math.random().toString(36).substring(2, 8).toUpperCase();

        const nuevoReporte = new (require("./../../schema/reports"))({
            reportId: reporteId,
            userId: interaction.user.id,
            mcUser: usuario,
            reason: reporte,
            evidence: img.url,
            link: link
        });

        await nuevoReporte.save();

        const embedStaff = new Discord.EmbedBuilder()
            .setTitle(`${emojis.report} | Nuevo Reporte`)
            .setFields(
                { name: `${emojis.user} | Usuario Discord:`, value: `${interaction.user} - ${interaction.user.id}` },
                { name: `${emojis.user} | Usuario Minecraft:`, value: `${usuario}` },
                { name: `${emojis.reportmsg} | Reporte:`, value: `${reporte}` },
                { name: `${emojis.link} | Enlace:`, value: `${link}` },
                { name: `${emojis.report_user} | ID del Reporte:`, value: `${reporteId}` }
            )
            .setImage(img.url)
            .setColor(client.embedColor)
            .setTimestamp()
            .setFooter({ text: "Sistema de Reportes", iconURL: client.user.avatarURL() })


        const staffChannel = await client.channels.fetch("931646202628436058");
        await staffChannel.send({ embeds: [embedStaff] })

        await interaction.editReply({ content: `Reporte enviado correctamente, gracias. ID del reporte: ${reporteId}\n\nCuando sea revisado y evaluado, nos pondremos en contacto contigo.`, flags: [MessageFlags.Ephemeral] });

        try {
            await interaction.user.send({ content: `Hola! Este es un mensaje automático para informarte que tu reporte con ID ${reporteId} ha sido recibido correctamente. Nuestro equipo de moderación revisará la información proporcionada y tomará las acciones necesarias. Te agradecemos por ayudarnos a mantener la comunidad segura y agradable para todos. Si tienes alguna pregunta adicional, no dudes en contactarnos a través del canal de reportes.` })
        } catch (error) {
            console.log(`No se pudo enviar el mensaje directo al usuario ${interaction.user.tag}. Posiblemente tenga los mensajes directos desactivados.`)
        }
    }

}