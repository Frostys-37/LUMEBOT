const express = require("express");
const { EmbedBuilder } = require("discord.js");
const Reporte = require("../../schema/reports");

const ESTADOS_VALIDOS = ["Pendiente", "Aceptado", "Denegado", "Resuelto"];

async function obtenerEvidenciaFresca(client, rep) {
  if (!rep.evidenceChannelId || !rep.evidenceMessageId) {
    return rep.evidence;
  }

  try {
    const canal = await client.channels.fetch(rep.evidenceChannelId);
    const mensaje = await canal.messages.fetch(rep.evidenceMessageId);
    return mensaje.attachments.first()?.url || rep.evidence;
  } catch {
    return rep.evidence;
  }
}

module.exports = function reportsRoutes(client, requireStaff) {
  const router = express.Router();
  const guard = requireStaff(client);

  router.get("/", guard, async (req, res) => {
    const reportes = await Reporte.find({}).sort({ timestamp: -1 }).limit(100).lean();

    const enriquecidos = await Promise.all(
      reportes.map(async (rep) => {
        const [reportero, evidenciaFresca] = await Promise.all([
          client.users.fetch(rep.userId).catch(() => null),
          obtenerEvidenciaFresca(client, rep),
        ]);

        return {
          ...rep,
          reporterTag: reportero ? reportero.tag : `ID desconocido (${rep.userId})`,
          reporterAvatar: reportero ? reportero.displayAvatarURL({ size: 64 }) : null,
          evidence: evidenciaFresca,
        };
      }),
    );

    res.json(enriquecidos);
  });

  router.patch("/:reportId", guard, async (req, res) => {
    const { status, staffAction } = req.body;

    if (!ESTADOS_VALIDOS.includes(status)) {
      return res.status(400).json({ error: `Estado inválido. Usa uno de: ${ESTADOS_VALIDOS.join(", ")}` });
    }

    const reporte = await Reporte.findOne({ reportId: req.params.reportId });
    if (!reporte) return res.status(404).json({ error: "Reporte no encontrado." });

    reporte.status = status;
    if (staffAction) reporte.staffAction = staffAction;
    await reporte.save();

    const logChannel = await client.channels.fetch(client.config.sanctionLogChannelId).catch(() => null);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle(`⚖️ | Acción Tomada (Dashboard) - Reporte #${reporte.reportId}`)
        .setColor(status === "Aceptado" ? "Green" : "Red")
        .addFields(
          { name: "Staff responsable:", value: `${req.member.user.tag}` },
          { name: "Usuario MC Reportado:", value: `\`${reporte.mcUser}\`` },
          { name: "Estado Final:", value: status },
          { name: "Explicación:", value: reporte.staffAction || "N/A" },
        )
        .setTimestamp();
      await logChannel.send({ embeds: [embed] });
    }

    res.json(reporte);
  });

  return router;
};