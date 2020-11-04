const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

class role extends command {
    constructor() {
        super("role");
        super.description = "Toggles a role for the user to gain/remove";
        super.category = "General";
        super.usage = "[name]";

        super.requiredConfigs = "assignable";
    }

    role(context) {
        let roles = context.client.config.role.assignable;
        let requestedRole = "";

        if (context.arguments.length > 0) {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].toLowerCase() == context.arguments[0].toLowerCase()) {
                    requestedRole = roles[i];
                }
            }

            if (requestedRole != "") {
                let role = context.message.guild.roles.cache.find(r => r.name == requestedRole);

                if (context.message.member.roles.cache.find(r => r.name == requestedRole)) {
                    context.message.member.roles.remove(role).then(() => {
                        let embed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription(`Removed role: ${requestedRole}`);

                        context.message.channel.send(embed);
                    }).catch(err => {
                        console.error(err);

                        let errorEmbed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription("An error occured. Please check logs");

                        context.message.channel.send(errorEmbed);
                    });
                } else {
                    context.message.member.roles.add(role).then(() => {
                        let embed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription(`Gave role: ${requestedRole}`);

                        context.message.channel.send(embed);
                    }).catch(err => {
                        console.error(err);

                        let errorEmbed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription("An error occured. Please check logs");

                        context.message.channel.send(errorEmbed);
                    });
                }
            } else {
                let embed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription("This role does not exist, see assignable roles with the role command (no arguments)");

                context.message.channel.send(embed);
            }
        } else {
            let rolesString = `Do ${context.client.config.prefix}role <role> to get the role!\n`;

            for (let i = 0; i < roles.length; i++) {
                rolesString += `${roles[i]}\n`;
            }

            let embed = new MessageEmbed()
                .setTitle("Roles")
                .setColor(embedColor)
                .setDescription(rolesString);

            context.message.channel.send(embed);
        }
    }
}

module.exports = role;