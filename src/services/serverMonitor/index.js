const { getStatus } = require("mc-server-status");
const { EmbedBuilder } = require("discord.js");
const ServerState = require("../../schema/estadoServidor");
const EstadoEmbed = require("../../schema/estadoEmbed");
const emojis = require("../../emojis.json")

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

  let transicion = null;

  if (!enLinea) {
    estado.fallosSeguidos += 1;

    if (estado.fallosSeguidos === FALLOS_PARA_ALERTAR && estado.isOnline) {
      estado.isOnline = false;
      estado.ultimaCaida = new Date();
      transicion = "caida";
    }
  } else {
    if (!estado.isOnline) {
      transicion = "recuperado";
    }
    estado.isOnline = true;
    estado.fallosSeguidos = 0;
  }

  await estado.save();
  return { ...modalidad, enLinea, jugadores, transicion };
}

function construirEmbedEstado(resultados) {
  const todasEnLinea = resultados.every((r) => r.enLinea);

  const embed = new EmbedBuilder()
    .setTitle(`${emojis.lume} Estado de las modalidades`)
    .setColor(todasEnLinea ? "Green" : "Red")
    .setFooter({ text: "Estado de Modalidades" })
    .setTimestamp();

  for (const r of resultados) {
    embed.addFields({
      name: `${r.enLinea ? `${emojis.success}` : `${emojis.warn}`} ${r.nombre}`,
      value: r.enLinea
        ? `En línea${r.jugadores ? `\n${r.jugadores.online}/${r.jugadores.max} jugadores` : ""}`
        : `Sin respuesta`,
      inline: true,
    });
  }

  return embed;
}

async function actualizarEmbedEstado(client, canal, resultados) {
  const embed = construirEmbedEstado(resultados);
  const registro = await EstadoEmbed.findOne();

  if (registro) {
    const mensaje = await canal.messages.fetch(registro.messageId).catch(() => null);
    if (mensaje) {
      await mensaje.edit({ embeds: [embed] });
      return;
    }
  }

  const nuevoMensaje = await canal.send({ embeds: [embed] });
  await EstadoEmbed.findOneAndUpdate({}, { channelId: canal.id, messageId: nuevoMensaje.id }, { upsert: true });
}

async function avisarTransiciones(canal, resultados) {
  const transiciones = resultados.filter((r) => r.transicion);
  if (!transiciones.length) return;

  const lineas = transiciones.map((r) =>
    r.transicion === "caida" ? `${emojis.warn} - **${r.nombre}** está caída.` : `${emojis.success} - **${r.nombre}** se recuperó.`,
  );

  const hayNuevasCaidas = transiciones.some((r) => r.transicion === "caida");

  await canal.send({
    content: `${hayNuevasCaidas ? "" : ""}${lineas.join("\n")}`,
  });
}

async function verificarModalidades(client) {
  const modalidades = client.config.mcMonitor?.modalidades || [];
  if (!modalidades.length) return [];

  const canal = await client.channels.fetch(client.config.mcMonitor.alertChannelId).catch(() => null);
  if (!canal) {
    client.logger.log("[mcMonitor] No se pudo encontrar el canal configurado en MC_MONITOR_ALERT_CHANNEL_ID.", "warn");
    return [];
  }

  const resultados = await Promise.all(modalidades.map((m) => revisarModalidad(client, m)));

  await actualizarEmbedEstado(client, canal, resultados);
  await avisarTransiciones(canal, resultados);

  return resultados;
}

async function obtenerEstadoModalidades(client) {
  const modalidades = client.config.mcMonitor?.modalidades || [];
  if (!modalidades.length) return [];

  return Promise.all(modalidades.map((m) => revisarModalidad(client, m)));
}

function iniciarMonitorDeServidores(client) {
  if (!client.config.mcMonitor?.alertChannelId || !client.config.mcMonitor?.modalidades?.length) {
    client.logger.log("[mcMonitor] Falta MC_MONITOR_ALERT_CHANNEL_ID o ninguna modalidad configurada: no se inició.", "warn");
    return;
  }

  const intervalo = Math.max(30_000, client.config.mcMonitor.checkIntervalMs);

  verificarModalidades(client);
  setInterval(() => verificarModalidades(client), intervalo);
  client.logger.log(`[mcMonitor] Monitor de modalidades iniciado.`, "event");
}

module.exports = { iniciarMonitorDeServidores, verificarModalidades, obtenerEstadoModalidades };