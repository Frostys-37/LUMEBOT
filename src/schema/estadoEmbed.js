const { Schema, model } = require("mongoose");

const estadoEmbedSchema = new Schema({
  channelId: { type: String, required: true },
  messageId: { type: String, required: true },
});

module.exports = model("EstadoEmbed", estadoEmbedSchema);