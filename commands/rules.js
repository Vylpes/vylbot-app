// Required Components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const { existsSync, readFileSync } = require('fs');

// Command variables
const embedColor = "0x3050ba";

// Command class
class rules extends command {
    constructor() {
        // Set the command's run method, description, and category
        super("rules");
        super.description = "Generates the rules embeds from the rules.txt file";
        super.category = "Admin";

        // Require in the config the name of the admin role and the rules file name
        super.requiredConfigs = "adminrole";
        super.requiredConfigs = "rulesfile";
    }

    // Run method
    rules(context) {
        // If the user is an Admin (has the admin role)
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.rules.adminrole)) {
            // If the rulesfile exists
            if (existsSync(context.client.config.rules.rulesfile)) {
                const rulesJson = readFileSync(context.client.config.rules.rulesfile);
                const rules = JSON.parse(rulesJson);

                for (let i = 0; i < rules.length; i++) {
                    const rule = rules[i];
                    const embed = new MessageEmbed();

                    embed.setColor(embedColor);

                    if (rule.image) embed.setImage(rule.image);
                    if (rule.title) embed.setTitle(rule.title);
                    if (rule.footer) embed.setFooter(rule.footer);
                    if (rule.description) {
                        let description = "";

                        for (let j = 0; j < rule.description.length; j++) {
                            const line = rule.description[j];
                            description += `${line}\n`;
                        }

                        embed.setDescription(description);
                    }

                    context.message.channel.send(embed);
                }
            } else { // If the rules file doesn't exist
                const errorEmbed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription(`${context.client.config.rules.rulesfile} doesn't exist`);

                context.message.channel.send(errorEmbed);
            }
        } else { // If the user doesn't have the Admin role
            const errorEmbed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription("You do not have permission to run this command");

            context.message.channel.send(errorEmbed);
        }
    }
}

module.exports = rules;
