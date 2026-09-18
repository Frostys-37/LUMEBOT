const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const warningSchema = require("../../schema/warns");
const msg = require("../../utils/messages");
const { buildModLogEmbed } = require("../../utils/moderation");

module.exports = {
  name: "warn",
  category: "Staff",
  description: "Advierte a un usuario en el servidor.",
  usage: "/warn <usuario> <razón>",
  userPrems: ["BanMembers"],
  options: [
    { name: "usuario", description: "Menciona a un usuario del servidor.", type: ApplicationCommandOptionType.User, required: true },
    { name: "razón", description: "Razón de la advertencia.", type: ApplicationCommandOptionType.String, required: true },
  ],

  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const guildId = interaction.guildId;
    const target = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razón");

    try {
      let data = await warningSchema.findOne({ GuildID: guildId, UserID: target.id });

      const warnContent = {
        ExecuterId: interaction.user.id,
        ExecuterTag: interaction.user.tag,
        Reason: reason,
        Timestamp: Date.now(),
      };

      if (!data) {
        data = new warningSchema({ GuildID: guildId, UserID: target.id, UserTag: target.username, Content: [warnContent] });
      } else {
        data.Content.push(warnContent);
      }

      await data.save();
    } catch (err) {
      console.error(err);
      return interaction.editReply({ content: msg.error("db_save_error") });
    }

    const embed = buildModLogEmbed({
      client,
      interaction,
      actionTitle: "Advertencia a Usuario",
      emojiKey: "warn",
      target,
      source: "discord",
      reason,
      footerText: msg.success("warned"),
    });

    await interaction.editReply({ embeds: [embed] });
    target.send({ content: `Has sido advertido en: **${interaction.guild.name}**`, embeds: [embed] }).catch(() => {});
  },
};