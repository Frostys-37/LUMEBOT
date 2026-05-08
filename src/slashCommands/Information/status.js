const {
  EmbedBuilder,
  version,
  CommandInteraction,
  Client,
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const si = require("systeminformation");

module.exports = {
  name: "status",
  category: "Information",
  description: "Mira el status del bot.",
  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    const duration1 = moment
      .duration(interaction.client.uptime)
      .format(" d [days], h [hrs], m [mins], s [secs]");
    const cpu = await si.cpu();
    const about = interaction.client.emoji.about;
    let guildsCounts = await client.guilds.fetch();
    let userCounts = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );

    const embed = new EmbedBuilder()
      .setColor(interaction.client.embedColor)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(`${about} **Status**
                **= ESTADISTICAS =**
                **• Servers** : ${guildsCounts.size}
                  **• Usuarios** : ${userCounts}
                **• Discord.js** : v${version}
                **• Node** : ${process.version}
                **= SISTEMA =**
                **• Platforma** : ${os.type}
                **• Uptime** : ${duration1}
                **• CPU** :
                > **• Cores** : ${cpu.cores}
                > **• Model** : ${os.cpus()[0].model} 
                > **• Speed** : ${os.cpus()[0].speed} MHz
                **• MEMORIA** :
                > **• Total Memory** : ${(os.totalmem() / 1024 / 1024).toFixed(
                  2
                )}mb
                > **• Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(
                  2
                )}mb
                > **• Total** : ${(
                  process.memoryUsage().heapTotal /
                  1024 /
                  1024
                ).toFixed(2)}mb
                > **• Usada** : ${(
                  process.memoryUsage().heapUsed /
                  1024 /
                  1024
                ).toFixed(2)}mb
            `);
    interaction.followUp({ embeds: [embed] });
  },
};
