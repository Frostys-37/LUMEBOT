const { EmbedBuilder, Message, Client, PermissionsBitField, ChannelType, DiscordAPIError, ButtonStyle } = require("discord.js");
const Discord = require("discord.js")

module.exports = {
    name: "interactionCreate",
  /**
   *
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */
    run: async (client, interaction) => {
        if(!interaction.isButton()) return;
        await interaction.deferReply({
            ephemeral: false
          });

       if(interaction.customId == `ticket`) {
         let name = `ticket-${interaction.user.username}`;
         let checkTickets = interaction.guild.channels.cache.find(c => c.name == name.split(' ').join('-').toLocaleLowerCase());
         if(checkTickets) {
            return interaction.editReply({content: "Ya tienes un ticket abierto... Si no es así, contacta con mi Developer.", ephemeral: true})
         }

         function getChannelName(user) {
            const user1 = `${user.username}`
           }
    
           function hasTicket(g, interaction) {
            let channelName = getChannelName(interaction.user);
            let ticket = g.channels.cache.find((ch) => ch.name == channelName);
           }
    
           interaction.editReply({ content: "Tu ticket está en procesamiento, espera un momento...", ephemeral: true})
           
           if(hasTicket(interaction.guild, interaction)) return;
    
           interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`, 
            type: ChannelType.GuildText,
            permissionOverwrites: [{
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: "793493539043541045",
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
            },
            {
                id: "795047383662067784",
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
            },
            {
                id: "793492909189365761",
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.member.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
            }], parent: "808447258609057823", topic: `${interaction.member.id}`}).then(async channel => {
                channel = channel
                await interaction.editReply({content: `Tu ticket se ha creado, <#${channel.id}>`, ephemeral: true})
    
                const embedTicket = new Discord.EmbedBuilder()
                .setTitle("Lumecraft Support")
                .setTimestamp()
                .setDescription(`Bienvenido a tu ticket ${interaction.user}, en tanto te atiende alguien del Staff describenos tu problema o duda.`)
                .setColor(client.embedColor)
                .setFooter({ text: "Sistema de Tickets", iconURL: client.user.avatarURL()})
    
                channel.send({ content: `Bienvenido <@!${interaction.member.user.id}>`,  embeds: [embedTicket]})
            })

       }

        if(interaction.customId == 'close') {
            if(!interaction.member.permissions.has("ManageMessages")) return interaction.editReply({ content: "No tienes permisos para ejecutar usar este botón.", ephemeral: true })
    
            let ch = interaction.channel;
            if(!ch) return;
    
            const member = await client.users.fetch(ch.topic)
            interaction.channel.setParent("847664236158517288")
    
            ch.permissionOverwrites.edit(member.id, { ViewChannel: false })
    
            ch.setName(`close-${member.tag}`)
            interaction.editReply({content: "Ticket Cerrado", ephemeral: true})
        }
    
        if(interaction.customId == 'reopen') {
            if(!interaction.member.permissions.has("ManageMessages")) return interaction.editReply({ content: "No tienes permisos para ejecutar usar este botón.", ephemeral: true })
    
            let ch = interaction.channel;
            if(!ch) return;
    
            const member = client.users.cache.get(ch.topic)
            ch.setName(`reopen-${member.tag}`)
            ch.permissionOverwrites.edit(member.id, { ViewChannel: true, SendMessages: true })
            interaction.editReply({content: "Ticket reabierto", ephemeral: true})
            interaction.channel.setParent("808447258609057823")
    
        }
    
        if(interaction.customId == 'delete') {
            if(!interaction.member.permissions.has("ManageMessages")) return interaction.editReply({ content: "No tienes permisos para ejecutar usar este botón.", ephemeral: true })
    
            interaction.channel.delete()
    
            const discordTranscripts = require("discord-html-transcripts")
            let ch = interaction.channel;
            if(!ch) return;
    
            const member = client.users.cache.get(ch.topic)
            const attachment = await discordTranscripts.createTranscript(ch, {
                returnType: 'attachment',
                fileName: `Transcript-${member.tag}.html`,
                minify: true,
                saveImages: true,
                useCDN: true
            })
    
            client.channels.cache.get("1074860381467578499").send({files: [attachment]})
        }
    }
}