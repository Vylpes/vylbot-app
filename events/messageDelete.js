// Required components
const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Event variables
const embedColor = "0x3050ba";
const logchannel = "logs";

// Event class
class messagedelete extends event {
    constructor() {
        // The event's run method
        super("messagedelete");
    }

    // Run method
    messagedelete(message) {
        // Create an embed with the message's information
        let embed = new MessageEmbed()
            .setTitle("Message Deleted")
            .setColor(embedColor)
            .addField("User", `${message.author} \`${message.author.tag}\``)
            .addField("Channel", message.channel)
            .addField("Content", `\`\`\`${message.content || "*none*"}\`\`\``)
            .setThumbnail(message.author.displayAvatarURL({ type: 'png', dynamic: true }));

        // Send the embed in the logging channel
        message.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = messagedelete;
