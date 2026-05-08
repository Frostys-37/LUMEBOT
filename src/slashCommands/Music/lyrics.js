const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
  name: "lyrics",
  description: "Obten la letra de una canción.",
  userPrems: [],
  player: true,
  dj: false,
  inVoiceChannel: true,
  category: "Music",
  sameVoiceChannel: true,
  options: [
    {
      name: "song",
      description: "Retorna la letra de una canción.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription("🔎 **Buscando...**"),
      ],
    });

    let player;
    if (client.manager) {
      player = client.manager.players.get(interaction.guild.id);
    } else {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("Mi Lavalink fue desconectado :c\nReiniciando para reconectar..."),
        ],
      });
    }

    const args = interaction.options.getString("song");
    if (!args && !player) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("Esa canción no existe, o no esta sonando."),
        ],
      });
    }

    let search = args ? args : player.queue.current.title;
    // Lavalink api 
    let url = `https://api.darrennathanael.com/lyrics?song=${search}`;

    let lyrics = await fetch(url)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        return err.name;
      });
    if (!lyrics || lyrics.response !== 200 || lyrics === "FetchError") {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❌ | No encontre la letra de ${search}!\nAsegurate de lo que estas poniendo.`
            ),
        ],
      });
    }

    let text = lyrics.lyrics;
    let lyricsEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(`${lyrics.full_title}`)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setDescription(text);

    if (text.length > 4096) {
      text = text.substring(0, 4090) + "[...]";
      lyricsEmbed
        .setDescription(text)
        .setFooter({ text: "La letra es demasiado larga, mi maxico de caracteres son 4090." });
    }

    return interaction.editReply({ embeds: [lyricsEmbed] });
  },
};
