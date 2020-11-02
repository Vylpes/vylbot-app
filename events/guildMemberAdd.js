const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";
const logchannel = "logs";

class guildmemberadd extends event {
    constructor() {
        super("guildmemberadd");
    }

    guildmemberadd(member) {
        let embed = new MessageEmbed()
            .setTitle("Member Joined")
            .setColor(embedColor)
            .addField("User", `${member} \`${member.user.tag}\``)
            .addField("Created", `${member.user.createdAt}`)
            .setFooter(`User ID: ${member.user.id}`)
            .setThumbnail(member.user.displayAvatarURL({ type: 'png', dynamic: true }));

        member.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = guildmemberadd;
