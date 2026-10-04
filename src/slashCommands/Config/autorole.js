const { CommandInteraction, MessageFlags } = require("discord.js")
const { buildAutoRolePanel } = require("../../utils/autoRolePanel");

module.exports = {
    name: "autorol",
    category: "Config",
    description: "...",
    userPrems: ["Administrator"],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        
        await interaction.channel.send(buildAutoRolePanel());
        await interaction.reply({ content: "Panel enviado.", flags: MessageFlags.Ephemeral });
        
    }
}