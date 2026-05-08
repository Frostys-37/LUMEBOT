const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js")
const { AuditLogEvent } = require("discord.js")
const emojis = require("../../emojis.json")
module.exports = {
    name: "messageDelete",
    /**
     *
     * @param {LUMEBOT} client
     * @param {Message} message
     */
    run: async (client, message) => {
        if(!message.guild) return;
        if(message.author.bot) return;

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 5,
            type: AuditLogEvent.MessageDelete
        })

        const deleteionLog = fetchedLogs.entries.first();
        if(!deleteionLog) return console.log(`Un mensaje de ${message.author.tag} ha sido eliminado, pero no encontré nada relevante.`)

        const { executor, target } = deleteionLog;

        if(message.author.id === executor.id) return;

        const mensaje = message.content;
        if(mensaje === `https://cdn.discordapp.com/attachments/${message.channel.id}/${message.id}/`) mensaje = "CONTENIDO IMAGEN";

        if(target.id === message.author.id) {

            const embed = new Discord.EmbedBuilder()
            .setTitle("Mensaje Eliminado")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setColor(client.embedColor)
            .setDescription(
                `<:Message_Deleted:852097378894479360> | Mensaje Eliminado: ${mensaje || message.attachments.first().proxyURL}`
            )
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${message.author.tag}` },                
                { name: `${emojis.channel} | Canal:`, value: `${message.channel}` },
                { name: `${emojis.moder} | Moderador:`, value: `${executor.tag}` }
            )
            .setFooter({ text: "Mensaje Eliminado", iconURL: client.user.displayAvatarURL() })
            .setTimestamp()

            const imag = message.attachments.first();
            if(imag) { 
            embed.setImage(imag.url)
            } 
           await message.guild.channels.cache.get("1074859650769494077").send({ embeds: [embed] })

        } else {

            const embed2 = new Discord.EmbedBuilder()
            .setTitle("Mensaje Eliminado")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setColor(client.embedColor)
            .addFields(
                { name: `${emojis.user} | Usuario:`, value: `${message.author.tag}` },
                { name: `<:Message_Deleted:852097378894479360> | Mensaje Eliminado:`, value: `${mensaje}` },
                { name: `${emojis.channel} | Canal:`, value: `${message.channel}` },
            )
            .setFooter({ text: "Mensaje Eliminado", iconURL: client.user.displayAvatarURL() })
            .setTimestamp()

            const imag = message.attachments.first();
            if(imag) { 
                embed.setImage(imag.url)
                } 

           await message.guild.channels.cache.get("1074859650769494077").send({ embeds: [embed2] })

        }
    }
}