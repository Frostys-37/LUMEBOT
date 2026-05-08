const Discord = require("discord.js")
const { ApplicationCommandOptionType } = require("discord.js")
let xp = require("simply-xp")
module.exports = {
    name: `lb`,
    description: `Mira la tabla de clasificación del servidor.`,
    userPrems: [`SendMessages`],
    category: "Utility",
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
          });
       
        const target = interaction.user;

        await xp.leaderboard(client, interaction.guild.id).then(board => {
            let lead = []
            
            board.forEach(user => {
                lead.push(`⁂ ${user.tag} - Xp: ${user.shortxp}`)
            })

        const embed = new Discord.EmbedBuilder()
        .setTitle("Tabla de clasificación de Lumecraft")
        .setDescription(`**Tabla**:\n\n${lead.toString().replaceAll(',','\n')}`)
        .setColor(client.embedColor)
        .setTimestamp(Date.now())

        interaction.editReply({embeds: [embed]})
    })
    }
}