const {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const { SearchResult, Track } = require("erela.js");
const LUMEBOT = require("../../structures/Client");
const db = require("../../schema/prefix.js");
const db2 = require("../../schema/dj");
const db3 = require("../../schema/setup");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    
    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: interaction.guildId });
    if (ress && ress.Prefix) prefix = ress.Prefix;

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      switch (interaction.commandName) {
        case "play":
          /**
           * @type {import("discord.js").AutocompleteFocusedOption}
           */
          const focused = interaction.options.getFocused(true);

          if (focused.name === "input") {
            if (focused.value === "") return;
            /**
             * @type {SearchResult}
             */
            const result = await client.manager.search(
              focused.value,
              interaction.user
            );

            if (result.loadType === "TRACK_LOADED" || "SEARCH_RESULT") {
              /**
               * @type {Track[]}
               */
              const sliced = result.tracks.slice(0, 5).sort();

              if (
                focused.value.match(
                  /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|episode|show|album)[\/:]([A-Za-z0-9]+)/ ||
                    /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|album|playlist)\/(\d+)/ ||
                    /(?:https:\/\/music\.apple\.com\/)(?:\w{2}\/)?(track|album|playlist)/g ||
                    /(http(s|):\/\/music\.apple\.com\/..\/.....\/.*\/([0-9]){1,})\?i=([0-9]){1,}/gim ||
                    /(?:https?:\/\/)?(?:www.|web.|m.)?(facebook|fb).(com|watch)\/(?:video.php\?v=\d+|(\S+)|photo.php\?v=\d+|\?v=\d+)|\S+\/videos\/((\S+)\/(\d+)|(\d+))\/?/g
                )
              ) {
                await interaction.respond(
                  sliced.map((track) => ({
                    name: track.title,
                    value: focused.value,
                  }))
                );
                return;
              } else {
                await interaction.respond(
                  sliced.map((track) => ({
                    name: track.title,
                    value: track.uri,
                  }))
                );
              }
            } else if (result.loadType === "LOAD_FAILED" || "NO_MATCHES")
              return;
          }
          break;
      }
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const embed = new EmbedBuilder().setColor("Red");

      if (command.botPerms) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPerms || [])
          )
        ) {
          embed.setDescription(
            `No tengo los permisos: **\`${
              command.botPerms
            }\`** en ${interaction.channel.toString()} para ejecutar este comando: **\`${
              command.name
            }\`**`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.userPerms) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || [])
          )
        ) {
          embed.setDescription(
            `Tu no tienes los permisos: **\`${
              command.userPerms
            }\`** en ${interaction.channel.toString()} para ejecutar este comando: **\`${
              command.name
            }\`**.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      const player = interaction.client.manager.get(interaction.guildId);
      if (command.player && !player) {
        if (interaction.replied) {
          return await interaction
            .editReply({
              content: `No hay ningún usuario en este servidor.`,
              ephemeral: true,
            })
            .catch(() => {});
        } else {
          return await interaction
            .reply({
              content: `No hay ningún usuario en este servidor.`,
              ephemeral: true,
            })
            .catch(() => {});
        }
      }
      if (command.inVoiceChannel && !interaction.member.voice.channel) {
        if (interaction.replied) {
          return await interaction
            .editReply({
              content: `Debes estar en un canal de voz.`,
              ephemeral: true,
            })
            .catch(() => {});
        } else {
          return await interaction
            .reply({
              content: `Debes estar en un canal de voz.`,
              ephemeral: true,
            })
            .catch(() => {});
        }
      }
      if (command.sameVoiceChannel) {
        if (interaction.guild.members.me.voice.channel) {
          if (
            interaction.member.voice.channel !==
            interaction.guild.members.me.voice.channel
          ) {
            return await interaction
              .reply({
                content: `Debes estar en: ${interaction.guild.members.me.voice.channel.toString()} para usar este comando.`,
                ephemeral: true,
              })
              .catch(() => {});
          }
        }
      }
      if (command.dj) {
        let data = await db2.findOne({ Guild: interaction.guildId });
        let perm = PermissionFlagsBits.MuteMembers;
        if (data) {
          if (data.Mode) {
            let pass = false;
            if (data.Roles.length > 0) {
              interaction.member.roles.cache.forEach((x) => {
                let role = data.Roles.find((r) => r === x.id);
                if (role) pass = true;
              });
            }
            if (!pass && !interaction.member.permissions.has(perm))
              return await interaction.reply({
                content: `No tienes permiso para utilizar este comando, o el rol dj`,
                ephemeral: true,
              });
          }
        }
      }

      try {
        await command.run(client, interaction, prefix);
      } catch (error) {
        if (interaction.replied) {
          await interaction
            .editReply({
              content: `A ocurrido un error desconocido.`,
            })
            .catch(() => {});
        } else {
          await interaction
            .reply({
              ephemeral: true,
              content: `A ocurrido un error desconocido.`,
            })
            .catch(() => {});
        }
        console.error(error);
      }
    }

    if (interaction.isButton()) {
      let data = await db3.findOne({ Guild: interaction.guildId });
      if (
        data &&
        interaction.channelId === data.Channel &&
        interaction.message.id === data.Message
      )
        return client.emit("playerButtons", interaction, data);
    }
  },
};