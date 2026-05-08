const { EmbedBuilder, Client, ButtonInteraction } = require("discord.js");
const { convertTime } = require("../../utils/convert");
const { buttonReply } = require("../../utils/functions");

module.exports = {
    name: "playerButtons",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {*} data 
     */

    run: async (client, interaction, data) => {
        
        if (!interaction.replied) await interaction.deferReply().catch(() => { });
        const color = client.embedColor;
        if (!interaction.member.voice.channel) return await buttonReply(interaction, `No estás conectado en un canal de voz para usar los botones.`, color);
        if (interaction.guild.members.cache.get(client.user.id).voice.channel && interaction.guild.members.cache.get(client.user.id).voice.channelId !== interaction.member.voice.channelId) return await buttonReply(interaction, `Necesitas conectarte a: ${interaction.guild.me.voice.channel} para usar este botón.`, color);
        const player = interaction.client.manager.get(interaction.guildId);
        
        if(!player) return await buttonReply(interaction, `No está sonando nada ahora mismo.`, color);
        if(!player.queue) return await buttonReply(interaction, `No está sonando nada ahora mismo.`, color);
        if(!player.queue.current) return await buttonReply(interaction, `No está sonando nada ahora mismo.`, color);
        if(player && player.state !== "CONNECTED") {
            player.destroy();
            return await buttonReply(interaction, `No está sonando nada ahora mismo.`, color);
        };
        const { title, uri, duration, requester } = player.queue.current;

        let message;
        try {

            message = await interaction.channel.messages.fetch(data.Message, { cache: true });

        } catch (e) { };

        let icon = player.queue.current.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg` : client.config.links.img;


        let nowplaying = new EmbedBuilder().setColor(color).setDescription(`[${title}](${uri}) • \`[${convertTime(duration)}]\``).setImage(icon).setFooter({ text: `Pedido hecho por: ${requester.username}`, iconURL: requester.displayAvatarURL({ dynamic: true }) });

        if (interaction.customId === `pause_but_${interaction.guildId}`) {
            if (player.paused) {
                player.pause(false);

                await buttonReply(interaction, `[${title}](${uri}) Ahora esta reanudada.`, color);

                if (message) await message.edit({
                    embeds: [nowplaying]
                }).catch(() => { });
            } else {
                player.pause(true);

                await buttonReply(interaction, `[${title}](${uri}) está pausada.`,color);

                if (message) await message.edit({
                    embeds: [nowplaying]
                }).catch(() => { });
            };
        } else if (interaction.customId === `previous_but_${interaction.guildId}`) {
            if (!player) return await buttonReply(interaction, `Proceso cancelado debido a que el usuario no se encuentra..`, color);
            if (!player.queue.previous) return await buttonReply(interaction, `No he encontrado una canción.`, color);

            player.queue.add(player.queue.previous);
            if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();

            if (player.queue.size === 1) {
                player.stop();
            } else {
                player.queue.add(player.queue.previous, 0);

                if (player.queue.current.title !== player.queue.previous.title || player.queue.current.uri !== player.queue.previous.uri) player.stop();
            };

            return await buttonReply(interaction, `Ahora suena: [${player.queue.previous.title}](${player.queue.previous.uri})`, color);
        } else if (interaction.customId === `skipbut_but_${interaction.guildId}`) {
            if (!player.queue.size) return await buttonReply(interaction, `No quedan más canciones en la cola para reproducir.`, color);

            player.stop();
            return await buttonReply(interaction, `Salteada: [${title}](${uri})`, color);
        } else if (interaction.customId === `highvolume_but_${interaction.guildId}`) {
            let amount = Number(player.volume) + 10;
            if (amount >= 200) return await buttonReply(interaction, `No se puede subir más el volumen del reproductor.`, color);

            player.setVolume(amount);
            await buttonReply(interaction, ` Volumen cambiado a: \`[ ${player.volume}% ]\``, color);

            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });
        } else if (interaction.customId === `lowvolume_but_${interaction.guildId}`) {
            let amount = Number(player.volume) - 10;
            if (amount < 01) return await buttonReply(interaction, `No se puede subir más el volumen del reproductor.`, color);

            player.setVolume(amount);
            await buttonReply(interaction, ` Volumen cambiado a: \`[ ${player.volume}% ]\``, color);

            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });
        } else {
            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });

            return await buttonReply(interaction, `Has elegido un botón invalido.`, color);
        };
    }
}