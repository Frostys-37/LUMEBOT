const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
const emojis = require("../../emojis.json");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        if (message.author.bot || !message.guild) return;

        const DISCORD_INVITE_REGEX = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)\/[a-zA-Z0-9-]+/gi;

        if (DISCORD_INVITE_REGEX.test(message.content)) {
            if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

            await message.delete().catch(() => {});

            if (message.member.kickable) {
                await message.member.kick("Expulsado por AutoMod (invitaciones)").catch(() => {});
            }

            const logChannel = message.guild.channels.cache.get(client.config.autoModLogChannelId);
            if (logChannel) {
                logChannel.send({ 
                    content: `${emojis.warn} | ${message.author} ha sido expulsado por enviar un enlace de invitación de Discord.\n**Mensaje:** ${message.content}`, 
                }).catch(() => {});
            }
        }
    }
};