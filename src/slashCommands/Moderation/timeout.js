const { ApplicationCommandOptionType, PermissionFlagsBits } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require("./../../emojis.json")
const ms = require("ms")
module.exports = {
    name: `mute`,
    category: "Moderation",
    description: `Silencia a un usuario en el servidor.`,
    userPrems: [`ManageMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: "tiempo",
            description: "Menciona el tiempo a mutear al usuario",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: `razón`,
            description: `Coloca una razón para mutear al usuario.`,
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

           const user = interaction.options.getMember("usuario");
           const tiempo = interaction.options.getString("tiempo");
           const convertedTime = ms(tiempo);
           const reason = interaction.options.getString("razón");
           const member = await interaction.guild.members.fetch(user.id);

           const embed = new Discord.EmbedBuilder()
           .setTitle(`${emojis.timeout} | Usuario Silenciado`)
           .addFields(
            { name: `${emojis.user} | Usuario:`, value:`${user} | ${user.id}`},
            { name: `${emojis.moder} | Moderador:`, value:`[${interaction.member.roles.highest}] ${interaction.user.tag} | ${interaction.user.id}`},
            { name: `${emojis.razon} | Razón:`, value:`${reason}`},
            { name: `${emojis.reloj} | Tiempo:`, value: `${tiempo}`},
            { name: `${emojis.channel} | Comando ejecutado en:`, value:`${interaction.channel.name}`})
           .setColor(client.embedColor)
           .setTimestamp(Date.now())
           .setFooter({ text: 'Usuario Expulsado del Servidor'}, client.user.avatarURL())

           if (member.roles.highest.position >= interaction.member.roles.highest.position)
           return interaction.reply({ content: "El usuario tiene un rol mas alto que el tuyo.", ephemeral: true }); 

           if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
           return interaction.reply({ content: "No tengo permisos para moderar el servidor.", ephemeral: true });

           try {
           await member.timeout(convertedTime, reason);

           await interaction.editReply({ embeds: [embed], ephemeral: false })
           client.channels.cache.get('1074861661665636352').send({ embeds: [embed] })

       } catch (err) {
           console.log(err);
       }
        }
    }