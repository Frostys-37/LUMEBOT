const { CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");
const Discord = require("discord.js");
const emojis = require("./../../emojis.json");
module.exports = {
    name: "contra",
    description: "¿Quieres restablecer la contraseña de tu usuario?.",
    usage: "/contra",
    category: "Utility",
  
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
      await interaction.deferReply();

            const embedStaff = new Discord.EmbedBuilder()
            .setTitle(`Datos para cambiar tu contraseña`)
            .setFields(
                { name: `${emojis.user} | Para que podamos reiniciarte la contraseña necesitamos que nos proporciones los siguientes datos::`, value: `1. Nickname\n2. Modalidad en la que juegas.\n3. Hace cuanto no te contectas.\n4. Pais de procedencia.\n5. Ciudad/Provincia/Estado` },
            )
            .setColor(client.embedColor)
            .setTimestamp()
            .setFooter({ text: "Cambia tu contraseña", iconURL: client.user.avatarURL() })

            interaction.editReply({embeds: [embedStaff]})
    
  },
};
