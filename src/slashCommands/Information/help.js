const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, CommandInteraction, ButtonStyle, Client, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const Discord = require("discord.js");
const { stat } = require("fs");
const { initial } = require("lodash");
const page = require('discord-pagination-advanced');

module.exports = {
    name: "help",
    description: "Mira todos mis comandos disponibles!.",
    owner: false,
	category: "Information",

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: true
          });

    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} Help`)
      .setDescription(`Hola **<@${interaction.member.user.id}>**, soy <@${client.user.id}>!\n\nBot oficial de este servidor, mis categorías son las siguientes:\n\n\`🎵\`•Musica\n\`🗒️\`•Información\n\`💽\`•Playlists\n\`⚙️\`•Config\n\`🛠\`•Moderación\n\`📐\`•Utilidad\n\n*Para ver los comandos, elije el botón correspondiente.*\n\n`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.embedColor)
      .setTimestamp()
      .setFooter({ text: `Requested by: ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true})})

      const row = new ActionRowBuilder()
			.addComponents(
				new Discord.SelectMenuBuilder()
					.setCustomId('helped')
					.setPlaceholder('Mira mis comandos seleccionando la categoría')
					.addOptions(
						{
							label: 'Configuración',
							description: 'Mira mis comandos de configuración',
							value: 'config',
              emoji: '852098683851505675',
						},
						{
							label: 'Información',
							description: 'Mira mis comandos de información',
							value: 'info',
              emoji: '931701885755326484',
						},
            {
							label: 'Moderación',
							description: 'Mira mis comandos de Moderación (uso solo staff)',
							value: 'mod',
              emoji: '1010909196771917894',
						},
            {
							label: 'Música',
							description: 'Mira mis comandos de música',
							value: 'music',
              emoji: '1074881604075393044',
						},
            {
							label: 'Playlist',
							description: 'Aprende a crear tu playlist',
							value: 'plays',
              emoji: '852093497837879296',
						},
            {
							label: 'Utilidad',
							description: 'Mira mis comandos de utilidad',
							value: 'util',
              emoji: '850651217343545344',
						},
					),
			);

      await interaction.editReply({embeds: [embed], components: [row]})

    }
}