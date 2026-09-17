const express = require('express');
const ms = require('ms');
const { validateModerationTarget, buildModLogEmbed, sendModLog } = require('../../utils/moderation');
const msg = require("../../utils/messages");
const warningSchema = require("../../schema/warns");

const ACCIONES_VALIDAS = ["ban", "kick", "mute", "warn", "unmute", "unban"];

module.exports = function moderationRoutes(client, requireStaff) {
    const router = express.Router();
    const guard = requireStaff(client);

    router.post('/:action', guard, async (req, res) => {
        const accion = req.params.acccion;
        const { userId, reason, duration } = req.body;

        if(!ACCIONES_VALIDAS.includes(accion)) {
            return res.status(400).json({ error: `Acción inválida. Usa una de: ${ACCIONES_VALIDAS.join(", ")}` });
        }

        if(!userId || !reason) {
            return res.status(400).json({ error: "Faltan parámetros requeridos: userId y reason." });
        }

        const guild = client.guilds.cache.get(client.config.dashboard.guildId);
        if(!guild) {
            return res.status(500).json({ error: "No se pudo encontrar el servidor configurado." });
        }

        const fakeInteraction = {
            member: req.member,
            user: req.member.user,
            guild,
            channel: { name: "Dashboard Lumebot" },
        }

        try {
            if(accion === "ban") {
                const target = await client.users.fetch(userId).catch(() => null);
                if(!target) {
                    return res.status(404).json({ error: "Usuario no encontrado." });
                }

                const member = await guild.members.fetch(userId).catch(() => null);
                if(member) {
                    const error = validateModerationTarget(fakeInteraction, client, member);
                    if (error) return res.status(403).json({ error });
                }

                await guild.members.ban(target, { reason });
                const embed = buildModLogEmbed({
                    client,
                    interaction: fakeInteraction,
                    actionTitle: "Usuario Baneado (Dashboard)",
                    emojiKey: "ban",
                    target, 
                    reason,
                    footerText: msg.success("banned"),
                });
                
                await sendModLog(client, embed);
                return res.json({ ok: true });
            }

            if (accion === "kick") {
                const member = await guild.members.fetch(userId).catch(() => null);
                if (!member) {
                    return res.status(404).json({ error: "Usuario no encontrado o no es miembro del servidor." });
                }

                const error = validateModerationTarget(fakeInteraction, client, member);
                if (error) return res.status(403).json({ error });

                await guild.members.kick(member, { reason });
                const embed = buildModLogEmbed({
                    client,
                    interaction: fakeInteraction,
                    actionTitle: "Usuario Expulsado (Dashboard)",
                    emojiKey: "kick",
                    target: member.user,
                    reason,
                    footerText: msg.success("kicked"),
                });

                await sendModLog(client, embed);
                return res.json({ ok: true });
            }

            if(accion === "mute") {
                const convertedTime = ms(duration);
                if (!convertedTime || convertedTime < 10_000 || convertedTime > 2_419_200_000) {
                    return res.status(400).json({ error: msg.error("invalid_duration", { min: "10 segundos", max: "28 dias" }) });
                }

                const member = await guild.members.fetch(userId).catch(() => null);
                if (!member) {
                    return res.status(404).json({ error: "Usuario no encontrado o no es miembro del servidor." });
                }

                const error = validateModerationTarget(fakeInteraction, client, member);
                if (error) return res.status(403).json({ error });

                await member.timeout(convertedTime, reason); 
                const embed = buildModLogEmbed({
                    client,
                    interaction: fakeInteraction,
                    actionTitle: "Usuario Silenciado (Dashboard)",
                    emojiKey: "timeout",
                    target: member.user,
                    reason,
                    extraFields: [{ name: "Tiempo:", value: duration}],
                    footerText: msg.success("muted"),
                });

                await sendModLog(client, embed);
                return res.json({ ok: true });
            }

            if(accion === "warn") {
                const member = await guild.members.fetch(userId).catch(() => null);
                if (!member) {
                    return res.status(404).json({ error: "Usuario no encontrado o no es miembro del servidor." });
                }

                let data = await warningSchema.findOne({ GuildID: guild.id, UserID: member.id });
                const warnContent = {
                    ExecuterId: req.member.id,
                    ExecuterTag: req.member.user.username,
                    Reason: reason,
                    Timestamp: Date.now(),
                };

                if(!data) {
                    data = new warningSchema({
                        GuildID: guild.id,
                        UserID: member.id,
                        Content: [warnContent]
                    })
                } else {
                    data.Content.push(warnContent);
                }

                await data.save();

                const embed = buildModLogEmbed({
                    client,
                    interaction: fakeInteraction,
                    actionTitle: "Usuario Advertido (Dashboard)",
                    emojiKey: "warn",
                    target,
                    reason,
                    footerText: msg.success("warned"),
                });
                await sendModLog(client, embed);
                return res.json({ ok: true });
            }
        } catch (error) {
            console.error("Error al procesar la acción de moderación:", error);
            return res.status(500).json({ error: "Ocurrió un error al procesar la acción de moderación." });
        }

    });
    
    return router;
    
}