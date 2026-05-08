const { ApplicationCommandOptionType, CommandInteraction } = require("discord.js")
const Discord = require("discord.js")
const ms = require("ms")
const emojis = require("./../../emojis.json")
module.exports = {
    name: "temp-role",
    description: "Añade un rol a un usuario temporalmente.",
    userPrems: ["ManageMembers"],
    category: "Config",
    options: [
        {
            name: "usuario",
            description: "Menciona a un usuario del servidor.",
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: "rol",
            description: "Elije el rol que deseas colocar.",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "tiempo",
            description: "Coloca el tiempo que durará el usuario con el rol.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
          });

        const target = interaction.options.getMember("usuario");
        const role = interaction.options.getRole("rol");
        const temp = interaction.options.getString("tiempo");

        const banembed = new Discord.EmbedBuilder()
        .setTitle(`${emojis.rol} | Rol Agregado a Usuario`)
        .addFields(
            { name: `${emojis.user} | Usuario:`, value:`${target} | ${target.id}`},
            { name: `${emojis.moder} | Moderador:`, value:`[${interaction.member.roles.highest}] ${interaction.user} | ${interaction.user.id}`},
            { name: `${emojis.reloj} | Tiempo de estadia:`, value:`${temp}`},
            { name: `${emojis.rol} | Rol:`, value:`${role}`},
            { name: `${emojis.channel} | Comando ejecutado en:`, value:`${interaction.channel.name}`}
        )
        .setColor(client.embedColor)
        .setTimestamp(Date.now())
        .setFooter({ text: 'Rol Agregado a Usuario'}, client.user.avatarURL())

        target.roles.add(role)
        interaction.editReply({embeds: [banembed]})

        setTimeout(async () => {
            await target.roles.remove(role)
            client.channels.cache.get("1074861661665636352").send({content: `El rol ${role} ha sido retirado del usuario ${target} ya que su tiempo ha terminado`})
            target.send({content: `El rol ${role} ha sido retirado del usuario ${target} ya que su tiempo ha terminado.\n\nTiempo: ${temp},\nAñadido por: ${interaction.user.tag}`})
        }, ms(temp))
        }
    }
