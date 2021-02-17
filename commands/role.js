// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Command variables
const embedColor = "0x3050ba";

// Command class
class role extends command {
    constructor() {
        // Set the command's run method, description, category, and example usage
        super("role");
        super.description = "Toggles a role for the user to gain/remove";
        super.category = "General";
        super.usage = "[name]";

        // Require in the config the 'assignable roles' array
        super.requiredConfigs = "assignable";
    }

    // Run method
    role(context) {
        // Get the array containing the assignable roles
        const roles = context.client.config.role.assignable;
        let requestedRole = "";

        // If the arguments specifys a specific role
        if (context.arguments.length > 0) {
            // Loop through all the assignable roles and check against the first parameter
            // Save the role name if they match, i.e. the role can be assignable
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].toLowerCase() == context.arguments[0].toLowerCase()) {
                    requestedRole = roles[i];
                }
            }

            // If a matching assignable role was found
            if (requestedRole != "") {
                // Get the role object from the server with the role name
                const role = context.message.guild.roles.cache.find(r => r.name == requestedRole);

                // If the user already has the role, remove the role from them and send an embed
                // Otherwise, add the role and send an embed
                if (context.message.member.roles.cache.find(r => r.name == requestedRole)) {
                    context.message.member.roles.remove(role).then(() => {
                        const embed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription(`Removed role: ${requestedRole}`);

                        context.message.channel.send(embed);
                    }).catch(err => {
                        console.error(err);

                        const errorEmbed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription("An error occured. Please check logs");

                        context.message.channel.send(errorEmbed);
                    });
                } else { // If the user doesn't have the role
                    context.message.member.roles.add(role).then(() => {
                        const embed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription(`Gave role: ${requestedRole}`);

                        context.message.channel.send(embed);
                    }).catch(err => {
                        console.error(err);

                        const errorEmbed = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription("An error occured. Please check logs");

                        context.message.channel.send(errorEmbed);
                    });
                }
            } else { // If the role can't be found, send an error embed
                const embed = new MessageEmbed()
                    .setColor(embedColor)
                    .setDescription("This role does not exist, see assignable roles with the role command (no arguments)");

                context.message.channel.send(embed);
            }
        } else { // If no role was specified, Send a list of the roles you can assign
            // The start of the embed text
            let rolesString = `Do ${context.client.config.prefix}role <role> to get the role!\n`;

            // Loop through all the roles, and add them to the embed text
            for (let i = 0; i < roles.length; i++) {
                rolesString += `${roles[i]}\n`;
            }

            // Create an embed containing the text
            const embed = new MessageEmbed()
                .setTitle("Roles")
                .setColor(embedColor)
                .setDescription(rolesString);

            // Send the embed
            context.message.channel.send(embed);
        }
    }
}

module.exports = role;
