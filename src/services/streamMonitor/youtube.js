const axios = require("axios");

async function obtenerUltimoVideo(client, channelId) {
  const { apiKey } = client.config.streams.youtube;

  const uploadsPlaylistId = "UU" + channelId.slice(2);

  const playlistRes = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
    params: { key: apiKey, playlistId: uploadsPlaylistId, part: "snippet", maxResults: 1 },
  });

  const item = playlistRes.data.items?.[0];
  if (!item) return null;

  const videoId = item.snippet.resourceId.videoId;

  const videoRes = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
    params: { key: apiKey, id: videoId, part: "snippet" },
  });

  const video = videoRes.data.items?.[0];
  if (!video || video.snippet.liveBroadcastContent !== "live") return null;

  return {
    platform: "youtube",
    channel: channelId,
    channelName: video.snippet.channelTitle,
    streamId: videoId,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails?.high?.url,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

async function verificarYoutube(client) {
  const { channelIds, apiKey } = client.config.streams.youtube;
  if (!channelIds.length || !apiKey) return [];

  const resultados = [];
  for (const channelId of channelIds) {
    try {
      const resultado = await obtenerUltimoVideo(client, channelId);
      if (resultado) resultados.push(resultado);
    } catch (err) {
      console.warn(`[streams] Error consultando YouTube para "${channelId}":`, err.message);
    }
  }
  return resultados;
}

module.exports = { verificarYoutube };