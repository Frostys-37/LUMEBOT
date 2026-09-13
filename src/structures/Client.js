const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const mongoose = require("mongoose");

class LUMEBOT extends Client {
  constructor() {
    super({
      failIfNotExists: true,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
    });
    this.commands = new Collection();
    /**
     * @typedef {Object} 
     * @property {string} name Nombre del comando
     * @property {string} description Descripcion del comando(no necesaria)
     */

    /**
     * @type {Collection<string, ApplicationCommandInterface>}
     */

    this.slashCommands = new Collection();
    this.config = require("../config.js");
    this.devID = this.config.devID;
    this.prefix = this.config.prefix;
    this.embedColor = this.config.embedColor;
    this.aliases = new Collection();
    this.commands = new Collection();
    this.logger = require("../utils/logger.js");
    this.emoji = require("../emojis.json");
    if (!this.token) this.token = this.config.token;

    this.rest.on("rateLimited", (info) => {
      this.logger.log(info, "log");
    });

    let xp = require('simply-xp')

    xp.connect(this.config.mongourl, {
    notify: true
    })

    mongoose.set("strictQuery", false);

    const dburl = this.config.mongourl;

    mongoose.connect(dburl).then(() => {
      this.logger.log("[DB] DB CONECTADA", "ready");
    }).catch((err) => {
      this.logger.log(`Error de conexión: \n ${err.stack}`, "error");
    });

    mongoose.connection.on("connected", () => {
      this.logger.log("Mongoose conectado", "ready");
    });

    mongoose.connection.on("error", (err) => {
      this.logger.log(`Mongoose error de conexión: \n ${err.stack}`, "error");
    });

    mongoose.connection.on("disconnected", () => {
      this.logger.log("Mongoose desconectado", "error");
    });

    ["slashCommands", "events"].forEach((handler) => {
      require(`../handlers/${handler}`)(this);
    });
  }
  connect() {
    return super.login(this.config.token);
  }
}

module.exports = LUMEBOT;
