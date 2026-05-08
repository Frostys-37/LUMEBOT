const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, CommandInteraction, ButtonStyle, Client, AttachmentBuilder } = require("discord.js");
const { profileImage } = require("discord-arts");

module.exports = {
    name: "profile",
    description: "Mira tu perfil en el servidor!.",
    category: "Information",
    owner: false,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const discordUser = interaction.options.getUser("user-option") || interaction.user.id;
        const bufferImg = await profileImage(discordUser);
        const imgAttachment = new AttachmentBuilder(bufferImg, { name: "profile.png" });
        
       await interaction.editReply({ files: [imgAttachment] });
 
    }
}