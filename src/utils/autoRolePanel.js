const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { customId, roles } = require("./autoRoles");
const emojis = require("../emojis.json");

function buildAutoRolePanel() {
  const ids = roles.map((r) => r.id);
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
    throw new Error(`[autorol] IDs de rol faltantes o repetidos en autoRoles.js: ${JSON.stringify(ids)}`);
  }
}

function buildAutoRolePanel() {
  const embed = new EmbedBuilder()
    .setTitle(`${emojis.bot} Panel de AutoRoles`)
    .setDescription(
      "Selecciona en el menú los roles que quieras tener.\n" +
        "Para quitarte uno, desmárcalo y cierra el menú.",
    )
    .setColor("Blurple");

  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder("Selecciona tus roles...")
    .setMinValues(0) 
    .setMaxValues(roles.length)
    .addOptions(
      roles.map((r) => ({
        label: r.label,
        description: r.description,
        value: r.id,
        emoji: r.emoji,
      })),
    );

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(menu)],
  };
}

module.exports = { buildAutoRolePanel };