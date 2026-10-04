const LUMEBOT = require("./structures/Client");
const Discord = require("discord.js");
const client = new LUMEBOT();
const { customId, roles } = require("../src/utils/autoRoles");
const emojis = require("../src/emojis.json");

client.connect();

process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  let _commands;
  let editEmbed = new Discord.EmbedBuilder();

  if (interaction.customId === "helped") {
    if (interaction.values[0] === "config") {
      const commands = client.slashCommands
        .filter((cmd) => cmd.category && cmd.category === "Config")
        .map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
      editEmbed
        .setColor(client.embedColor)
        .setDescription(`${commands.join("\n")}`)
        .setTitle("Comandos de Configuración")
        .setFooter({ text: `HelpCommand.` });
      await interaction.update({ embeds: [editEmbed] });
    }

    if (interaction.values[0] === "info") {
      const commands = client.slashCommands
        .filter((cmd) => cmd.category && cmd.category === "Information")
        .map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
      editEmbed
        .setColor(client.embedColor)
        .setDescription(`${commands.join("\n")}`)
        .setTitle("Comandos de Información")
        .setFooter({ text: `HelpCommand.` });
      await interaction.update({ embeds: [editEmbed] });
    }
    if (interaction.values[0] === "mod") {
      const commands = client.slashCommands
        .filter((cmd) => cmd.category && cmd.category === "Moderation")
        .map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
      editEmbed
        .setColor(client.embedColor)
        .setDescription(`${commands.join("\n")}`)
        .setTitle("Comandos de Moderación")
        .setFooter({ text: `HelpCommand.` });
      await interaction.update({ embeds: [editEmbed] });
    }
    if (interaction.values[0] === "music") {
      const commands = client.slashCommands
        .filter((cmd) => cmd.category && cmd.category === "Music")
        .map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
      editEmbed
        .setColor(client.embedColor)
        .setDescription(`${commands.join("\n")}`)
        .setTitle("Comandos de Musica")
        .setFooter({ text: `HelpCommand.` });
      await interaction.update({ embeds: [editEmbed] });
    }
    if (interaction.values[0] === "plays") {
      const commands = client.slashCommands
        .filter((cmd) => cmd.category && cmd.category === "Playlist")
        .map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
      editEmbed
        .setColor(client.embedColor)
        .setDescription(`${commands.join("\n")}`)
        .setTitle("Comandos de Playlist")
        .setFooter({ text: `HelpCommand.` });
      await interaction.update({ embeds: [editEmbed] });
    }
    if (interaction.values[0] === "util") {
      const commands = client.slashCommands
        .filter((cmd) => cmd.category && cmd.category === "Utility")
        .map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
      editEmbed
        .setColor(client.embedColor)
        .setDescription(`${commands.join("\n")}`)
        .setTitle("Comandos de Utilidad")
        .setFooter({ text: `HelpCommand.` });
      await interaction.update({ embeds: [editEmbed] });
    }
  }

  if (interaction.isStringSelectMenu() && interaction.customId === customId) {
    await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });

    const member = interaction.member;
    const allowed = roles.map((r) => r.id);
    const selected = interaction.values.filter((id) => allowed.includes(id));

    const toAdd = selected.filter((id) => !member.roles.cache.has(id));
    const toRemove = allowed.filter(
      (id) => !selected.includes(id) && member.roles.cache.has(id),
    );

    try {
      if (toAdd.length) await member.roles.add(toAdd);
      if (toRemove.length) await member.roles.remove(toRemove);
    } catch (err) {
      client.logger.log(`[autorol] Error al actualizar roles: ${err}`, "error");
      return interaction.editReply("No pude actualizar tus roles. Avisa a mi desarrollador: @frosty_god.");
    }

    const lines = [
      ...toAdd.map((id) => `${emojis.success} Añadido: <@&${id}>`),
      ...toRemove.map((id) => `${emojis.error} Quitado: <@&${id}>`),
    ];
    return interaction.editReply(lines.length ? lines.join("\n") : "No hubo cambios.");
  }

});

client.once("clientReady", () => {
  const streamMonitor = require("./services/streamMonitor");
  const { iniciarMonitorDeServidores } = require("./services/serverMonitor/index");
  client.logger.log(`[streams] streamMonitor exporta: ${Object.keys(streamMonitor)}`, "event");
  streamMonitor.iniciarMonitorDeStreams(client);
  iniciarMonitorDeServidores(client);

});

module.exports = client;
