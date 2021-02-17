// Required components
const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Event variables
const embedColor = "0x3050ba";
const logchannel = "member-logs";

// Event class
class guildmemberupdate extends event {
    constructor() {
        // Set the event's run method
        super("guildmemberupdate");
    }

    // Run method
    guildmemberupdate(oldMember, newMember) {
        // If the user's nickname was changed
        if (oldMember.nickname != newMember.nickname) {
            // Get the user's name with tag, their old nickname and their new nickname
            // If they didn't have a nickname or they removed it, set it to "none" in italics
            const oldNickname = oldMember.nickname || "*none*";
            const newNickname = newMember.nickname || "*none*";

            // Create the embed with the user's information
            const embed = new MessageEmbed()
                .setTitle("Nickname Changed")
                .setColor(embedColor)
                .addField("User", `${newMember} \`${newMember.user.tag}\``)
                .addField("Before", oldNickname, true)
                .addField("After", newNickname, true)
                .setFooter(`User ID: ${newMember.user.id}`)
                .setThumbnail(newMember.user.displayAvatarURL({ type: 'png', dynamic: true }));

            // Send the embed in the log channel
            newMember.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
        }
    }
}

module.exports = guildmemberupdate;
