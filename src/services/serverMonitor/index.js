const { getStatus } = require("mc-server-status");
const { EmbedBuilder } = require("discord.js");
const ServerState = require("../../schema/estadoServidor");

const FALLOS_PARA_ALERTAR = 2;

async function revisarModalidad(client, modalidad) {
  let enLinea = true;
  let jugadores = null;

  try {
    const status = await getStatus(modalidad.host, modalidad.port, { timeout: 5000, checkPing: false });
    jugadores = status.players;
  } catch {
    enLinea = false;
  }

  const estado = await ServerState.findOneAndUpdate(
    { nombre: modalidad.nombre },
    {},
    { upsert: true, returnDocument: "after" },
  );

  if (!enLinea) {
    estado.fallosSeguidos += 1;

    if (estado.fallosSeguidos === FALLOS_PARA_ALERTAR && estado.isOnline) {
      estado.isOnline = false;
      estado.ultimaCaida = new Date();
      await avisar(client, modalidad, false);
    }
  } else {
    if (!estado.isOnline) {
      await avisar(client, modalidad, true);
    }
    estado.isOnline = true;
    estado.fallosSeguidos = 0;
  }

  await estado.save();
  return { ...modalidad, enLinea, jugadores };
}

async function avisar(client, modalidad, recuperado) {
  const canal = await client.channels.fetch(client.config.mcMonitor.alertChannelId).catch(() => null);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle(recuperado ? `✅ ${modalidad.nombre} se recuperó` : `🔴 ${modalidad.nombre} está caída`)
    .setDescription(
      recuperado
        ? `La modalidad **${modalidad.nombre}** (${modalidad.host}:${modalidad.port}) volvió a responder.`
        : `La modalidad **${modalidad.nombre}** (${modalidad.host}:${modalidad.port}) dejó de responder.`,
    )
    .setColor(recuperado ? "Green" : "Red")
    .setTimestamp();

  await canal.send({ content: recuperado ? undefined : "@here", embeds: [embed] });
}

async function verificarModalidades(client) {
  const modalidades = client.config.mcMonitor?.modalidades || [];
  if (!modalidades.length) return [];

  return Promise.all(modalidades.map((m) => revisarModalidad(client, m)));
}

function iniciarMonitorDeServidores(client) {
  if (!client.config.mcMonitor?.alertChannelId || !client.config.mcMonitor?.modalidades?.length) {
    console.warn("[mcMonitor] Falta MC_MONITOR_ALERT_CHANNEL_ID o ninguna modalidad configurada: no se inició.");
    return;
  }

  const intervalo = Math.max(30_000, client.config.mcMonitor.checkIntervalMs);

  verificarModalidades(client);
  setInterval(() => verificarModalidades(client), intervalo);
  console.log(`[mcMonitor] Monitor de modalidades iniciado.`);
}

module.exports = { iniciarMonitorDeServidores, verificarModalidades };