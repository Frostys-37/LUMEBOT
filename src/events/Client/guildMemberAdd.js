const { GuildMember } = require("discord.js");
const Discord = require("discord.js");
const LUMEBOT = require("../../structures/Client");
const emoji = require("../../emojis.json");
const Canvas = require("canvas");
const path = require("path");
const { generateWelcomeGif } = require("../../utils/welcomeImage");

const fontpath = path.join(__dirname, "../../assets/fonts/Roboto-Bold.ttf");
Canvas.registerFont(fontpath, { family: "RobotoCustom" });

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {LUMEBOT} client
   * @param {GuildMember} member
   */
  run: async (client, member) => {
    try {
      if (member.user.username.includes("loygameplays")) {
        await member.ban({
          reason: "Usuario baneado por pertenecer a blacklist de usuarios.",
        });
        client.channels.cache
          .get("765010962347851807")
          .send(
            `El usuario ${member.user.tag} ha intentado entrar al servidor.`,
          );
        return;
      }
    } catch (error) {
      console.error("Error al banear al usuario:", error);
    }

    console.log(member + " Se unió");

    await member.roles.add("1556093760901873664").catch((error) => {
      console.error("Error al asignar rol de bienvenida:", error);
    });

    const embed_servidor = new Discord.EmbedBuilder()
      .setTitle(` ${emoji.user} | Nuevo Usuario en el Servidor!`)
      .setDescription(
        `Bienvenido a ${member.guild.name}\n\n¡Pasate por los canales de reglas y anuncios para enterarte de todo lo que pasa en el servidor!`,
      )
      .setFooter({
        text: "Nuevo Usuario",
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor("Blurple");

    const embed_md = new Discord.EmbedBuilder()
      .setTitle(` ${emoji.user} | Bienvenido a ${member.guild.name}!`)
      .setDescription(
        `¡Hola ${member}, bienvenido a ${member.guild.name}! Estamos encantados de tenerte aquí.\nAsegúrate de revisar los canales de reglas y anuncios para mantenerte al tanto de todo lo que sucede en el servidor.\nSi tienes alguna duda no dudes en abrir un ticket (sigue las especificaciones para los tickets) o en consultar con alguien del Staff`,
      )
      .setFooter({
        text: "mc.lumecraft.net",
        iconURL: member.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp(Date.now())
      .setColor("Blurple");

      let files = [];

    try {
        const buffer = await generateWelcomeGif(member);
        files = [new Discord.AttachmentBuilder(buffer, { name: "bienvenida.gif" })];
        embed_servidor.setImage("attachment://bienvenida.gif");
        embed_md.setImage("attachment://bienvenida.gif");
    } catch (error) {
        console.error("Error al generar el GIF de bienvenida:", error);
    }

    const channel = client.channels.cache.get(client.config.welcomeChannelId)
    channel?.send({
        content: `${member}`,
        embeds: [embed_servidor],
        files: files,
      });
    member.user.send({ embeds: [embed_md], files: files }).catch((error) => {
        console.error("Error al enviar el mensaje privado:", error);
    });
  },
};
