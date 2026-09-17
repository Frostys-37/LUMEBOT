const express = require('express');

module.exports = function memberRoutes(client, requireStaff) {
    const router = express.Router();
    const guard = requireStaff(client);

    router.get('/search', guard, async (req, res) => {
        const query = (req.query.q || "").toLowerCase().trim();
        if(query.length < 2) {
            return res.status(400).json({ error: "La consulta debe tener al menos 2 caracteres." });
        }

        const guild = client.guilds.cache.get(client.config.dashboard.guildId);
        if(!guild) {
            return res.status(500).json({ error: "No se pudo encontrar el servidor configurado." });
        }

        let resultados = guild.members.cache.filter(
            (m) => m.user.username.toLowerCase().includes(query) || m.displayName.toLowerCase().includes(query)
        );

        if(resultados.size === 0 && /^<@!?(\d+)>$/.test(query)) {
            const porId = await guild.members.fetch(query).catch(() => null);
            if(porId) {
                resultados = new Map([[porId.id, porId]]);
            }

            const lista = [...resultados.values()].slice(0,20).map((m) => ({
                id: m.id,
                username: m.user.username,
                tag: m.displayName,
                avatar: m.displayAvatarURL({ size: 64, dynamic: true }),
                highestRole: m.roles.highest.name,
                joinedAt: m.joinedAt,
            }));
            return res.json(lista);
        }
    });
    return router;
}