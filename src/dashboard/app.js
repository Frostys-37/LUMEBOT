const express = require("express");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./auth");
const requireStaff = require("./middleware/requireStaff");
const reportsRoutes = require("./routes/report");

module.exports = function initDashboard(app, client) {
  if (!client.config.dashboard.ClientSecret || !client.config.dashboard.sessionSecret || !client.config.dashboard.guildId) {
    console.warn("[dashboard] Faltan DISCORD_OAUTH_CLIENT_SECRET, DASHBOARD_SESSION_SECRET o DASHBOARD_GUILD_ID en .env — el dashboard no se inicializó.");
    return false;
  }

  app.use(express.json());
  app.use(
    session({
      secret: client.config.dashboard.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 },
    }),
  );

  app.use("/api/auth", authRoutes(client));
  app.use("/api/reports", reportsRoutes(client, requireStaff));

  app.get("/api/me", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "No autenticado." });
    res.json(req.session.user);
  });

  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  });

  app.use(express.static(path.join(__dirname, "public")));

  return true;
};