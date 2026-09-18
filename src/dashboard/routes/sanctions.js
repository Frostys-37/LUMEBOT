const express = require("express");
const Sancion = require("../../schema/sanciones");

module.exports = function sanctionsRoutes(client, requireStaff) {
  const router = express.Router();
  const guard = requireStaff(client);

  router.get("/:userId", guard, async (req, res) => {
    const historial = await Sancion.find({
      GuildID: client.config.dashboard.guildId,
      TargetID: req.params.userId,
    })
      .sort({ Timestamp: -1 })
      .lean();

    res.json(historial);
  });

  return router;
};