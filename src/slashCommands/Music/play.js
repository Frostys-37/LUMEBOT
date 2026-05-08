const {
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const LUMEBOT = require("../../structures/Client");
const { convertTime } = require("../../utils/convert.js");
module.exports = {
  name: "play",
  description: "Escucha musica de varias fuentes.",
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  category: "Music",
  options: [
    {
      name: "input",
      description: "Nombre de la canción o URL, puedes usar links spotify.",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
    },
  ],

  /**
   * @param {LUMEBOT} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.resolve(["Speak", "Connect"])
      )
    )
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `No tengo permisos para ejecutar este comando, necesito: \`CONNECT\` o \`SPEAK\`.`
            ),
        ],
      });
    const { channel } = interaction.member.voice;
    if (
      !interaction.guild.members.cache
        .get(client.user.id)
        .permissionsIn(channel)
        .has(PermissionsBitField.resolve(["Speak", "Connect"]))
    )
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `No tengo permisos para conectarme al canal de voz, necesito: \`CONNECT\` o \`SPEAK\`.`
            ),
        ],
      });

    const { playlist } = client.emoji;
    let search = interaction.options.getString("input");
    let res;
    const rejEmbed = new EmbedBuilder()
      .setAuthor({ name: `Reanudando Playlist` })
      .setColor(client.embedColor)
      .setDescription(
        `Reanudando...`
      );

    /**
     * @type {Player}
     */
    let player = client.manager.get(interaction.guild.id);

    if (!player)
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: true,
        volume: 80,
      });

    if (player.state != "CONNECTED") await player.connect();

    try {
      res = await player.search(search, interaction.member.user);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setTimestamp()
              .setDescription(`❌ | **Ha ocurrido un error al buscar...**`),
          ],
        });
      }
    } catch (err) {
      console.log(err);
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setTimestamp()
              .setDescription("❌ | **No encontre nada relacionado a eso...**"),
          ],
        });
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        const trackload = new EmbedBuilder()
          .setColor(client.embedColor)
          .setTimestamp()
          .setDescription(
            `${playlist} **Canción añadida a la cola** [${res.tracks[0].title}](${
              res.tracks[0].uri ?? search
            }) - \`[${convertTime(res.tracks[0].duration)}]\``
          );
        return await interaction.editReply({ embeds: [trackload] });
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        const playlistloadds = new EmbedBuilder()
          .setColor(client.embedColor)
          .setTimestamp()
          .setDescription(
            `${playlist} **Playlist añadida a la cola** [${
              res.playlist.name
            }](${search}) - \`[${convertTime(res.playlist.duration)}]\``
          );

        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          await player.play();

        return await interaction.editReply({ embeds: [playlistloadds] });
      case "SEARCH_RESULT":
        const track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.length) {
          const searchresult = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(
              track.displayThumbnail("3") ??
                (await client.manager.getMetaThumbnail(res.tracks[0].uri))
            )
            .setDescription(
              `${playlist} **Canción añadida a la cola** [${track.title}](${
                track.uri ?? search
              }) - \`[${convertTime(track.duration)}]\``
            );

          player.play();
          return await interaction.editReply({ embeds: [searchresult] });
        } else {
          const thing = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
            .setThumbnail(
              track.displayThumbnail("3") ??
                (await client.manager.getMetaThumbnail(res.tracks[0].uri))
            )

            .setDescription(
              `${playlist} **Canción añadida a la cola** [${track.title}](${
                track.uri ?? search
              }) - \`[${convertTime(track.duration)}]\``
            );

          return await interaction.editReply({ embeds: [thing] });
        }
    }
  },
};
