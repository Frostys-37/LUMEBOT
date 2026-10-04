const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const msg = require("../../utils/messages");
const { buildModLogEmbed, sendModLog } = require("../../utils/moderation");

module.exports = {
  name: "unban",
  category: "Staff",
  usage: "/unban <usuario>",
  description: "Desbanea a un usuario del servidor.",
  userPrems: ["BanMembers"],
  botPerms: ["BanMembers"],
  options: [
    { name: "usuario", description: "Proporciona la ID del usuario.", type: ApplicationCommandOptionType.User, required: true },
  ],

  run: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const target = interaction.options.getUser("usuario");

    const banInfo = await interaction.guild.bans.fetch(target.id).catch(() => null);
    if (!banInfo) return interaction.editReply({ content: msg.error("no_active_ban") });

    await interaction.guild.members.unban(target);

    const embed = buildModLogEmbed({
      client,
      interaction,
      actionTitle: "Usuario Desbaneado",
      emojiKey: "ban",
      target,
      source: "discord",
      extraFields: [{ name: "Nota:", value: "[ REGRESA DEL BAN ]" }],
      footerText: msg.success("unbanned"),
    });

    await interaction.editReply({ embeds: [embed] });
    await sendModLog(client, embed);
  },
};