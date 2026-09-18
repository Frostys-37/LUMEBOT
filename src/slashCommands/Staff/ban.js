const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const msg = require("../../utils/messages");
const { validateModerationTarget, buildModLogEmbed, sendModLog } = require("../../utils/moderation");

module.exports = {
  name: "ban",
  description: "Banea a un usuario del servidor.",
  category: "Staff",
  usage: "/ban <usuario> <reason>",
  userPrems: ["BanMembers"],
  botPerms: ["BanMembers"],
  options: [
    { name: "usuario", description: "Menciona a un usuario del servidor.", type: ApplicationCommandOptionType.User, required: true },
    { name: "reason", description: "Coloca una razón para banear al usuario.", type: ApplicationCommandOptionType.String, required: true },
  ],

  /**
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const target = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("reason");
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (member) {
      const error = validateModerationTarget(client, interaction, member);
      if (error) return interaction.editReply({ content: error });
    } else if (target.id === client.config.ownerID) {
      return interaction.editReply({ content: msg.error("protected_user") });
    }

    await interaction.guild.members.ban(target, { reason });

    const embed = buildModLogEmbed({
      client,
      interaction,
      actionTitle: "Usuario Baneado",
      emojiKey: "ban",
      target,
      reason,
      source: "discord",
      footerText: msg.success("banned"),
    });

    await interaction.editReply({ embeds: [embed] });
    await sendModLog(client, embed);
  },
};