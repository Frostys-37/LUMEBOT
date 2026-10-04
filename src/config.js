require("dotenv").config();

const required = ["TOKEN", "MONGO_URI", "CLIENT_ID"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta variable de entorno: ${key}`);
}

const parseList = (value) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : []);

module.exports = {
  // BOT GEN
  token: process.env.TOKEN,
  mongourl: process.env.MONGO_URI,
  clientID: process.env.CLIENT_ID,
  prefix: "/",
  ownerID: process.env.OWNER_ID || "793926625765883955",
  embedColor: process.env.EMBED_COLOR || "Blurple",
  logs: process.env.LOGS || "1065322630980321422",
  geminiApiKey: process.env.GEMINI_API_KEY,

  guildIds: parseList(process.env.GUILD_IDS),

  // LOGS
  modLogChannelId: process.env.MOD_LOG_CHANNEL_ID,
  sanctionLogChannelId: process.env.SANCTION_LOG_CHANNEL_ID,
  reportStaffChannelId: process.env.REPORT_STAFF_CHANNEL_ID,
  suggestionsChannelId: process.env.SUGGESTIONS_CHANNEL_ID,
  videoStaffChannelId: process.env.VIDEO_STAFF_CHANNEL_ID,
  videoPublicChannelId: process.env.VIDEO_PUBLIC_CHANNEL_ID,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  memberRoleId: process.env.MEMBER_ROLE_ID,
  autoModLogChannelId: process.env.AUTOMOD_LOG_CHANNEL_ID,

  // TICKETS
  ticketPanelChannelId: process.env.TICKET_PANEL_CHANNEL_ID,
  ticketOpenCategoryId: process.env.TICKET_OPEN_CATEGORY_ID,
  ticketClosedCategoryId: process.env.TICKET_CLOSED_CATEGORY_ID,
  ticketTranscriptChannelId: process.env.TICKET_TRANSCRIPT_CHANNEL_ID,
  ticketStaffRoleIds: parseList(process.env.TICKET_STAFF_ROLE_IDS),

  staffBypassIds: parseList(process.env.STAFF_BYPASS_IDS),

  //DASHBOARD
  dashboard: {
    enabled: process.env.DASHBOARD_ENABLED === "true",
    port: process.env.DASHBOARD_PORT || 8080,
    url: process.env.DASHBOARD_URL || "http://localhost:8080",
    guildId: process.env.DASHBOARD_GUILD_ID,
    ClientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET || "",
    sessionSecret: process.env.DASHBOARD_SESSION_SECRET,
  },

  // STREAMS
  streams: {
    announceChannelId: process.env.STREAM_ANNOUNCE_CHANNEL_ID,
    checkIntervalsMs: Number(process.env.STREAM_CHECK_INTERVAL_MS) || 90000,
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      channels: parseList(process.env.TWITCH_CHANNELS),
    },
    youtube: {
      apiKey: process.env.YOUTUBE_API_KEY,
      channelIds: parseList(process.env.YOUTUBE_CHANNEL_IDS),
    },
    kick: {
      channels: parseList(process.env.KICK_CHANNELS),
    },
  },

  // MONITOR SERVIDOR
    mcMonitor: {
      alertChannelId: process.env.MC_MONITOR_ALERT_CHANNEL_ID,
      checkIntervalMs: Number(process.env.MC_MONITOR_CHECK_INTERVAL_MS) || 60_000,
      modalidades: [
        { nombre: "Bungee", host: process.env.MC_MODALIDAD_BUNGEE_HOST, port: Number(process.env.MC_MODALIDAD_BUNGEE_PORT) || 25565 },
        { nombre: "Prisión", host: process.env.MC_MODALIDAD_PRISION_HOST, port: Number(process.env.MC_MODALIDAD_PRISION_PORT) || 25565 },
        { nombre: "Survival", host: process.env.MC_MODALIDAD_SURVIVAL_HOST, port: Number(process.env.MC_MODALIDAD_SURVIVAL_PORT) || 25565 },
      ].filter((m) => m.host),
    },

  links: {
    img: process.env.IMG || "",
    support: process.env.SUPPORT || "https://discord.gg/9zzcvRqb3A",
    invite: process.env.INVITE || "",
  },
};