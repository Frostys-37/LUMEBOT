const LUMEBOT = require("./structures/Client");
const Discord = require("discord.js")
const client = new LUMEBOT();

client.connect()

process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isSelectMenu());
    let _commands;
    let editEmbed = new Discord.EmbedBuilder();

    if(interaction.customId === 'helped') {

        if(interaction.values[0] === "config") {
            const commands = client.slashCommands.filter((cmd) => cmd.category && cmd.category === "Config").map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
            editEmbed.setColor(client.embedColor).setDescription(`${commands.join("\n")}`).setTitle("Comandos de Configuración").setFooter({text: `HelpCommand.`})
            await interaction.update({ embeds: [editEmbed] })
        } 
    
        if(interaction.values[0] === 'info'){
            const commands = client.slashCommands.filter((cmd) => cmd.category && cmd.category === "Information").map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
            editEmbed.setColor(client.embedColor).setDescription(`${commands.join("\n")}`).setTitle("Comandos de Información").setFooter({text: `HelpCommand.`})
            await interaction.update({ embeds: [editEmbed] })
        } 
        if(interaction.values[0] === 'mod'){
            const commands = client.slashCommands.filter((cmd) => cmd.category && cmd.category === "Moderation").map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
            editEmbed.setColor(client.embedColor).setDescription(`${commands.join("\n")}`).setTitle("Comandos de Moderación").setFooter({text: `HelpCommand.`})
            await interaction.update({ embeds: [editEmbed] })

        } 
        if(interaction.values[0] === 'music'){
            const commands = client.slashCommands.filter((cmd) => cmd.category && cmd.category === "Music").map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
            editEmbed.setColor(client.embedColor).setDescription(`${commands.join("\n")}`).setTitle("Comandos de Musica").setFooter({text: `HelpCommand.`})
            await interaction.update({ embeds: [editEmbed] })

        }
        if(interaction.values[0] === 'plays'){
            const commands = client.slashCommands.filter((cmd) => cmd.category && cmd.category === "Playlist").map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
            editEmbed.setColor(client.embedColor).setDescription(`${commands.join("\n")}`).setTitle("Comandos de Playlist").setFooter({text: `HelpCommand.`})
            await interaction.update({ embeds: [editEmbed] })

        }
        if(interaction.values[0] === 'util'){
            const commands = client.slashCommands.filter((cmd) => cmd.category && cmd.category === "Utility").map((cmd) => `> \`${cmd.name}\` - *${cmd.description}*`);
            editEmbed.setColor(client.embedColor).setDescription(`${commands.join("\n")}`).setTitle("Comandos de Utilidad").setFooter({text: `HelpCommand.`})
            await interaction.update({ embeds: [editEmbed] })

        }
    }



});



module.exports = client;
