// Required components
const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Event variables
const embedColor = "0x3050ba";
const logchannel = "logs";

// Event class
class guildmemberadd extends event {
    constructor() {
        // Set the event's run method
        super("guildmemberadd");
    }

    // Run method
    guildmemberadd(member) {
        // Create an embed with the user who joined's information
        let embed = new MessageEmbed()
            .setTitle("Member Joined")
            .setColor(embedColor)
            .addField("User", `${member} \`${member.user.tag}\``)
            .addField("Created", `${member.user.createdAt}`)
            .setFooter(`User ID: ${member.user.id}`)
            .setThumbnail(member.user.displayAvatarURL({ type: 'png', dynamic: true }));

        // Send the embed in the mod's log channel
        member.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = guildmemberadd;
