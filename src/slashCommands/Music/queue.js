const { Client, CommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const load = require("lodash");
const { convertTime } = require('../../utils/convert.js');

module.exports = {
    name: "queue",
    description: "Mira las canciones de la cola y la que suena.",
    category: "Music",
    options: [
        {
            name: "page",
            type: ApplicationCommandOptionType.Number,
            required: false,
            description: `La pagina de la cola, por número.`
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply().catch(() => {});
      
        const player = interaction.client.manager.get(interaction.guildId);
         if (!player.queue.current)
      return interaction.editReply({
        content: `Por favor, utiliza /play antes de usar este comando.`,
      });
       
    if(!player) return await interaction.editReply({
            content: `No esta sonando nada ahora mismo.`
        }).catch(() => {});

        if(!player.queue) return await interaction.editReply({
            content: `No esta sonando nada ahora mismo.`
        }).catch(() => {});
        
        if(!player.queue.size || player.queue.size === 0) {

            const embed = new EmbedBuilder().setColor(client.embedColor).setDescription(`Sonando ahora: [${player.queue.current.title}](${player.queue.current.uri}) • \`[ ${convertTime(player.position)} / ${convertTime(player.queue.current.duration)} ]\` • [${player.queue.current.requester}]`);

            await interaction.editReply({
                embeds: [embed]
            })
        } else {
            const mapping = player.queue.map((t, i) => `\` ${++i} \` • ${t.title}  • \`[ ${convertTime(t.duration)} ]\` • [${t.requester}]`);

            const chunk = load.chunk(mapping, 10);
            const pages = chunk.map((s) => s.join("\n"));
            let page = interaction.options.getNumber("page");
            if(!page) page = 0;
            if(page) page = page -1;
            if(page > pages.length) page = 0;
            if(page < 0) page = 0;

            if(player.queue.size < 10 || player.queue.totalSize < 10) {

                const embed2 = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} Lista del servidor`)
                .setColor(client.embedColor)
                .setDescription(`**Sonando ahora:**\n[${player.queue.current.title}](${player.queue.current.uri}) • \`[ ${convertTime(player.position)} / ${convertTime(player.queue.current.duration)} ]\` • [${player.queue.current.requester}]\n\n**Canciones en cola**\n${pages[page]}`)
                .setFooter({text: `Pagina ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }),})
                .setThumbnail(player.queue.current.thumbnail)
                .setTimestamp()

                await interaction.editReply({
                    embeds: [embed2]
                }).catch(() => {});
            } else {
                const embed3 = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} Lista del servidor`)
                .setColor(client.embedColor)
                .setDescription(`**Sonando ahora**\n[${player.queue.current.title}](${player.queue.current.uri}) • \`[ ${convertTime(player.position)} / ${convertTime(player.queue.current.duration)} ]\` • [${player.queue.current.requester}]\n\n**Canciones en cola**\n${pages[page]}`)
                .setFooter({text: `Pagina ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }),})
                .setThumbnail(player.queue.current.thumbnail)
                .setTimestamp()

                const but1 = new ButtonBuilder().setCustomId("queue_cmd_but_1_app").setEmoji({ name: "⏭️" }).setStyle(ButtonStyle.Primary)

                const dedbut1 = new ButtonBuilder().setDisabled(true).setCustomId("queue_cmd_ded_but_1_app").setEmoji("⏭️").setStyle(ButtonStyle.Primary)

                const but2 = new ButtonBuilder().setCustomId("queue_cmd_but_2_app").setEmoji({ name: "⏮️" }).setStyle(ButtonStyle.Primary)

                const dedbut2 = new ButtonBuilder().setDisabled(true).setCustomId("queue_cmd_ded_but_2_app").setEmoji({ name: "⏮️" }).setStyle(ButtonStyle.Primary)

                const but3 = new ButtonBuilder().setCustomId("queue_cmd_but_3_app").setEmoji({ name: "⏹️" }).setStyle(ButtonStyle.Danger)

                const dedbut3 = new ButtonBuilder().setDisabled(true).setCustomId("queue_cmd_ded_but_3_app").setEmoji({ name: "⏹️" }).setStyle(ButtonStyle.Primary)

                await interaction.editReply({
                    embeds: [embed3],
                    components: [new ActionRowBuilder().addComponents([
                        but2, but3, but1
                    ])]
                }).catch(() => {});

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (b) => {
                        if(b.user.id === interaction.user.id) return true;
                        else return b.reply({
                            content: `Solo **${interaction.user.tag}** puede usar los botones, utiliza el comando tu.`
                        }).catch(() => {});
                    },
                    time: 60000*5,
                    idle: 30e3
                });

                collector.on("collect", async (button) => {
                    if(button.customId === "queue_cmd_but_1_app") {

                        await button.deferUpdate().catch(() => {});
                        page = page + 1 < pages.length ? ++page : 0;

                        const embed4 = new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**Sonando ahora**\n[${player.queue.current.title}](${player.queue.current.uri}) • \`[ ${convertTime(player.position)} / ${convertTime(player.queue.current.duration)} ]\` • [${player.queue.current.requester}]\n\n**Canciones en cola**\n${pages[page]}`)
                        .setFooter({text: `Pagina ${page + 1}/${pages.length}`, iconURL: button.user.displayAvatarURL({ dynamic: true })})
                        .setThumbnail(player.queue.current.thumbnail)
                        .setTimestamp()

                        await interaction.editReply({
                            embeds: [embed4],
                            components: [new ActionRowBuilder().addComponents([
                                but2, but3, but1
                            ])]
                        })

                    } else if(button.customId === "queue_cmd_but_2_app") {

                        await button.deferUpdate().catch(() => {});
                        page = page > 0 ? --page : pages.length - 1;

                        const embed5 = new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**Sonando ahora**\n[${player.queue.current.title}](${player.queue.current.uri}) • \`[ ${convertTime(player.position)} / ${convertTime(player.queue.current.duration)} ]\` • [${player.queue.current.requester}]\n\n**Canciones en cola**\n${pages[page]}`)
                        .setFooter({text: `Pagina ${page + 1}/${pages.length}`, iconURL: button.user.displayAvatarURL({ dynamic: true })})
                        .setThumbnail(player.queue.current.thumbnail)
                        .setTimestamp()

                        await interaction.editReply({
                            embeds: [embed5],
                            components: [new ActionRowBuilder().addComponents([
                                but2, but3, but1
                            ])]
                        }).catch(() => {});

                    } else if(button.customId === "queue_cmd_but_3_app") {

                        await button.deferUpdate().catch(() => {});
                        await collector.stop();

                    } else return;
                });

                collector.on("end", async () => {
                    await interaction.editReply({
                        embeds: [embed3],
                        components: [new ActionRowBuilder().addComponents([
                            dedbut2, dedbut3, dedbut1
                        ])]
                    });
                })
            }
        }
    }
}
