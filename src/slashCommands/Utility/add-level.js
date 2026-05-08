const Discord = require("discord.js")
const { ApplicationCommandOptionType } = require("discord.js")
module.exports = {
    name: `add-level`,
    description: `Añade a un niveles a un usuario del servidor`,
    category: "Utility",
    userPrems: [`Administrator`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: `nivel`,
            description: `Cantidad de nivel/es en número.`,
            type: ApplicationCommandOptionType.Number,
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
        const target = interaction.options.getUser("usuario")
        const value = interaction.options.getNumber("nivel")



        const embed = new Discord.EmbedBuilder()
        .setDescription(`Se le ha añadido ${value} a ${target}`)
        .setColor(client.embedColor)
        .setTimestamp(Date.now())

        interaction.editReply({embeds: [embed]}).then(
            setTimeout(async () => {
                interaction.delete()
        }, 10000))

    }
}