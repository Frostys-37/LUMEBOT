const { EmbedBuilder, CommandInteraction, Client, PermissionFlagsBits } = require("discord.js")

module.exports = {
  name: "join",
  description: "Ingreso a tu canal de voz!.",
  userPrems: [],
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  category: "Music",
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
    let player = interaction.client.manager.get(interaction.guildId);
    if (player && player.voiceChannel && player.state === "CONNECTED") {
      return await interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`Ya estoy conectado en: <#${player.voiceChannel}>`)] })
    } else {
      if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`No tengo disponibles uno de los siguientes permisos (o los 2): \`CONNECT\`, \`SPEAK\`.`)] });
      const { channel } = interaction.member.voice;
      if (!interaction.guild.members.me.permissionsIn(channel).has([PermissionFlagsBits.Connect , PermissionFlagsBits.Speak])) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`No tengo disponibles uno de los siguientes permisos (o los 2): \`CONNECT\`, \`SPEAK\`.`)] });
      if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.Connect , PermissionFlagsBits.Speak])) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`No tengo permisos para usar este comando.`)] });

      const emojiJoin = client.emoji.join;

      player = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: interaction.member.voice.channelId,
        selfDeafen: true,
        volume: 80
      })
      if (player && player.state !== "CONNECTED") player.connect();

      let thing = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`${emojiJoin} **Entrando al canal de voz.**\Unido a: <#${channel.id}> y enlazado a: <#${interaction.channel.id}>`)
      return interaction.editReply({ embeds: [thing] });

    };

  }
};
