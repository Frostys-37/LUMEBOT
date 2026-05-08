const Client = require("../../index");
const { VoiceState, EmbedBuilder } = require("discord.js");
const LUMEBOT = require("../../structures/Client");
/**
 *
 * @param {LUMEBOT} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = {
  name: "voiceStateUpdate",
  /**
   *
   * @param {LUMEBOT} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @returns {Promise<void>}
   */
  run: async (client, oldState, newState) => {
    // obtiene el servidor y usuario
    let guildId = newState.guild.id;
    const player = client.manager.get(guildId);

    // mira si el bot esta activo
    if (!player || player.state !== "CONNECTED") return;

    if (!newState.guild.members.cache.get(client.user.id).voice.channelId) {
      player.destroy();
      return client.channels.cache.get(player?.textChannel).send({
        embeds: [
          new EmbedBuilder()
            .setDescription("El usuario se ha desconectado del canal de voz")
            .setColor(client.embedColor),
        ],
      });
    }

    // preprocesa los datos
    const stateChange = {};
    // Obtiene el estado
    if (oldState.channel === null && newState.channel !== null)
      stateChange.type = "JOIN";
    if (oldState.channel !== null && newState.channel === null)
      stateChange.type = "LEAVE";
    if (oldState.channel !== null && newState.channel !== null)
      stateChange.type = "MOVE";
    if (newState.serverMute == true && oldState.serverMute == false)
      return player.pause(false);
    if (newState.serverMute == false && oldState.serverMute == true)
      return player.pause(true);
    // cambia el tipo
    if (stateChange.type === "MOVE") {
      if (oldState.channel.id === player.voiceChannel)
        stateChange.type = "LEAVE";
      if (newState.channel.id === player.voiceChannel)
        stateChange.type = "JOIN";
    }
    // 2ble evento
    if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
    if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

    if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
      return;

    stateChange.members = stateChange.channel.members.filter(
      (member) => !member.user.bot
    );

    switch (stateChange.type) {
      case "JOIN":
        if (
          (oldState.selfMute && !newState.selfMute) ||
          (!oldState.selfMute && newState.selfMute)
        )
          return;
        if (
          (oldState.selfDeaf && !newState.selfDeaf) ||
          (!oldState.selfDeaf && newState.selfDeaf)
        )
          return;
        if (stateChange.members.size >= 1 && player.paused) {
          let emb = new EmbedBuilder()
            .setAuthor({ name: `Reanudando la cola pausada` })
            .setColor(client.embedColor)
            .setDescription(
              `Reanudando ya que me dejaron solo :c`
            );
          client.channels.cache.get(player.textChannel).send({ embeds: [emb] });

          player.pause(false);
        }
        break;
      case "LEAVE":
        if (
          stateChange.members.size === 0 &&
          !player.paused &&
          player.playing
        ) {
          player.pause(true);

          let emb = new EmbedBuilder()
            .setAuthor({ name: `Paused!` })
            .setColor(client.embedColor)
            .setDescription(
              `La musica ha sido pausada porque todos se fueron :c`
            );
          client.channels.cache
            .get(player?.textChannel)
            .send({ embeds: [emb] });
        }
        break;
    }
  },
};
