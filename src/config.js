require("dotenv").config();

const required = ["TOKEN", "MONGO_URI", "CLIENT_ID"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta variable de entorno: ${key}`);
}

const parseList = (value) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : []);

module.exports = {
  token: process.env.TOKEN,
  mongourl: process.env.MONGO_URI,
  clientID: process.env.CLIENT_ID,
  prefix: "/",
  ownerID: process.env.OWNER_ID,
  embedColor: process.env.EMBED_COLOR || "Blurple",
  logs: process.env.LOGS || "1065322630980321422",

  guildIds: parseList(process.env.GUILD_IDS),

  modLogChannelId: process.env.MOD_LOG_CHANNEL_ID,
  sanctionLogChannelId: process.env.SANCTION_LOG_CHANNEL_ID,
  reportStaffChannelId: process.env.REPORT_STAFF_CHANNEL_ID,
  suggestionsChannelId: process.env.SUGGESTIONS_CHANNEL_ID,
  videoStaffChannelId: process.env.VIDEO_STAFF_CHANNEL_ID,
  videoPublicChannelId: process.env.VIDEO_PUBLIC_CHANNEL_ID,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  memberRoleId: process.env.MEMBER_ROLE_ID,

  ticketPanelChannelId: process.env.TICKET_PANEL_CHANNEL_ID,
  ticketOpenCategoryId: process.env.TICKET_OPEN_CATEGORY_ID,
  ticketClosedCategoryId: process.env.TICKET_CLOSED_CATEGORY_ID,
  ticketTranscriptChannelId: process.env.TICKET_TRANSCRIPT_CHANNEL_ID,
  ticketStaffRoleIds: parseList(process.env.TICKET_STAFF_ROLE_IDS),

  staffBypassIds: parseList(process.env.STAFF_BYPASS_IDS),

  //DASHBOARD
  dashboard: {
    port: process.env.DASHBOARD_PORT || 8080,
    url: process.env.DASHBOARD_URL || "http://localhost:8080",
    guildId: process.env.DASHBOARD_GUILD_ID || "793492909189365761",
    ClientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET || "",
    sessionSecret: process.env.DASHBOARD_SESSION_SECRET || "5e3f8c9a-1b2c-4d6e-9f3a-2b1c4d5e6f7g",
  },

  links: {
    img: process.env.IMG || "",
    support: process.env.SUPPORT || "https://discord.gg/9zzcvRqb3A",
    invite: process.env.INVITE || "",
  },
};