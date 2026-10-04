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

        let miembros = [];

        try {
            if(/^\d{15,20}$/.test(query)) {
                const porId = await guild.members.fetch(query).catch(() => null);
                if(porId) miembros = [porId];
            } else {
                const encontrados = await guild.members.fetch({query, limit: 20})
                miembros = [...encontrados.values()]
            }
        } catch (err) {
            constole.error("[dashboard] Error buscando miembros:", err);
            return res.status(500).json({error: "Error al buscar miembros en discord."})
        }

            const lista = miembros.map((m) => ({
                id: m.id,
                username: m.user.username,
                tag: m.displayName,
                avatar: m.displayAvatarURL({ size: 64, dynamic: true }),
                highestRole: m.roles.highest.name,
                joinedAt: m.joinedAt,
            }));
            res.json(lista);
    });
    return router;
}