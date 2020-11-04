const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const { existsSync, readFileSync } = require('fs');

const embedColor = "0x3050ba";

class rules extends command {
    constructor() {
        super("rules");
        super.description = "Generates the rules embeds from the rules.txt file";
        super.category = "Administration";

        super.requiredConfigs = "adminrole";
        super.requiredConfigs = "rulesfile";
    }

    rules(context) {
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.rules.adminrole)) {
            if (existsSync(context.client.config.rules.rulesfile)) {
                let rulesText = readFileSync(context.client.config.rules.rulesfile).toString();
                rulesText = rulesText.split("> ");

                for (let i = 0; i < rulesText.length; i++) {
                    if (rulesText[i].charAt(0) == '#') {
                        let embed = new MessageEmbed()
                            .setColor(embedColor)
                            .setImage(rulesText[i].substring(1));

                        context.message.channel.send(embed);
                    } else {
                        let rulesLines = rulesText[i].split("\n");
                        let rulesTitle = rulesLines[0];
                        let rulesDescription = rulesLines.slice(1).join("\n");

                        let embed = new MessageEmbed()
                            .setTitle(rulesTitle)
                            .setColor(embedColor)
                            .setDescription(rulesDescription);

                        context.message.channel.send(embed);
                    }
                }
            } else {
                let errorEmbed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription(`${context.client.config.rules.rulesfile} doesn't exist`);

                context.message.channel.send(errorEmbed);
            }
        } else {
            let errorEmbed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription("You do not have permission to run this command");

            context.message.channel.send(errorEmbed);
        }
    }
}

module.exports = rules;