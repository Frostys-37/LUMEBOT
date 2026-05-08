const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "filters",
    description: "Establece un filtro para escuchar.",
    userPrems: [],
    player: true,
    dj: true,
    inVoiceChannel: true,
    category: "Music",
    sameVoiceChannel: true,
    options: [
        {
            name: "filter",
            description: "Selecciona tu filtro preferido.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Clear",
                    value: "clear"
                },
                {
                    name: "Bass",
                    value: "bass",
                },
                {
                    name: "Nightcore",
                    value: "night"
                },
                {
                    name: "Picth",
                    value: "picth"
                },
                {
                    name: "Distort",
                    value: "distort"
                },
                {
                    name: "Equalizer",
                    value: "eq"
                },
                {
                    name: "8D",
                    value: "8d (audifonos necesarios)"
                },
                {
                    name: "Bass Boost",
                    value: "bassboost"
                },
                {
                    name: "Speed",
                    value: "speed"
                },
                {
                    name: "Vaporwave",
                    value: "vapo"
                }
            ]
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const filter = interaction.options.getString("filter");

        const player = interaction.client.manager.get(interaction.guildId);
        if (!player.queue.current) {
            const thing = new EmbedBuilder()
                .setDescription('No hay nada sonando.')
                .setColor(client.embedColor)
            return interaction.editReply({ embeds: [thing] });
        }
        const emojiequalizer = client.emoji.filter;

        let thing = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTimestamp()
        switch (filter) {

            case 'bass':
                player.setBassboost(true);
                thing.setDescription(`${emojiequalizer} Bass ON`);
                break;
            case 'eq':
                player.setEqualizer(true);
                thing.setDescription(`${emojiequalizer} Trablebass ON`);
                break;
            case 'bassboost':
                var bands = new Array(7).fill(null).map((_, i) => (
                    { band: i, gain: 0.25 }
                ));
                player.setEQ(...bands);
                thing.setDescription(`${emojiequalizer} Bass Boost ON`);
                break;
            case 'night':
                player.setNightcore(true);
                thing.setDescription(`${emojiequalizer} Nightcore Equalizer ON`);
                break;
            case 'pitch':
                player.setPitch(2);
                thing.setDescription(`${emojiequalizer} Pitch Equalizer ON`);
                break;
            case 'distort':
                player.setDistortion(true);
                thing.setDescription(`${emojiequalizer} Distort Equalizer ON`);
                break;
            case 'vapo':
                player.setVaporwave(true);
                thing.setDescription(`${emojiequalizer} Vaporwave Equalizer ON`);
                break;
            case 'clear':
                player.clearEffects();
                thing.setDescription(`${emojiequalizer} Equalizer OFF`);
                break;
            case 'speed':
                player.setSpeed(2);
                thing.setDescription(`${emojiequalizer} Speed ON`);
                break;
            case '8d':
                player.set8D(true);
                thing.setDescription(`${emojiequalizer} 8D ON`);
        }
        return interaction.editReply({ embeds: [thing] });
    }
};
