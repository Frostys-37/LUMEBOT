module.exports = function requireStaff(client) {
    return async function (req, res, next) {
        console.log('sesion:', req.session.user, '| cookie header:', req.headers.cookie);
        if (!req.session.user) {
            return res.status(401).json({ error: "No estás autenticado. Por favor, inicia sesión." });
        }

        const guild = client.guilds.cache.get(client.config.dashboard.guildId);
        if (!guild) {
            return res.status(500).json({ error: "El bot no esta en el servidor configurado por la dashboard." });
        }

        const member = await guild.members.fetch(req.session.user.id).catch(() => null);
        if (!member) {
            return res.status(403).json({ error: "No eres miembro del servidor." });
        }

        const esStaff = member.roles.cache.some(role => client.config.ticketStaffRoleIds.includes(role.id));
        if (!esStaff) {
            return res.status(403).json({ error: "No tienes permisos de staff." });
        }

        req.member = member;
        next();

}
}