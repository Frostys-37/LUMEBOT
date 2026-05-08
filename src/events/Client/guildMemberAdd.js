const {
    CommandInteraction,
    InteractionType,
    PermissionFlagsBits,
    PermissionsBitField,
    EmbedBuilder,
    Message,
    GuildMember,
    DiscordAPIError,
    DiscordjsRangeError,
  } = require("discord.js");
  const Discord = require("discord.js")
  const LUMEBOT = require("../../structures/Client");
  const canvacord = require("canvacord")
  
  module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {LUMEBOT} client
     */
    run: async (client, member) => {

        console.log(member + " Se unió")
/*
         const wlcCard = await new naotori.WelcomeCard()
         .setBackground('https://preview.redd.it/067bl6fanut71.jpg?width=746&format=pjpg&auto=webp&s=8fdfe2ac989f7ba310b5e34495e34699f8ec9055')
         .setMemberIcon(member.user.displayAvatarURL({ extension: 'png', size: 4096 }))
         .setCircleColor('#FFFFFF')
         .setTitle(`Bienvenido(a) a LUMECRAFT`)
         .setDescription(`${member.user.tag}, ahora somos ${member.guild.memberCount} Usuarios!`)
         .setFont('ANIMATION')

        let card = await wlcCard.render()

        const attachment = new Discord.AttachmentBuilder(card, {name: 'bienvenida.png'})
        const embed = new Discord.EmbedBuilder()
        .setTitle(" | Nuevo Usuario en el Servidor!")
        .setDescription(`${member} Bienvenido a ${member.guild.name}`)
        .setImage('attachment://bienvenida.png')
        .setFooter({ text: "Bienvenida a usuario", iconURL: member.user.displayAvatarURL({dynamic: true})})
        .setTimestamp(Date.now())
        .setColor("Blurple")

        client.channels.cache.get("739130797407207525").send({ content: `${member}`, embeds: [embed], files: [attachment] })
        member.roles.add("742524571118207088")
    */
    }
}