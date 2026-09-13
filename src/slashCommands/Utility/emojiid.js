const { CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");
const Discord = require("discord.js");
module.exports = {
    name: "emoji",
    description: "Obten la info de un emoji.",
    usage: "/emoji <name>",
    category: "Utility",

  options: [
      {
        name: "name",
        description: "Nombre del ID a obtener",
        type: ApplicationCommandOptionType.String,
      }
  ],
  
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
      await interaction.deferReply({
        ephemeral: true
      });

      const emojiName = interaction.options.getString('name');
      const emoji = client.emojis.cache.find(emoji => emoji.name === emojiName);
      await interaction.editReply(`\`\`\`${emoji}\`\`\``);
  },
};
