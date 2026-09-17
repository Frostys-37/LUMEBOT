const express = require("express");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./auth");
const requireStaff = require("./middleware/requireStaff");
const reportsRoutes = require("./routes/report");
const membersRoutes = require("./routes/member");
const moderationRoutes = require("./routes/moderation");

module.exports = function initDashboard(app, client) {
  if (!client.config.dashboard.ClientSecret || !client.config.dashboard.sessionSecret || !client.config.dashboard.guildId) {
    console.warn("[dashboard] Faltan variables de entorno del dashboard — no se inicializó.");
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
  app.use("/api/members", membersRoutes(client, requireStaff));
  app.use("/api/moderation", moderationRoutes(client, requireStaff));

  app.get("/api/me", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "No autenticado." });
    res.json(req.session.user);
  });

  // Build de producción de React (npm run build en client/ genera esta carpeta)
  const buildDir = path.join(__dirname, "public-react");
  app.use(express.static(buildDir));

  // SPA fallback: cualquier ruta que no sea /api/* devuelve index.html
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(buildDir, "index.html"));
  });

  return true;
};