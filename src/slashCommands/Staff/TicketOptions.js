const { ApplicationCommandOptionType, CommandInteraction, ButtonStyle, MessageFlags } = require("discord.js")
const Discord = require("discord.js")
const ms = require("ms")
const emojis = require("../../emojis.json")
module.exports = {
    name: "options",
    category: "Staff",
    usage: "/options",
    description: "...",
    userPrems: ["ManageMessages"],
  
    /**
     *
     * @param {LUMEBOT} client
     * @param {CommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
          });

           const embed = new Discord.EmbedBuilder()
           .setTitle("Menú de Opciones")
           .setDescription("Presiona el botón correspondiente a la acción a realizar.\n\n*Si el ticket es innecesario, eliminalo.*")
           .setColor(client.embedColor)
           .setTimestamp()

          const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("close")
              .setLabel("Cerrar Ticket")
              .setEmoji("🔒")
              .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
              .setCustomId("reopen")
              .setLabel("Reabrir Ticket")
              .setEmoji("🔓")
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setCustomId("delete")
              .setLabel("Borrar Ticket")
              .setEmoji("⛔")
              .setStyle(ButtonStyle.Danger),
          );

            await interaction.reply({embeds: [embed], components: [botones], flags: [MessageFlags.Ephemeral]})

        }
    }