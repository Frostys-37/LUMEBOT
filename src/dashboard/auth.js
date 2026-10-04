const express = require("express");
const axios = require("axios");

module.exports = function authRoutes(client) {
  const router = express.Router();
  const REDIRECT_URI = `${client.config.dashboard.url}/api/auth/callback`;

  router.get("/login", (req, res) => {
    const params = new URLSearchParams({
      client_id: client.config.clientID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "identify",
    });
    res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
  });

  router.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.redirect("/?error=no_code");

    try {
      const tokenRes = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: client.config.clientID,
          client_secret: client.config.dashboard.ClientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      const { access_token } = tokenRes.data;

      const userRes = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const avatarUrl = userRes.data.avatar
        ? `https://cdn.discordapp.com/avatars/${userRes.data.id}/${userRes.data.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${Number(userRes.data.discriminator || 0) % 5}.png`;

      req.session.user = {
        id: userRes.data.id,
        username: userRes.data.username,
        avatar: avatarUrl,
      };

      res.redirect("/");
    } catch (err) {
      console.error("[dashboard] Error en OAuth callback:", err.response?.data || err.message);
      res.redirect("/?error=auth_failed");
    }
  });

  router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
  });

  return router;
};
