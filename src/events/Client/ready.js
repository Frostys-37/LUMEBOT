const { Activity } = require("discord.js");
const express = require("express");
const initDashboard = require("../../dashboard/app");
module.exports = {
  name: "clientReady",
  run: async (client) => {
    client.logger.log(`${client.user.username} en linea!`, "ready");
    client.logger.log(
      `Sirviendo a: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} usuarios`,
      "ready",
    );

    let statuses = ["/help", `prefix /`, `en mc.lumecraft.net`];
    setInterval(function () {
      let status = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(status, { type: Activity.Playing });
    }, 10000);

    const app = express();
    const iniciado = initDashboard(app, client);

    if (iniciado) {
      app.listen(client.config.dashboard.port, () => {
        client.logger.log(
          `Dashboard corriendo en ${client.config.dashboard.url}`,
          "event",
        );
      });
    }

  },
};
