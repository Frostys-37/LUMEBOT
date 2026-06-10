const { ApplicationCommandOptionType, CommandInteraction, ButtonStyle, MessageFlags } = require("discord.js")
const Discord = require("discord.js")
const ms = require("ms")
const config = require("../../config.js")
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
        console.log("Color cargado", config.embedColor)

          const embed = new Discord.EmbedBuilder()
          .setTitle(emojis.channel + " | Sistema de Tickets - Lumecraft")
          .setDescription("Presiona el botón para abrir un ticket, donde el staff te atenderá directamente.")
          .setFooter({ text: "Sistema de Tickets | mc.lumecraft.net", iconURL: client.user.avatarURL() })
          .setTimestamp()
          .setColor(config.embedColor);

          const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("ticket")
            .setLabel('Tickets')
            .setStyle(ButtonStyle.Primary)
            .setEmoji("804025152316243968")
          );

          await interaction.deferReply({content: "Sistema de Tickets cargado.", flags: [MessageFlags.Ephemeral]})
          await client.channels.cache.get("742521948558589983").send({ embeds: [embed], components: [row] }).catch((error) => {
            console.error(error);
          });

        }
    }