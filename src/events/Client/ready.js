const { prefix } = require("../../config.js");
const { Activity } = require("discord.js");

module.exports ={
name: "ready",
run: async (client) => {
    client.manager.init(client.user.id);
    client.logger.log(`${client.user.username} en linea!`, "ready");
    client.logger.log(`Sirviendo en: ${client.guilds.cache.size} servidores, y un total de: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} usuarios`, "ready");

    let statuses = ['/help', `Prefix ${prefix}`];
    setInterval(function() {
  		let status = statuses[Math.floor(Math.random()*statuses.length)];
  		client.user.setActivity(status, {type: Activity.Playing});
  	}, 10000)
 }
}
