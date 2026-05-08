const { ApplicationCommandOptionType } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require(`./../../emojis.json`)
const warningSchema = require("../../schema/warns")
module.exports = {
    name: `warn`,
    category: "Moderation",
    description: `Advierte a un usuario en el servidor..`,
    userPrems: [`BanMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
            required: true

        },
        {
            name: "razón",
            description: `Razón de la advertencia.`,
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

          const guildId = interaction.guildId;
          const user = interaction.user;

          const target = interaction.options.getUser("usuario");
          const reason = interaction.options.getString("razón");
          const userTag = `${target.username}#${target.discriminator}`;

          warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag, Reason: reason}, async (err, data) => {

            if(err) throw err;

            if(!data) {
                data = new warningSchema({
                    GuildID: guildId,
                    UserID: target.id,
                    UserTag: userTag,
                    Content: [{
                        ExecuterId: user.id,
                        ExecuterTag: user.tag,
                        Reason: reason
                    }],
                });
            } else {
                const WarnContent = {
                    ExecuterId: user.id, 
                    ExecuterTag: user.tag,
                    Reason: reason
                }

                data.Content.push(WarnContent);
            }
            data.save();
          })

          const embed = new Discord.EmbedBuilder()
          .setTitle(`${emojis.warn} | Advertencia a Usuario`)
          .addFields(
              { name: `${emojis.user} | Usuario:`, value:`${target} | ${target.id}`},
              { name: `${emojis.moder} | Moderador:`, value:`**[${interaction.member.roles.highest}]** ${interaction.user} | ${interaction.user.id}`},
              { name: `${emojis.razon} | Razón:`, value:`${reason}`},
              { name: `${emojis.channel} | Comando ejecutado en:`, value:`${interaction.channel.name}`}
          )
          .setColor(client.embedColor)
          .setTimestamp(Date.now())
          .setFooter({ text: 'Usuario Advertido'}, client.user.avatarURL())

          interaction.editReply({embeds: [embed], ephemeral: false})

          target.send({embeds: [embed]})
        }
    }