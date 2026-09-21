const { EmbedBuilder } = require("discord.js");
const StreamState = require("../../schema/streamState");
const { verificarTwitch } = require("./twtich");
const { verificarYoutube } = require("./youtube");
const { verificarKick } = require("./kick");

const COLORES = { twitch: "Purple", youtube: "Red", kick: "Green" };
const NOMBRES = { twitch: "Twitch", youtube: "YouTube", kick: "Kick" };

async function anunciar(client, stream) {
  const canalAnuncio = await client.channels.fetch(client.config.streams.announceChannelID).catch(() => null);
  if (!canalAnuncio) return;

  const embed = new EmbedBuilder()
    .setTitle(stream.title || "Sin título")
    .setURL(stream.url)
    .setImage(stream.thumbnail || null)
    .setColor(COLORES[stream.platform])
    .setFooter({ text: NOMBRES[stream.platform] })
    .setTimestamp();

  await canalAnuncio.send({
    content: `📢 ¡**${stream.channelName || stream.channel}** está en vivo en ${NOMBRES[stream.platform]}! ${stream.url}`,
    embeds: [embed],
  });
}

async function procesarCanal(client, canal, activos) {
  const encontrado = activos.find(
    (a) => a.platform === canal.platform && a.channel.toLowerCase() === canal.channel.toLowerCase(),
  );

  const estado = await StreamState.findOneAndUpdate(
    { platform: canal.platform, channel: canal.channel },
    {},
    { upsert: true, new: true },
  );

  if (encontrado && !estado.isLive) {
    await anunciar(client, encontrado);
    estado.isLive = true;
    estado.lastStreamId = encontrado.streamId;
    await estado.save();
  } else if (!encontrado && estado.isLive) {
    estado.isLive = false;
    await estado.save();
  }
}

async function verificarTodo(client) {
  try {
    const [twitchLive, youtubeLive, kickLive] = await Promise.all([
      verificarTwitch(client).catch(() => []),
      verificarYoutube(client).catch(() => []),
      verificarKick(client).catch(() => []),
    ]);

    const todosLosCanales = [
      ...client.config.streams.twitch.channels.map((c) => ({ platform: "twitch", channel: c })),
      ...client.config.streams.youtube.channelIds.map((c) => ({ platform: "youtube", channel: c })),
      ...client.config.streams.kick.channels.map((c) => ({ platform: "kick", channel: c })),
    ];

    const activos = [...twitchLive, ...youtubeLive, ...kickLive];

    for (const canal of todosLosCanales) {
      await procesarCanal(client, canal, activos);
    }
  } catch (err) {
    console.error("[streams] Error en el chequeo de streams:", err);
  }
}

function iniciarMonitorDeStreams(client) {
  if (!client.config.streams.announceChannelID) {
    console.warn("[streams] STREAM_ANNOUNCE_CHANNEL_ID no configurado -- el monitor de streams no se inició.");
    return;
  }

  verificarTodo(client);
  setInterval(() => verificarTodo(client), client.config.streams.checkIntervalMs);
  console.log(`[streams] Monitor de streams iniciado (cada ${client.config.streams.checkIntervalMs / 1000}s).`);
}

module.exports = { iniciarMonitorDeStreams };