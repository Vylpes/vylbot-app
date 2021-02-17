// Required components
const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Event variables
const embedColor = "0x3050ba";
const logchannel = "message-logs";

// Event class
class messageupdate extends event {
    constructor() {
        // Set the event's run method
        super("messageupdate");
    }

    // Run method
    messageupdate(oldMessage, newMessage) {
        // If the user is a bot or the content didn't change, return
        if (newMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;

        // Create an embed with the message's information
        const embed = new MessageEmbed()
            .setTitle("Message Edited")
            .setColor(embedColor)
            .addField("User", `${newMessage.author} \`${newMessage.author.tag}\``)
            .addField("Channel", newMessage.channel)
            .addField("Before", `\`\`\`${oldMessage.content || "*none*"}\`\`\``)
            .addField("After", `\`\`\`${newMessage.content || "*none*"}\`\`\``)
            .setThumbnail(newMessage.author.displayAvatarURL({ type: 'png', dynamic: true }));

        // Send the embed into the log channel
        newMessage.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = messageupdate;
