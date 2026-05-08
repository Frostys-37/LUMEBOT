const { ApplicationCommandOptionType, CommandInteraction, ButtonStyle } = require("discord.js")
const Discord = require("discord.js")
const ms = require("ms")
const emojis = require("./../../emojis.json")
module.exports = {
    name: "ticket",
    category: "Config",
    description: "...",
    userPrems: ["Administrator"],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
          });

          const embed = new Discord.EmbedBuilder()
          .setTitle("Sistema de Tickets | Lumecraft")
          .setDescription("Presiona el botón para abrir un ticket, donde el staff correspondiente te atenderá")
          .setFooter({ text: "Sistema de Tickets", iconURL: client.user.avatarURL() })
          .setTimestamp()
          .setColor(client.embedColor)

          const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("ticket")
            .setLabel('Tickets')
            .setStyle(ButtonStyle.Primary)
            .setEmoji("804025152316243968")
          )

          await interaction.editReply({ embeds: [embed], components: [row] });

        }
    }