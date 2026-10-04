const emojis = require("../emojis.json");
module.exports = {
  customId: "autorol_menu",
  roles: [
    { id: "795047383662067784", label: "Survival", description: "Actualizaciones para jugadores de Survival", emoji: emojis.survival },
    { id: "912067678619988020", label: "Prision", description: "Actualizaciones para jugadores de Prision", emoji: emojis.prision },
    { id: "940394340457517109", label: "Streams", description: "Aviso cuando haya directo", emoji: emojis.youtube },
    { id: "940424561403514883", label: "Giveaways", description: "Aviso cuando haya sorteos", emoji: emojis.razon },
    { id: "959908407966588928", label: "Lumebot", description: "Recibe notificaciones de alguna actualización del LUMEBOT", emoji: emojis.lumebot },
  ],
};