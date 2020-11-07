// Required components
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
        super.category = "Administration";

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
                // Get the contents of the rules file, and split it by "> "
                // Each embed in the rules is set by the "> " syntax
                let rulesText = readFileSync(context.client.config.rules.rulesfile).toString();
                rulesText = rulesText.split("> ");

                // Loop through each embed to be sent
                for (let i = 0; i < rulesText.length; i++) {
                    // If the first line after "> " has a "#", create and embed with an image of the url specified after
                    if (rulesText[i].charAt(0) == '#') {
                        let embed = new MessageEmbed()
                            .setColor(embedColor)
                            .setImage(rulesText[i].substring(1));

                        context.message.channel.send(embed);
                    } else { // If the file doesn't have a "#" at the start
                        // Split the embed into different lines, set the first line as the title, and the rest as the description
                        let rulesLines = rulesText[i].split("\n");
                        let rulesTitle = rulesLines[0];
                        let rulesDescription = rulesLines.slice(1).join("\n");

                        // Create the embed with the specified information above
                        let embed = new MessageEmbed()
                            .setTitle(rulesTitle)
                            .setColor(embedColor)
                            .setDescription(rulesDescription);

                        // Send the embed
                        context.message.channel.send(embed);
                    }
                }
            } else { // If the rules file doesn't exist
                let errorEmbed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription(`${context.client.config.rules.rulesfile} doesn't exist`);

                context.message.channel.send(errorEmbed);
            }
        } else { // If the user doesn't have the Admin role
            let errorEmbed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription("You do not have permission to run this command");

            context.message.channel.send(errorEmbed);
        }
    }
}

module.exports = rules;
