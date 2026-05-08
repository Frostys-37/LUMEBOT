const { model, Schema } = require("mongoose")

let warningSchema = new Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Reason: String,
    Content: Array
})

module.exports = model("SistemaDeWarns", warningSchema)