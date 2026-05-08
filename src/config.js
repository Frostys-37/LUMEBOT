require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "TOKEN",
    clientID: process.env.CLIENT_ID || "920126102305902612",
    prefix: process.env.PREFIX || ".",
    ownerID: process.env.OWNERID || "793926625765883955",
    SpotifyID: process.env.SPOTIFYID || "5da62ce777644dcfa1f0d089354bac72",
    SpotifySecret: process.env.SPOTIFYSECRET || "4040fa03cd6d4feda2a0c2f518e3ce5f",
    mongourl: "mongodb+srv://frosty:NZHVlbycE1KVVwLf@lumecluster.vlt3igf.mongodb.net/?appName=LumeCluster", // MongoDb URL
    embedColor: process.env.COlOR || "Blurple", 
    logs: process.env.LOGS || "959908410936160336",
    links: {
        img: process.env.IMG || 'https://images-ext-1.discordapp.net/external/Ro-4EvLm5w8bDgvVbA6f2P0lqJEclpw_ra42F5lusm0/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/913869512279994369/8363d8ff10be7551255d4168634de973.png?width=584&height=584',
        support: process.env.SUPPORT || 'https://discord.gg/9zzcvRqb3A',
        invite: process.env.INVITE || 'https://discord.com/api/oauth2/authorize?client_id=920126102305902612&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fcallback&response_type=code&scope=bot%20applications.commands.permissions.update'
    },
    nodes: [
        {
            host: process.env.NODE_HOST || "lava.link",
            port: parseInt(process.env.NODE_PORT || "80"),
            password: process.env.NODE_PASSWORD || "NotJust",
            secure: parseBoolean(process.env.NODE_SECURE || "false"),

        }
    ],

}

function parseBoolean(value) {
    if (typeof (value) === 'string') {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}
