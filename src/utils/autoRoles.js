const emojis = require("../emojis.json");
module.exports = {
  customId: "autorol_menu",
  roles: [
    { id: "1033967614986305576", label: "Survival", description: "Actualizaciones para jugadores de Survival", emoji: emojis.survival },
    { id: "946876259005263883", label: "Prision", description: "Actualizaciones para jugadores de Prision", emoji: emojis.prision },
    { id: "904539915520475137", label: "Streams", description: "Aviso cuando haya directo", emoji: emojis.youtube },
    { id: "1556177623871135754", label: "Giveaways", description: "Aviso cuando haya sorteos", emoji: emojis.razon },
    { id: "866050130532892693", label: "Lumebot", description: "Recibe notificaciones de alguna actualización del LUMEBOT", emoji: emojis.lumebot },
  ],
};