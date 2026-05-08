const { ApplicationCommandOptionType } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require(`./../../emojis.json`)
const warningSchema = require("../../schema/warns")
module.exports = {
    name: `warns`,
    category: "Moderation",
    description: `Mira las advertencias del usuario.`,
    userPrems: [`BanMembers`],
    options: [
        {
            name: `usuario`,
            description: `Menciona a un usuario del servidor.`,
            type: ApplicationCommandOptionType.User,
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
          const target = interaction.options.getUser("usuario");
          const userTag = `${target.username}#${target.discriminator}`;

          warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {

            if(err) throw err;

            if(data) {
                
const embed1 = new Discord.EmbedBuilder()
.setTitle(`${emojis.warn} | Advertencias de Usuario`)
.addFields(
      { name: `${emojis.user} | Usuario:`, value: `${target}`},
      { name: `${emojis.moder} | Moderador:`, value: `${interaction.user}`}
          )
.setDescription(`${emojis.warns} | Lista de advertencias:\n${data.Content.map((w, i) => {`Warn num: ${i + 1}\nModerador: ${w.ExecuterTag}\nRazón: ${w.Reason}`})}`)
.setColor(client.embedColor)
.setTimestamp(Date.now())
.setFooter({ text: 'Advertencias de Usuario'}, client.user.avatarURL())

            interaction.editReply({embeds: [embed1]})

            } else {
               
                const nowarningSchema = new Discord.EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription("El usuario no cuenta con advertencias")
                .setFooter({ text: 'Usuario sin advertencias'}, client.user.avatarURL())
                .setTimestamp(Date.UTC())

                interaction.editReply({ embeds: [nowarningSchema], ephemeral: true})
            }
          })
        }
    }