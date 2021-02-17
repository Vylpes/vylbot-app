// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const { existsSync, readFileSync } = require('fs');

// Command Variables
const embedColor = "0x3050ba";

// Command class
class partner extends command {
    constructor() {
        // Set the command's run method, description, and category
        super("partner");
        super.description = "Generates the embeds for the partner from the partners.json file";
        super.category = "Admin";

        // Require in the config the name of the admin role and the rules file name
        super.requiredConfigs = "adminrole";
        super.requiredConfigs = "partnersfile";
    }

    // Run method
    partner(context) {
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.partner.adminrole)) {
            if (existsSync(context.client.config.partner.partnersfile)) {
                const partnerJson = JSON.parse(readFileSync(context.client.config.partner.partnersfile));

                for (const i in partnerJson) {
                    const serverName = partnerJson[i].name;
                    const serverInvite = partnerJson[i].invite;
                    const serverDescription = partnerJson[i].description;
                    const serverIcon = partnerJson[i].icon;

                    const embed = new MessageEmbed()
                        .setColor(embedColor)
                        .setTitle(serverName)
                        .setDescription(serverDescription)
                        .setURL(serverInvite)
                        .setThumbnail(serverIcon);

                    context.message.channel.send(embed);
                }
            } else {
                const errorEmbed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription('File does not exist');

                context.message.channel.send(errorEmbed);
            }
        } else {
            const errorEmbed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription('You do not have permission to run this command');

            context.message.channel.send(errorEmbed);
        }
    }
}

module.exports = partner;