// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class clear extends command {
    constructor() {
        // Set execute method, description, category, and usage
        super("clear");
        super.description = "Bulk deletes the chat for up to 100 messages";
        super.category = "Moderation";
        super.usage = "<amount>";

        // Set required configs in the config.clear json string
        super.requiredConfigs = "modrole";
        super.requiredConfigs = "logchannel";
    }

    // Execute method
    clear(context) {
        // If the user has the config.clear.modrole role
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.clear.modrole)) {
            // If the command specifies a number between 1 and 100
            if (context.arguments.length > 0 && context.arguments[0] > 0 && context.arguments[0] < 101) {
                // Attempt to bulk delete the amount of messages specified as an argument
                context.message.channel.bulkDelete(context.arguments[0]).then(() => {
                    // Public embed
                    const embed = new MessageEmbed()
                        .setColor(embedColor)
                        .setDescription(`${context.arguments[0]} messages were removed`);

                    // Send the embed into the channel the command was sent in
                    context.message.channel.send(embed);
                }).catch(err => { // If the bot couldn't bulk delete
                    errorEmbed(context, "An error has occurred");
                    console.log(err);
                });
            } else { // If the user didn't give a number valid (between 1 and 100)
                errorEmbed(context, "Please specify an amount between 1 and 100");
            }
        } else { // If the user doesn't have the mod role
            errorEmbed(context, `This command requires the \`${context.client.config.clear.modrole}\` role to run`);
        }
    }
}

// Function to send an error embed
function errorEmbed(context, message) {
    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(message);

    context.message.channel.send(embed);
}

module.exports = clear;
