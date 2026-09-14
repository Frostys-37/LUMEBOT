const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const ms = require("ms");
const msg = require("../../utils/messages");
const { validateModerationTarget, buildModLogEmbed, sendModLog } = require("../../utils/moderation");

module.exports = {
  name: "mute",
  category: "Staff",
  usage: "/mute <usuario> <tiempo> <razón>",
  description: "Silencia a un usuario en el servidor.",
  userPrems: ["ModerateMembers"],
  botPerms: ["ModerateMembers"],
  options: [
    { name: "usuario", description: "Menciona a un usuario del servidor.", type: ApplicationCommandOptionType.User, required: true },
    { name: "tiempo", description: "Menciona el tiempo a mutear al usuario", type: ApplicationCommandOptionType.String, required: true },
    { name: "razón", description: "Coloca una razón para mutear al usuario.", type: ApplicationCommandOptionType.String, required: true },
  ],

  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const tiempo = interaction.options.getString("tiempo");
    const reason = interaction.options.getString("razón");
    const convertedTime = ms(tiempo);

    if (!convertedTime || convertedTime < 10_000 || convertedTime > 2_419_200_000) {
      return interaction.editReply({ content: msg.error("invalid_duration", { min: "10 segundos", max: "28 días" }) });
    }

    const member = await interaction.guild.members.fetch(interaction.options.getUser("usuario").id).catch(() => null);
    if (!member) return interaction.editReply({ content: msg.error("user_left_guild") });

    const error = validateModerationTarget(client, interaction, member);
    if (error) return interaction.editReply({ content: error });

    try {
      await member.timeout(convertedTime, reason);

      const embed = buildModLogEmbed({
        client,
        interaction,
        actionTitle: "Usuario Silenciado",
        emojiKey: "timeout",
        target: member.user,
        reason,
        extraFields: [{ name: "Tiempo:", value: tiempo }],
        footerText: msg.success("muted"),
      });

      await interaction.editReply({ embeds: [embed] });
      await sendModLog(client, embed);
    } catch (err) {
      console.error(err);
      await interaction.editReply({ content: msg.error("unknown_command_error") });
    }
  },
};