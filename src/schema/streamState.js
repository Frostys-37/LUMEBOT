const { PollAnswerVoterManager } = require("discord.js")
const { Schema, model } = require("mongoose")

const streamStateSchema = new Schema({
    platform: { type: String, enum: ["twitch", "youtube", "kick"], required: true },
    channel: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    lastStreamId: { type: String, default: null },
})

streamStateSchema.index({ platform: 1, channel: 1 }, { unique: true });

module.exports = model("StreamState", streamStateSchema);