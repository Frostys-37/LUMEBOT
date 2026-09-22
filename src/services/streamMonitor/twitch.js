const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = 0;

async function obtenerToken(client) {
    if(cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

    const { clientId, clientSecret } = client.config.streams.TWITCH;
    const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
        params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
        },
    })
    
    cachedToken = res.data.access_token;
    tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;

    return cachedToken;
}

async function verificarTwitch(client) {
    const { channels, clientId, clientSecret } = client.config.streams.twitch;
    if(!channels.length || !clientId || !clientSecret) return [];

    const token = await obtenerToken(client);
    const params = new URLSearchParams();

    channels.forEach((c) => {
        params.append("user_login", c)
    });

    const res = await axios.get(`https://api.twitch.tv/helix/streams?${params.toString()}`, {
        headers: { "Client-Id": clientId, Authorization: `Bearer ${token}`},
    })

    return res.data.data.map((s) => ({
        plataform: "twitch",
        channel: s.user_login,
        streaId: s.id,
        title: s.title,
        thumbnail: s.thumbnaul_url.replace("{width}", "640").replace("{height}", "360"),
        url: `https://twitch.tv/${s.user_login}`,
    }));
}

module.exports = { verificarTwitch }