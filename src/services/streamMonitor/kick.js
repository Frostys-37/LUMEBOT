const axios = require("axios");

async function verificarKick(client) {
  const { channels } = client.config.streams.kick;
  if (!channels.length) return [];

  const resultados = [];

  for (const canal of channels) {
    try {

      const res = await axios.get(`https://kick.com/api/v2/channels/${canal}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const data = res.data;
      if (data && data.livestream) {
        resultados.push({
          platform: "kick",
          channel: canal,
          streamId: String(data.livestream.id),
          title: data.livestream.session_title,
          thumbnail: data.livestream.thumbnail?.url,
          url: `https://kick.com/${canal}`,
        });
      }
    } catch (err) {
      console.warn(`[streams] Error consultando Kick para "${canal}":`, err.message);
    }
  }

  return resultados;
}

module.exports = { verificarKick };