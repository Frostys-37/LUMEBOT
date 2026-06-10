const {
  CommandInteraction,
  InteractionType,
  PermissionsBitField,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");
const LUMEBOT = require("../../structures/Client");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        const command = client.slashCommands.get(interaction.commandName);
        if (command && command.autocomplete) {
            try {
                await command.autocomplete(client, interaction);
            } catch (error) {
                console.error("Error en Autocomplete:", error);
            }
        }
        return; 
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      
      if (!command) return console.log(`Comando no encontrado: ${interaction.commandName}`);

      const embed = new EmbedBuilder().setColor("Red");

      if (command.botPerms) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
          embed.setDescription(`No tengo los permisos: **\`${command.botPerms}\`** para ejecutar: **\`${command.name}\`**`);
          return interaction.reply({ embeds: [embed] });
        }
      }

      const userPermissions = command.userPrems || command.userPerms;
      if (userPermissions) {
        if (!interaction.member.permissions.has(PermissionsBitField.resolve(userPermissions || []))) {
          embed.setDescription(`No tienes los permisos: **\`${userPermissions}\`** para ejecutar este comando.`);
          return interaction.reply({ embeds: [embed] });
        }
      }
      
      try {
        await command.run(client, interaction);
      } catch (error) {
        console.error("Error al ejecutar comando:", error);
        const errorMsg = { content: `Ha ocurrido un error desconocido al ejecutar el comando.`, flags: [MessageFlags.Ephemeral] };
        interaction.replied || interaction.deferred ? await interaction.editReply(errorMsg) : await interaction.reply(errorMsg);
      }
    }

    }
  }
