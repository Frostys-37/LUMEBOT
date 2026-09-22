const { EmbedBuilder } = require("discord.js");
const StreamState = require("../../schema/streamState");
const { verificarTwitch } = require("./twitch");
const { verificarYoutube } = require("./youtube");
const { verificarKick } = require("./kick");

const COLORES = { twitch: "Purple", youtube: "Red", kick: "Green" };
const NOMBRES = { twitch: "Twitch", youtube: "YouTube", kick: "Kick" };

let kickFallosSeguidos = 0;
let kickPausadoHasta = 0;

async function anunciar(client, stream) {
  const canalAnuncio = await client.channels.fetch(client.config.streams.announceChannelId).catch(() => null);
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
    { upsert: true, returnDocument: 'after' },
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

async function verificarKickConCircuitBreaker(client) {
  if (Date.now() < kickPausadoHasta) return [];

  try {
    const resultado = await verificarKick(client);
    kickFallosSeguidos = 0;
    return resultado;
  } catch (err) {
    kickFallosSeguidos++;
    if (kickFallosSeguidos >= 3) {
      const pausaMs = 15 * 60 * 1000;
      kickPausadoHasta = Date.now() + pausaMs;
      console.warn(`[streams] Kick falló ${kickFallosSeguidos} veces seguidas -- se pausa por 15 minutos.`);
    }
    return [];
  }
}

async function verificarTodo(client) {
  try {
    const cfg = client.config.streams || {};
    const twitchCfg = cfg.twitch || {};
    const youtubeCfg = cfg.youtube || {};
    const kickCfg = cfg.kick || {};

    const [twitchLive, youtubeLive, kickLive] = await Promise.all([
      verificarTwitch(client).catch(() => []),
      verificarYoutube(client).catch(() => []),
      verificarKickConCircuitBreaker(client),
    ]);

    const todosLosCanales = [
      ...(twitchCfg.channels || []).map((c) => ({ platform: "twitch", channel: c })),
      ...(youtubeCfg.channelIds || []).map((c) => ({ platform: "youtube", channel: c })),
      ...(kickCfg.channels || []).map((c) => ({ platform: "kick", channel: c })),
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
  if (!client.config.streams?.announceChannelId) {
    console.warn("[streams] STREAM_ANNOUNCE_CHANNEL_ID no configurado -- el monitor de streams no se inició.");
    return;
  }

  const intervalo = Math.max(60_000, Number(client.config.streams.checkIntervalMs) || 90_000);

  verificarTodo(client);
  setInterval(() => verificarTodo(client), intervalo);
  console.log(`[streams] Monitor de streams iniciado (cada ${intervalo / 1000}s).`);
}

module.exports = { iniciarMonitorDeStreams };