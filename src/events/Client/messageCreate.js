const { EmbedBuilder, Message, Client, PermissionsBitField } = require("discord.js");
let xp = require("simply-xp")
const config = require("../../config.js")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    run: async (client, message) => {

        if (message.author.bot) return;
        if(!message.guild) return;

        const random = Math.floor(Math.random() * 149) + 1
        xp.addXP(message, message.author.id, message.guild.id, random)

        const prefix = "/";
       
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            const embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**› Mi prefix es: /**\n**›. Puedes ver todos mis comandos usando: /help**`);
            message.channel.send({ embeds: [embed] })
        };
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        const [matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('SendMessages'))) return await message.author.dmChannel.send({ content: `No tengo el permiso: **\`SEND_MESSAGES\`** en: <#${message.channelId}> para ejecutar este comando: **\`${command.name}\`**.` }).catch(() => { });

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('ViewChannel'))) return;

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('EmbedLinks'))) return await message.channel.send({ content: `No tengo el permiso: **\`EMBED_LINKS\`** en <#${message.channelId}> para ejecutar este comando: **\`${command.name}\`**.` }).catch(() => { });

        const embed = new EmbedBuilder()
            .setColor('Blurple')

        if (command.args && !args.length) {
            let reply = `No has dado ningún argumento, ${message.author}!`;

            if (command.usage) {
                reply += `\nUsa: /${command.name} ${command.usage}\``;
            }

            embed.setDescription(reply);
            return message.channel.send({ embeds: [embed] });
        }

        if (command.botPerms) {
            if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                embed.setDescription(`No tengo el permiso: **\`${command.botPerms}\`** en: <#${message.channelId}> para ejecutar este comando: **\`${command.name}\`**.`);
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (command.userPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                embed.setDescription(`No tienes el permiso: **\`${command.userPerms}\`** en: <#${message.channelId}> para ejecutar este comando: **\`${command.name}\`**.`);
                return message.channel.send({ embeds: [embed] });
            }
        }

        if (command.owner && message.author.id !== `${client.owner}`) {
            embed.setDescription("Solo <@793926625765883955> puede usar este comando.");
            return message.channel.send({ embeds: [embed] });
        }

        const player = message.client.manager.get(message.guild.id);

        if (command.player && !player) {
            embed.setDescription("Este usuario no esta en el servidor.");
            return message.channel.send({ embeds: [embed] });
        }

        if (command.inVoiceChannel && !message.member.voice.channelId) {
            embed.setDescription("Tienes que estar en un canal de voz.");
            return message.channel.send({ embeds: [embed] });
        }

        if (command.sameVoiceChannel) {
            if (message.guild.members.me.voice.channel) {
                if (message.guild.members.me.voice.channelId !== message.member.voice.channelId) {
                    embed.setDescription(`Tienes que estar en mi mismo canal ${message.client.user}.`);
                    return message.channel.send({ embeds: [embed] });
                }
            }
        }

        try {
            command.execute(message, args, client);
        } catch (error) {
            console.log(error);
            embed.setDescription("Ha ocurrido un error con este comando.\nHe contactado con mi dev para solucionarlo!.");
            return message.channel.send({ embeds: [embed] });
        }
    }
};
