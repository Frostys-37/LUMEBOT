const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require('../../utils/convert.js')
const ms = require('ms');

module.exports = {
    name: "seek",
    category: "Music",
    description: "Busca la canción que se esta reproduciendo actualmente.",
    userPrems: [],
    player: true,
    dj: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "time",
            description: "<10s || 10m || 10h>",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });

        const args = interaction.options.getString("time");
        const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription("No hay música reproduciendo.");
            return await interaction.editReply({ embeds: [thing] });
        }

        const time = ms(args)
        const position = player.position;
        const duration = player.queue.current.duration;

        const emojiforward = client.emoji.forward;
        const emojirewind = client.emoji.rewind;

        const song = player.queue.current;

        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setDescription(`${emojiforward} **Adelanta**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setTimestamp()
                return await interaction.editReply({ embeds: [thing] });
            } else {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setDescription(`${emojirewind} **Atrás**\n[${song.title}](${song.uri})\n\`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setTimestamp()
                return await interaction.editReply({ embeds: [thing] });
            }
        } else {
            let thing = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`El argumento sobrepasa la duración de la música.\nSong duration: \`${convertTime(duration)}\``);
            return await interaction.editReply({ embeds: [thing] });
        }

    }
};
