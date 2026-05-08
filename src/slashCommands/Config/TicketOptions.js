const { ApplicationCommandOptionType, CommandInteraction, ButtonStyle } = require("discord.js")
const Discord = require("discord.js")
const ms = require("ms")
const emojis = require("./../../emojis.json")
module.exports = {
    name: "opciones",
    category: "Config",
    description: "...",
    userPrems: ["ManageMessages"],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: true
          });

           const embed = new Discord.EmbedBuilder()
           .setTitle("Menú de Opciones")
           .setDescription("Presiona el botón correspondiente a la acción a realizar.\n\n*Si el ticket es innecesario, eliminalo.*")
           .setColor(client.embedColor)
           .setTimestamp()

           const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("close")
                    .setLabel('Cierra el Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("855695983094267904")
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("reopen")
                    .setLabel('Reabre el Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("855703357238935592")
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("delete")
                    .setLabel("Elimina el Ticket")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("852097379070771211")
                )

                await interaction.reply({embeds: [embed], components: [row], ephemeral: true})

        }
    }