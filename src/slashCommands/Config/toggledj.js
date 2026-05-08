const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "toggledj",
  description: "Elige el modo DJ.",
  userPrems: ["ManageGuild"],
  category: "Config",
  owner: false,

  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });

    if (!data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`No tienes ningún rol DJ en este servidor.`)
            .setColor(client.embedColor),
        ],
      });

    let mode = false;
    if (!data.Mode) mode = true;
    data.Mode = mode;
    await data.save();
    if (mode) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Modo DJ habilitado.`)
            .setColor(client.embedColor),
        ],
      });
    } else {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Modo DJ deshabilitado.`)
            .setColor(client.embedColor),
        ],
      });
    }
  },
};
