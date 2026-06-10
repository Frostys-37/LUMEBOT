require("dotenv").config();
const required = ['TOKEN', 'MONGO_URI', 'CLIENT_ID'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta variable de entorno: ${key}`);
}

module.exports = {
    token: process.env.TOKEN,
    mongourl: process.env.MONGO_URI,
    clientID: process.env.CLIENT_ID,
    prefix: "/",
    ownerID: process.env.devID || "793926625765883955",
    embedColor: "Blurple", 
    logs: process.env.LOGS || "1065322630980321422",
    links: {
        img: process.env.IMG || "https://images-ext-1.discordapp.net/external/Ro-4EvLm5w8bDgvVbA6f2P0lqJEclpw_ra42F5lusm0/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/913869512279994369/8363d8ff10be7551255d4168634de973.png?width=584&height=584",
        support: process.env.SUPPORT || 'https://discord.gg/9zzcvRqb3A',
        invite: process.env.INVITE || 'https://discord.com/api/oauth2/authorize?client_id=920126102305902612&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fcallback&response_type=code&scope=bot%20applications.commands.permissions.update'
    }
}

function parseBoolean(value) {
    if (typeof value === 'string') {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case 'true':
            return true;
        default:
            return false;
    }
}