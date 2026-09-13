const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
  PermissionsBitField,
} = require("discord.js");
const Discord = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId == `ticket`) {
      await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

      let name = `ticket-${interaction.user.username}`;
      let checkTickets = interaction.guild.channels.cache.find(
        (c) => c.name == name.split(" ").join("-").toLocaleLowerCase(),
      );

      if (checkTickets) {
        return interaction.editReply({
          content:
            "Ya tienes un ticket abierto... Si no es así, contacta con mi Developer.",
          flags: [MessageFlags.Ephemeral],
        });
      }

      function getChannelName(user) {
        const user1 = `${user.username}`;
      }

      function hasTicket(g, interaction) {
        let channelName = getChannelName(interaction.user);
        let ticket = g.channels.cache.find((ch) => ch.name == channelName);
      }

      interaction.editReply({
        content: "Tu ticket está en procesamiento, espera un momento...",
        flags: [MessageFlags.Ephemeral],
      });

      if (hasTicket(interaction.guild, interaction)) return;

      await interaction.guild.channels
        .create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          parent: "808447258609057823",
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: "740295855726133328",
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
            {
              id: "740295965055123516",
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
          ],
          topic: `${interaction.user.id}`,
        })
        .then(async (channel) => {
          channel = channel;

          await interaction.editReply({
            content: `Tu ticket se ha creado, <#${channel.id}>`,
            flags: [MessageFlags.Ephemeral],
          });

          const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("close")
              .setLabel("Cerrar Ticket")
              .setEmoji("🔒")
              .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
              .setCustomId("reopen")
              .setLabel("Reabrir Ticket")
              .setEmoji("🔓")
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setCustomId("delete")
              .setLabel("Borrar Ticket")
              .setEmoji("⛔")
              .setStyle(ButtonStyle.Danger),
          );

          const embedTicket = new Discord.EmbedBuilder()
            .setTitle("Soporte de Lumecraft | Tickets")
            .setTimestamp()
            .setDescription(
              `Bienvenido a tu ticket ${interaction.user}.\n\nEn tanto te atiende alguien del Staff describenos tu problema o duda.`,
            )
            .setColor(client.embedColor)
            .setFooter({
              text: "Sistema de Tickets",
              iconURL: client.user.avatarURL(),
            });

          channel.send({ components: [botones], embeds: [embedTicket] });
        });
    }

    if (["close", "reopen", "delete"].includes(interaction.customId)) {
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
      ) {
        return interaction.reply({
          content: "No tienes permisos.",
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (interaction.customId == "close") {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        let ch = interaction.channel;
        if (!ch) return;

        const member = await client.users.fetch(ch.topic);
        await interaction.channel.setParent("847664236158517288");

        await ch.permissionOverwrites.edit(member.id, { ViewChannel: false });

        await ch.setName(`close-${member.username}`);
        interaction.editReply({
          content: "Ticket Cerrado",
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (interaction.customId == "reopen") {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        let ch = interaction.channel;
        if (!ch) return;

        const member = await client.users.fetch(ch.topic);
        interaction.channel.setParent("808447258609057823");

        await ch.setName(`reopen-${member.username}`);
        await ch.permissionOverwrites.edit(interaction.user.id, {
          ViewChannel: true,
          SendMessages: true,
        });
        interaction.editReply({
          content: "Ticket reabierto",
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (interaction.customId == "delete") {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        let ch = interaction.channel;
        if (!ch) return;

        const member = await client.users.fetch(ch.topic);
        const attachment = await discordTranscripts.createTranscript(ch, {
          returnType: "attachment",
          fileName: `Transcript-${member.username}.html`,
          minify: true,
          saveImages: true,
          useCDN: true,
        });

        client.channels.fetch("1074860381467578499")
          .then((channel) => {
            channel.send({ files: [attachment] });
          });

          interaction.channel.delete();

      }
    }
  },
};
