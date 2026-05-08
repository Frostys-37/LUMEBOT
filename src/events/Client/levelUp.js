const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
let xp = require("simply-xp")

module.exports = {
    name: "levelUp",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    run: async (client, message, data) => {

       if(message.author.bot) return;
       if(!message.guild.id) return;

       const embed = new EmbedBuilder() 
       .setDescription(`Felicidades ${message.author}, has subido al nivel ${data.level}!`)
       .setColor(client.embedColor)
       .setTimestamp()

       message.reply({embeds: [embed]}).then(
        setTimeout(async () => {
            message.delete()
        }, 10000)
        )
    }
    }