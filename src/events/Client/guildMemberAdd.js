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
  const emoji = require("../../emojis.json");
  const Canvas = require("canvas");
  const path = require("path");

        const fontpath = path.join(__dirname, "../../assets/fonts/Roboto-Bold.ttf");
        Canvas.registerFont(fontpath, { family: "RobotoCustom" });
  
  module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {LUMEBOT} client
     * @param {GuildMember} member
     */
    run: async (client, member) => {

        console.log(member + " Se unió")

        const canvas = Canvas.createCanvas(922, 450);
        const ctx = canvas.getContext("2d");

        const backpath = path.join(__dirname, "../../assets/welcome_l.png");
        const background = await Canvas.loadImage(backpath).catch((error) => {
            console.error("Error al cargar la imagen de fondo:", error);
        });

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png", size: 512 })).catch((error) => {
            console.error("Error al cargar el avatar del usuario:", error);
        });

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.save()
		ctx.beginPath()
		ctx.arc(461, 154, 116, 0, Math.PI * 2, true)
		ctx.closePath()
		ctx.clip()
		ctx.drawImage(avatar, 345, 38, 232, 232)
        ctx.restore()
        
        ctx.beginPath()
        ctx.arc(461, 154, 116, 0, Math.PI * 2, true)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 10
        ctx.stroke();
        ctx.closePath()

        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

		ctx.font = "50px RobotoCustom"
		ctx.fillText(`¡Bienvenido (a)`, 461, 324)

		ctx.font = "30px RobotoCustom"
		ctx.fillText(`${member.user.tag}`, 461, 360)

		ctx.font = "30px RobotoCustom"
		ctx.fillText(`a Lumecraft!`, 461, 392)

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const attach = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "bienvenida.png" });

        const embed_servidor = new Discord.EmbedBuilder()
        .setTitle(` ${emoji.user} | Nuevo Usuario en el Servidor!`)
        .setDescription(`Bienvenido a ${member.guild.name}\n\n¡Pasate por los canales de reglas y anuncios para enterarte de todo lo que pasa en el servidor!`)
        .setImage('attachment://bienvenida.png')
        .setFooter({ text: "Nuevo Usuario", iconURL: member.user.displayAvatarURL({dynamic: true})})
        .setTimestamp(Date.now())
        .setColor("Blurple")

        const embed_md = new Discord.EmbedBuilder()
        .setTitle(` ${emoji.user} | Bienvenido a ${member.guild.name}!`)
        .setDescription(`¡Hola ${member}, bienvenido a ${member.guild.name}! Estamos encantados de tenerte aquí.\nAsegúrate de revisar los canales de reglas y anuncios para mantenerte al tanto de todo lo que sucede en el servidor.\nSi tienes alguna duda no dudes en abrir un ticket (sigue las especificaciones para los tickets) o en consultar con alguien del Staff`)
        .setImage('attachment://bienvenida.png')
        .setFooter({ text: "mc.lumecraft.net", iconURL: member.guild.iconURL({dynamic: true})})
        .setTimestamp(Date.now())
        .setColor("Blurple")

        client.channels.cache.get("959908411376566312").send({ content: `${member}`, embeds: [embed_servidor], files: [attach] })
        member.user.send({ embeds: [embed_md] })
        await member.roles.add("742524571118207088")
    } 
}