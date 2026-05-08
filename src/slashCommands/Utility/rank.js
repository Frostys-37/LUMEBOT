
const Discord = require("discord.js")
const { ApplicationCommandOptionType } = require("discord.js")
const canvacord = require('canvacord');
const db = require('megadb');
const rankl = new db.crearDB("rankground")
let xp = require('simply-xp');
module.exports = {
    name: `rank`,
    description: `Mira tu rango en el servidor.`,
    userPrems: [`SendMessages`],
    category: "Utility",
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor si deseas ver su rank.`,
            type: ApplicationCommandOptionType.User,
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
            ephemeral: false
          });

        const target = interaction.options.getUser("usuario") || interaction.user;
        let av = await rankl.obtener(`${interaction.guildId}.${target.id}`)
        if(!av) av = "https://media.discordapp.net/attachments/959908409069682728/964935064725110804/unknown.png";

        xp.rank(interaction, target.id, interaction.guild.id, {
            background: av,
            color: "#5000C4"
        }).then((img) => {
            interaction.editReply({files: [img] })
        })
    }
}