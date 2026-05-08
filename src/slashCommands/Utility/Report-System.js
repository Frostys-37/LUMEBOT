const { ApplicationCommandOptionType } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require("./../../emojis.json")
module.exports = {
    name: `reporte`,
    category: "Utility",
    description: `Reporta una acción o comportamiento no apropiado del servidor.`,
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
        }
    ],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
          });

          const usuario = interaction.options.getString("usuario");
          const reporte = interaction.options.getString("reporte");
          const img = interaction.options.getAttachment("imagen");

           const embed = new Discord.EmbedBuilder()
           .setTitle(`${emojis.report} | Nuevo Reporte`)
           .setFields(
            {name: `${emojis.user} | Usuario Discord:`, value: `${interaction.user} - ${interaction.user.id}`},
            {name: `${emojis.user} | Usuario Minecraft:`, value: `${usuario}`},
            {name: `${emojis.reportmsg} | Reporte:`, value: `${reporte}`}
           )
           .setImage(img.url)
           .setColor(client.embedColor)
           .setTimestamp()
           .setFooter({ text: "Sistema de Reportes", iconURL: client.user.avatarURL()})

          interaction.reply({content: "Comando ejecutado correctamente, gracias.", ephemeral: true})
          client.channels.cache.get("931646202628436058").send({embeds: [embed]})
          client.users.send(interaction.user.id, "Reporte enviado, gracias por tu ayuda.")

        }
    }