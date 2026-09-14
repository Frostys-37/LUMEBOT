const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const msg = require("../../utils/messages");
const { validateModerationTarget, buildModLogEmbed, sendModLog } = require("../../utils/moderation");

module.exports = {
  name: "kick",
  category: "Staff",
  usage: "/kick <usuario> <reason>",
  description: "Expulsa a un usuario del servidor.",
  userPrems: ["BanMembers"],
  botPerms: ["KickMembers"],
  options: [
    { name: "usuario", description: "Menciona a un usuario del servidor.", type: ApplicationCommandOptionType.User, required: true },
    { name: "reason", description: "Coloca una razón para banear al usuario.", type: ApplicationCommandOptionType.String, required: true },
  ],

  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const target = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("reason");
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.editReply({ content: msg.error("user_left_guild") });

    const error = validateModerationTarget(client, interaction, member);
    if (error) return interaction.editReply({ content: error });

    await member.kick(reason);

    const embed = buildModLogEmbed({
      client,
      interaction,
      actionTitle: "Usuario Expulsado",
      emojiKey: "kick",
      target,
      reason,
      footerText: msg.success("kicked"),
    });

    await interaction.editReply({ embeds: [embed] });
    await sendModLog(client, embed);
  },
};