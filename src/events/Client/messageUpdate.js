const { Message, messageLink } = require("discord.js");
const Discord = require("discord.js")
const emojis = require("../../emojis.json")
module.exports = {
    name: "messageUpdate",
    /**
     *
     * @param {LUMEBOT} client
     * @param {Message} oldMessage
     * @param {Message} newMessage
     */
    run: async (client, oldMessage, newMessage) => {
        if(!oldMessage.guild) return;
        if(oldMessage.author.bot) return;
            const embed = new Discord.EmbedBuilder()
            .setTitle("Mensaje Editado")
            .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL({dynamic: true})})
            .setColor(client.embedColor)
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${newMessage.author.tag}` },                
                { name: `${emojis.channel} | Canal:`, value: `${newMessage.channel}` },
                { name: "<:Message_Deleted:852097378894479360> | Mensaje Antiguo:", value: `${oldMessage.content}`},
                { name: "<:Message_Update:852097378852143114> | Mensaje Nuevo:", value: `${newMessage.content}` }
            )
            .setFooter({ text: "Mensaje Editado", iconURL: client.user.displayAvatarURL() })
            .setTimestamp()

           await newMessage.guild.channels.cache.get("1074859650769494077").send({ embeds: [embed]})

    }
}