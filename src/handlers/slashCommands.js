const { readdirSync } = require("fs");
const { PermissionsBitField, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

module.exports = (client) => {
  const data = [];
  let count = 0;
  readdirSync("./src/slashCommands/").forEach((dir) => {
    const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

    for (const file of slashCommandFile) {
      const slashCommand = require(`../slashCommands/${dir}/${file}`);

      if (!slashCommand.name)
        return console.error(
          `slashCommandNameError: el nombre del comando es obligatorio.`
        );

      if (!slashCommand.description)
        return console.error(
          `slashCommandDescriptionError: ${
            slashCommand.split(".")[0]
          } descripcion es obligatoria.`
        );

      client.slashCommands.set(slashCommand.name, slashCommand);

      data.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_member_permissions: slashCommand.default_member_permissions
          ? PermissionsBitField.resolve(
              slashCommand.default_member_permissions
            ).toString()
          : null,
      });
      count++;
    }
  });
  client.logger.log(`SlashCommands cargados (/): ${count}`, "cmd");
  const rest = new REST({ version: "10" }).setToken(client.config.token);
  (async () => {
    try {

      const servidores = ["738909505861058580", "793492909189365761"]
      
      for (const servidor of servidores) {
        await rest.put(Routes.applicationGuildCommands(client.config.clientID, servidor), {
          body: data,
        });
      }
      client.logger.log(
        "SlashCommands actualizados (/).",
        "cmd"
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
