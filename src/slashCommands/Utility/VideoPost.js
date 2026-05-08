const { ApplicationCommandOptionType, ButtonStyle } = require(`discord.js`)
const Discord = require(`discord.js`)
const emojis = require("./../../emojis.json")
module.exports = {
    name: "video",
    description: `Manda tu contenido al servidor.`,
    userPrems: [`SendMessages`],
    category: "Utility",
    options: [
        {
            name: "enlace",
            description: `Coloca tu contenido, Tik Tok, YouTube, Twitch, etc, todo lo que tenga que ver con Lumecraft.`,
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

          const link = interaction.options.getString("enlace")
          if(!link) return interaction.editReply({content: "Necesito el enlace.", ephemeral: true})

          const embed = new Discord.EmbedBuilder()
          .setTitle("<:youtube:889898858518290523> | Contenido de Usuario")
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true}) })
          .addFields(
            { name: `${emojis.user} | Usuario:`, value: `${interaction.user}` },
            { name: `<:links:992879858042552360> | Enlace`, value: `${link}` },
          )
          .setFooter({ text: "Sistema de Videos", iconURL: interaction.user.displayAvatarURL({dynamic: true})})
          .setTimestamp()
          .setColor(client.embedColor)

          const btnaccept = new Discord.ButtonBuilder()
          .setCustomId("succes")
          .setLabel('Aceptado')
          .setStyle(ButtonStyle.Success)
          .setEmoji("855695983094267904")

          const btndenied = new Discord.ButtonBuilder()
          .setCustomId("denied")
          .setLabel('Denegado')
          .setStyle(ButtonStyle.Danger)
          .setEmoji("855703357238935592")

          const row = new Discord.ActionRowBuilder()
          .addComponents(btnaccept)
          .addComponents(btndenied);

                const li = new Discord.ActionRowBuilder()
                .addComponents(new Discord.ButtonBuilder()
                .setURL(link)
                .setLabel('Ve al vídeo!')
                .setStyle(ButtonStyle.Link));

                client.channels.cache.get("865406316889636864").send({embeds: [embed], components: [row]})

                    let ids = [
                        "535945446087065621",//ale
                        "857874928534814720",//tama
                        "793926625765883955",//Yo god
                        "536007600362356737",//Ana
                        "348371654939901953",//Richi
                        "756763855379628102"//Cobra
                    ]
                    
                    const filter = i => ["succes", "denied"].some((x) => i.customId === x) && ids.includes(i.user.id)
             
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 86400000 });
             
                    collector.on('collect', async i => {
                        if (i.customId === 'succes') {
                          i.reply({ content: "Vídeo aceptado!", ephemeral: true})
                          client.channels.cache.get("866062547819429908").send({content: "<@&904539915520475137>", embeds: [embed], components: [li] });
                          await interaction.update({ embeds: [embed], components: [] })
                    
                        }

                        if (i.customId === "denied") {
                            i.edit({components: []})
                        }
                    })
                }
            }