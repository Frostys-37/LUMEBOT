const db = require('megadb');
const rank = new db.crearDB("rankground")
const Discord = require("discord.js")
const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: `set-rank`,
    category: "Utility",
    description: `Establece el background de tu tarjeta rank.`,
    userPrems: [`SendMessages`],
    options: [
        {
            name: `link`,
            description: `Coloca tu img a través de un enlace, 400x150 recomendado, formatos: png, jpg.`,
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
        const link = interaction.options.getAttachment("link")
        const proxyURL = link.proxyURL

        const user = interaction.user;

        rank.establecer(`${interaction.guildId}.${user.id}`, proxyURL)

        const embed = new Discord.EmbedBuilder()
        .setTitle("Tu background ha sido establecido")
        .setImage(link.url)
        .setTimestamp(Date.now())
        .setColor(client.embedColor)

        interaction.editReply({embeds: [embed]})

    }
}