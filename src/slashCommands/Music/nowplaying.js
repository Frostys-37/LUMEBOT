const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js')

module.exports = {
    name: "nowplaying",
    description: "Muestra la canción que esta sonando ahora mismo.",
    userPrems: [],
    player: true,
    inVoiceChannel: false,
    category: "Music",
    sameVoiceChannel: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
          ephemeral: false
        });
         const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription("No esta sonando nada.");
            return interaction.editReply({embeds: [thing]});
        }

        const song = player.queue.current
        const emojimusic = client.emoji.music;
        var total = song.duration;
        var current = player.position;

        let embed = new EmbedBuilder()
            .setDescription(`${emojimusic} **Reproduciendo:**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration)}]\`- [${song.requester}] \n\n\`${progressbar(player)}\``)
            .setThumbnail(song.displayThumbnail("3"))
            .setColor(client.embedColor)
            .addFields([
                {name: '\u200b', value: `\`${convertTime(current)} / ${convertTime(total)}\``},
            ])
         return interaction.editReply({embeds: [embed]})
            
    }
};
