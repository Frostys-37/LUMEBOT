const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  Role,
} = require("discord.js");
const LUMEBOT = require("../../structures/Client");
const db = require("../../schema/dj");

module.exports = {
  name: "adddj",
  description: "Sets the DJ role.",
  userPrems: ["ManageGuild"],
  category: "Config",
  options: [
    {
      name: "dj",
      description: "DJ rol.",
      required: true,
      type: ApplicationCommandOptionType.Role,
    },
  ],

  /**
   *
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    let data = await db.findOne({ Guild: interaction.guild.id });

    /**
     * @type {Role}
     */
    const role = interaction.options.getRole("dj");

    if (!data) {
      data = new db({
        Guild: interaction.guild.id,
        Roles: [role.id],
        Mode: true,
      });
      await data.save();
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Rol DJ agregado correctamente ${role.toString()}.`)
              .setColor(client.embedColor),
          ],
        })
        .catch((err) => console.error("Promise Rejected At", err));
    } else {
      let rolecheck = data.Roles.find((x) => x === role.id);
      if (rolecheck)
        return await interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`El rol ya existe en la lista.`)
                .setColor(client.embedColor),
            ],
          })
          .catch((err) => console.error("Promise Rejected At", err));
      data.Roles.push(role.id);
      await data.save();
      return await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Rol DJ añadido satisfactoriamente. ${role.toString()}.`
              )
              .setColor(client.embedColor),
          ],
        })
        .catch((err) => console.error("Promise Rejected At", err));
    }
  },
};
