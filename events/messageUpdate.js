const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";
const logchannel = "logs";

class messageupdate extends event {
    constructor() {
        super("messageupdate");
    }

    messageupdate(oldMessage, newMessage) {
        if (newMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;

        let embed = new MessageEmbed()
            .setTitle("Message Embed")
            .setColor(embedColor)
            .addField("User", `${newMessage.author} \`${newMessage.author.tag}\``)
            .addField("Channel", newMessage.channel)
            .addField("Before", `\`\`\`${oldMessage.content || "*none*"}\`\`\``)
            .addField("After", `\`\`\`${newMessage.content || "*none*"}\`\`\``)
            .setThumbnail(newMessage.author.displayAvatarURL({ type: 'png', dynamic: true }));

        newMessage.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = messageupdate;