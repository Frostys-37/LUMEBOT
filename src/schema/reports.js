const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    mcUser: { type: String, required: true },
    reason: { type: String, required: true },
    evidence: { type: String, required: true },
    link: { type: String, default: "No proporcionado" },
    status: { type: String, default: "Pendiente" },
    staffAction: { type: String, default: "Ninguna" },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reporte', ReporteSchema);