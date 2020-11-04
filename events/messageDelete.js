const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";
const logchannel = "logs";

class messagedelete extends event {
    constructor() {
        super("messagedelete");
    }

    messagedelete(message) {
        let embed = new MessageEmbed()
            .setTitle("Message Deleted")
            .setColor(embedColor)
            .addField("User", `${message.author} \`${message.author.tag}\``)
            .addField("Channel", message.channel)
            .addField("Content", `\`\`\`${message.content || "*none*"}\`\`\``)
            .setThumbnail(message.author.displayAvatarURL({ type: 'png', dynamic: true }));

        message.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = messagedelete;