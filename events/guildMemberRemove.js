const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";
const logchannel = "logs";

class guildmemberremove extends event {
    constructor() {
        super("guildmemberremove");
    }

    guildmemberremove(member) {
        let embed = new MessageEmbed()
            .setTitle("Member Left")
            .setColor(embedColor)
            .addField("User", `${member} \`${member.user.tag}\``)
            .addField("Joined", `${member.joinedAt}`)
            .setFooter(`User ID: ${member.user.id}`)
            .setThumbnail(member.user.displayAvatarURL({ type: 'png', dynamic: true }));

        member.guild.channels.cache.find(channel => channel.name == logchannel).send(embed);
    }
}

module.exports = guildmemberremove;
