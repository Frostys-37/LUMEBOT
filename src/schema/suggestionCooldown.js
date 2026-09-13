const mongoose = require('mongoose');

const suggestionCooldownSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    lastSuggestion: { type: Date, required: true }
});

module.exports = mongoose.model('SuggestionCooldown', suggestionCooldownSchema);