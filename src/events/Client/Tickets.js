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
const discordTranscripts = require("discord-html-transcripts");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "ticket") {
      await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

      const name = `ticket-${interaction.user.username}`.toLowerCase().replace(/\s+/g, "-");
      
      const checkTickets = interaction.guild.channels.cache.find(
        (c) => c.name === name || c.topic === interaction.user.id
      );

      if (checkTickets) {
        return interaction.editReply({
          content: "Ya tienes un ticket abierto... Si no es así, contacta con un Administrador.",
          flags: [MessageFlags.Ephemeral],
        });
      }

      const staffOverwrites = (client.config.ticketStaffRoleIds || [])
        .filter((roleId) => interaction.guild.roles.cache.has(roleId))
        .map((roleId) => ({
          id: roleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        }));

      const permissionOverwrites = [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        ...staffOverwrites,
      ];

      try {
        const channel = await interaction.guild.channels.create({
          name: name,
          type: ChannelType.GuildText,
          parent: client.config.ticketOpenCategoryId || null,
          permissionOverwrites,
          topic: interaction.user.id,
        });

        await interaction.editReply({
          content: `Tu ticket se ha creado correctamente: <#${channel.id}>`,
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
            .setStyle(ButtonStyle.Danger)
        );

        const embedTicket = new EmbedBuilder()
          .setTitle("Soporte de Lumecraft | Tickets")
          .setTimestamp()
          .setDescription(
            `Bienvenido a tu ticket ${interaction.user}.\n\nEn cuanto te atienda alguien del Staff descríbenos tu problema o duda.`
          )
          .setColor(client.embedColor || "Blurple")
          .setFooter({
            text: "Sistema de Tickets",
            iconURL: client.user.avatarURL(),
          });

        await channel.send({ components: [botones], embeds: [embedTicket] });
      } catch (err) {
        console.error("Error al crear canal de ticket:", err);
        return interaction.editReply({
          content: "Ocurrió un error al intentar crear el canal del ticket. Revisa los permisos e IDs de roles configurados.",
          flags: [MessageFlags.Ephemeral],
        });
      }
    }

    if (["close", "reopen", "delete"].includes(interaction.customId)) {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({
          content: "No tienes permisos para realizar esta acción.",
          flags: [MessageFlags.Ephemeral],
        });
      }

      const ch = interaction.channel;
      if (!ch) return;

      if (interaction.customId === "close") {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const userId = ch.topic;
        const member = userId ? await client.users.fetch(userId).catch(() => null) : null;

        if (client.config.ticketClosedCategoryId) {
          await ch.setParent(client.config.ticketClosedCategoryId).catch(() => {});
        }

        if (member) {
          await ch.permissionOverwrites.edit(member.id, { ViewChannel: false }).catch(() => {});
          await ch.setName(`close-${member.username}`).catch(() => {});
        }

        return interaction.editReply({
          content: "Ticket cerrado con éxito.",
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (interaction.customId === "reopen") {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const userId = ch.topic;
        const member = userId ? await client.users.fetch(userId).catch(() => null) : null;

        if (client.config.ticketOpenCategoryId) {
          await ch.setParent(client.config.ticketOpenCategoryId).catch(() => {});
        }

        if (member) {
          await ch.setName(`reopen-${member.username}`).catch(() => {});
          await ch.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            SendMessages: true,
          }).catch(() => {});
        }

        return interaction.editReply({
          content: "Ticket reabierto con éxito.",
          flags: [MessageFlags.Ephemeral],
        });
      }

      if (interaction.customId === "delete") {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const userId = ch.topic;
        const member = userId ? await client.users.fetch(userId).catch(() => null) : null;
        const nombreArchivo = member ? member.username : "usuario-desconocido";

        try {
          const attachment = await discordTranscripts.createTranscript(ch, {
            returnType: "attachment",
            fileName: `Transcript-${nombreArchivo}.html`,
            minify: true,
            saveImages: true,
            useCDN: true,
          });

          const canalTranscripts = await client.channels
            .fetch(client.config.ticketTranscriptChannelId)
            .catch(() => null);

          if (canalTranscripts) {
            await canalTranscripts.send({ files: [attachment] });
          } else {
            console.warn(
              "[Tickets] No se pudo enviar el transcript: TICKET_TRANSCRIPT_CHANNEL_ID inválido."
            );
          }
        } catch (err) {
          console.error("Error al generar el transcript:", err);
        }

        await ch.delete().catch(() => {});
      }
    }
  },
};