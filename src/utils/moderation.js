const { EmbedBuilder } = require("discord.js");
const msg = require("./messages");
const emojis = require("../emojis.json");

function validateModerationTarget(client, interaction, member) {
    if(member.id === client.config.ownerID) {
        return msg.error("protected_user");
    }

    const owner = interaction.guild.ownerId === interaction.user.id;
    if(!owner && member.roles.highest.position >= interaction.member.roles.highest.position) {
        return msg.error("role_too_high");
    }

    return null;

}

function buildModLogEmbed({client, interaction, actionTitle, emojiKey, target, reason, extraFields = [], footerText}) {
    return new EmbedBuilder()
    .setTitle(`${emojis[emojiKey] || ""} | ${actionTitle}`)
    .addFields(
        { name: `${emojis.user} | Usuario:`, value: `${target} | ${target.id}`, inline: false },
        {
            name: `${emojis.moder} | Moderador:`,
            value: `[${interaction.member.roles.highest}] | ${interaction.user}`,
            inline: true
        },
        ...(reason !== undefined ? [{name: `${emojis.razon} | Razón:`, value: `${reason}`, inline: false}] : []),
        ...extraFields,
        { name: `${emojis.channel} | Comando ejecutado en:`, value: `${interaction.channel.name}`, inline: false },
        { name: `${emojis.clock} | Fecha`, value: `${new Date().toLocaleString()}`, inline: false }
    )
    .setColor(client.config.embedColor)
    .setTimestamp()
    .setFooter({ text: footerText || interaction.guild.name, iconURL: client.user.displayAvatarURL() });
}

async function sendModLog(client, embed) {
    if(!client.config.modLogChannelId) {
        const channel = await client.channels.fetch(client.config.modLogChannelId).catch(() => null);
        if(!channel) {
            console.warn("[moderation] No se encontró el canal de registro de moderación.");
            return;
        } else {
            await channel.send({ embeds: [embed] }).catch(() => null);
        }
    }
}

module.exports = {
    validateModerationTarget,
    buildModLogEmbed,
    sendModLog
}