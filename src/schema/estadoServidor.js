const { Schema, model } = require("mongoose");

const estadoServidor = new Schema({
  nombre: { type: String, required: true, unique: true },
  isOnline: { type: Boolean, default: true },
  ultimaCaida: { type: Date, default: null },
  fallosSeguidos: { type: Number, default: 0 },
});

module.exports = model("ServerState", estadoServidor);