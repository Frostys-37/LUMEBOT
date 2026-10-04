const { getStatus } = require("mc-server-status");
const { queryFull } = require("minecraft-server-util");

async function obtenerEstadoDetallado(client) {
  const modalidades = client.config.mcMonitor?.modalidades || [];

  return Promise.all(
    modalidades.map(async (m) => {
      const base = { nombre: m.nombre, host: m.host, port: m.port };

      try {
        const status = await getStatus(m.host, m.port, { timeout: 5000, checkPing: true });

        let extra = {};
        try {
          const query = await queryFull(m.host, m.port, { timeout: 3000 });
          extra = {
            software: query.software,
            plugins: query.plugins,
            mapa: query.map,
            jugadoresConectados: query.players.list,
          };
        } catch {
        }

        return {
          ...base,
          online: true,
          version: status.version?.name || null,
          descripcion: typeof status.description === "string" ? status.description : status.description?.text || null,
          jugadores: status.players,
          ping: status.ping ?? null,
          ...extra,
        };
      } catch {
        return { ...base, online: false };
      }
    }),
  );
}

module.exports = { obtenerEstadoDetallado };