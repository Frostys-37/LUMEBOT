const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const mongoose = require("mongoose");
const Lavamusic = require("./Lavamusic");

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
     * @typedef {Object} ApplicationCommandInterface Una interfaz de comando base con claves y sus valores literales.
     * @property {string} name Nombre del comando
     * @property {string} description Descripcion del comando(no necesaria)
     * @property {boolean} player Si debe existir o no un usuario para que se ejecute el comando.
     * @property {boolean} dj Si debe existir o no un usuario para que se ejecute el comando
     * @property {boolean} inVoiceChannel Si el autor debe estar o no en el canal de voz
     * @property {boolean} sameVoiceChannel Si debe de ser el mismo canal de voz
     */

    /**
     * @type {Collection<string, ApplicationCommandInterface>}
     */
    this.slashCommands = new Collection();
    this.config = require("../config.js");
    this.owner = this.config.ownerID;
    this.prefix = this.config.prefix;
    this.embedColor = this.config.embedColor;
    this.aliases = new Collection();
    this.commands = new Collection();
    this.logger = require("../utils/logger.js");
    this.emoji = require("../utils/emoji.json");
    if (!this.token) this.token = this.config.token;
    this.manager = new Lavamusic(this);

    this.rest.on("rateLimited", (info) => {
      this.logger.log(info, "log");
    });

    /**
     *  Mongose como base de datos
     */

    let xp = require('simply-xp')

xp.connect(this.config.mongourl, {
  notify: true
})

    mongoose.connect("mongodb+srv://frosty:NZHVlbycE1KVVwLf@lumecluster.vlt3igf.mongodb.net/?appName=LumeCluster");
    mongoose.Promise = global.Promise;
    mongoose.connection.on("connected", () => {
      this.logger.log("[DB] DATABASE CONNECTED", "ready");
    });
    mongoose.connection.on("err", (err) => {
      console.log(`Mongoose connection error: \n ${err.stack}`, "error");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    ["slashCommand", "events"].forEach((handler) => {
      require(`../handlers/${handler}`)(this);
    });
  }
  connect() {
    return super.login(this.config.token);
  }
}

module.exports = LUMEBOT;
