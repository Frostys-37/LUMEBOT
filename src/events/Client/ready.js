const { Activity } = require("discord.js");

module.exports ={
name: "clientReady",
run: async (client) => {
    client.logger.log(`${client.user.username} en linea!`, "ready");
    client.logger.log(`Sirviendo a: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} usuarios`, "ready");

    let statuses = ['/help', `prefix /`, `en mc.lumecraft.net`];
    setInterval(function() {
  		let status = statuses[Math.floor(Math.random()*statuses.length)];
  		client.user.setActivity(status, {type: Activity.Playing});
  	}, 10000)
 }
}
