const { EmbedBuilder, CommandInteraction } = require("discord.js");
const LUMEBOT = require("../../structures/Client");
const db = require("../../schema/dj");

module.exports = {
  name: "removedj",
  description: "Remueve el rol Dj.",
  userPrems: ["ManageGuild"],
  category: "Config",
  owner: false,

  /**
   *
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });
    if (data) {
      await data.delete();
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Todos los rol DJ revomidos actualmente.`)
              .setColor(client.embedColor),
          ],
        })
        .catch((err) => console.error("Promise Rejected At", err));
    } else
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `No tienes ningún rol agregado, usa /setup`
              )
              .setColor(client.embedColor),
          ],
        })
        .catch((err) => console.error("Promise Rejected At", err));
  },
};