const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js")
const emojis = require("../../emojis.json")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    run: async (client, message) => {

        if (message.author.bot) return;
        if(!message.guild) return;
        
        const DISCORD_INVITE_REGEX = /(https)*(http)*:*(\/\/)*discord(.gg|app.com\/invite)\/[a-zA-Z0-9]{1,}/i;

        const spamWarnings = new Set();
        const textInNoTextWarnings = new Set();

        if(DISCORD_INVITE_REGEX.test(message.content)) {
            if(message.member.permissions.has("ManageMessages")) return;
            message.delete()
            message.guild.members.kick(message.author.id, {reason: "Expulsado por AutoMod (invitaciones)"})
        }
    }
}