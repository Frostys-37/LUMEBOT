const { Schema, model } = require("mongoose");

const sancionSchema = new Schema({
  GuildID: { type: String, required: true },
  TargetID: { type: String, required: true },
  TargetTag: { type: String, required: true },
  StaffID: { type: String, required: true },
  StaffTag: { type: String, required: true },
  Type: { type: String, enum: ["ban", "kick", "mute", "warn"], required: true },
  Reason: { type: String, required: true },
  Duration: { type: String }, 
  Source: { type: String, enum: ["discord", "dashboard"], default: "discord" },
  Timestamp: { type: Date, default: Date.now },
});

module.exports = model("Sancion", sancionSchema);