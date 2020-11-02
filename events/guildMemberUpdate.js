const { event } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";
const logchannel = "logs";

class guildmemberupdate extends event {
    constructor() {
        super("guildmemberupdate");
    }

    guildmemberupdate(oldMember, newMember) {
        if (oldMember.nickname != newMember.nickname) {
            let memberName = newMember.user.tag;
            let oldNickname = oldMember.nickname || "*none*";
            let newNickname = newMember.nickname || "*none*";

            let embed = new MessageEmbed()
                .setTitle("Nickname Changed")
                .setColor(embedColor)
                .addField("User", `${newMember} \`${newMember.user.tag}\``)
                .addField("Before", oldNickname, true)
                .addField("After", newNickname, true)
                .setFooter(`User ID: ${newMember.user.id}`)
                .setThumbnail(newMember.user.displayAvatarURL({ type: 'png', dynamic: true }));

            newMember.guild.channels.cache.find(channel => channel.name == lgochannel).send(embed);
        }
    }
}

module.exports = guildmemberupdate;
