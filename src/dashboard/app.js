const express = require("express");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./auth");
const requireStaff = require("./middleware/requireStaff");
const reportsRoutes = require("./routes/report");
const membersRoutes = require("./routes/member");
const moderationRoutes = require("./routes/moderation");
const sanctionsRoutes = require("./routes/sanctions");
const { MongoStore } = require("connect-mongo");

module.exports = function initDashboard(app, client) {
  if (!client.config.dashboard.ClientSecret || !client.config.dashboard.sessionSecret || !client.config.dashboard.guildId) {
    console.warn("[dashboard] Faltan variables de entorno del dashboard — no se inicializó.");
    return false;
  }

  app.use(express.json())

  app.use(
  session({
    secret: client.config.dashboard.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: client.config.mongourl,
      collectionName: "dashboard_sessions",
      ttl: 60 * 60 * 8,
    }),
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 },
  }),
);

  app.use("/api/auth", authRoutes(client));
  app.use("/api/reports", reportsRoutes(client, requireStaff));
  app.use("/api/members", membersRoutes(client, requireStaff));
  app.use("/api/moderation", moderationRoutes(client, requireStaff));
  app.use("/api/sanctions", sanctionsRoutes(client, requireStaff));

  app.get("/api/me", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "No autenticado." });
    res.json(req.session.user);
  });

  const buildDir = path.join(__dirname, "public-react");
  app.use(express.static(buildDir));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(buildDir, "index.html"));
  });

  return true;
};