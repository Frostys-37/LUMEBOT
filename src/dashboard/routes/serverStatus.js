const express = require("express");
const { obtenerEstadoDetallado } = require("../../services/serverMonitor/estado");

module.exports = function serverStatusRoutes(client, requireStaff) {
  const router = express.Router();
  const guard = requireStaff(client);

  router.get("/", guard, async (req, res) => {
    const estado = await obtenerEstadoDetallado(client);
    res.json(estado);
  });

  return router;
};