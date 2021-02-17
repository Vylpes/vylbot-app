// Required components
const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Event variables
const embedColor = "0x3050ba";
const logchannel = "member-logs";

// Event class
class guildmemberremove extends event {
    constructor() {
        // Set the event's run method
        super("guildmemberremove");
    }

    // Run method
    guildmemberremove(member) {
        // Create an embed with the user's information
        const embed = new MessageEmbed()
            .setTitle("Member Left")
            .setColor(embedColor)
            .addField("User", `${member} \`${member.user.tag}\``)
            .addField("Joined", `${member.joinedAt}`)
            .setFooter(`User ID: ${member.user.id}`)
            .setThumbnail(member.user.displayAvatarURL({ type: 'png', dynamic: true }));

        // Send the embed in the log channel
        member.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = guildmemberremove;
