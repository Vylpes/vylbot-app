// Required Components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class warn extends command {
    constructor() {
        // Set the run method, description, category, and usage
        super("warn");
        super.description = "Warns the mentioned user with an optional reason";
        super.category = "Moderation";
        super.usage = "<@user> [reason]";

        // Set the required configs
        super.requiredConfigs = "modrole";
        super.requiredConfigs = "logchannel";
    }

    // The command's run method
    warn(context) {
        // If the user has the mod role
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.warn.modrole)) {
            // Get the user first pinged in the message
            const user = context.message.mentions.users.first();

            // If the user object exists
            if (user) {
                // Get the guild member object from the user
                const member = context.message.guild.member(user);

                // If the member object exists. i.e. if the user is in the server
                if (member) {
                    // Get the part of the argument array which the reason is in
                    const reasonArgs = context.arguments;
                    reasonArgs.splice(0, 1);

                    // Join the array into a string
                    const reason = reasonArgs.join(" ");

                    // If the server is available
                    if (context.message.guild.available) {
                        // The embed to go into the bot log
                        const embedLog = new MessageEmbed()
                            .setColor(embedColor)
                            .setTitle("Member Warned")
                            .addField("User", `${user} \`${user.tag}\``, true)
                            .addField("Moderator", `${context.message.author} \`${context.message.author.tag}\``, true)
                            .addField("Reason", reason || "*none*")
                            .setThumbnail(user.displayAvatarURL);

                        // The embed to go into the channel the command was sent in
                        const embedPublic = new MessageEmbed()
                            .setColor(embedColor)
                            .setDescription(`${user} has been warned`)
                            .addField("Reason", reason || "*none*");

                        // Send the embeds
                        context.message.guild.channels.cache.find(channel => channel.name == context.client.config.warn.logchannel).send(embedLog);
                        context.message.channel.send(embedPublic);

                        context.message.delete();
                    }
                } else { // If the member objest doesn't exist
                    errorEmbed(context, "Please specify a valid user");
                }
            } else { // If the user object doesn't exist
                errorEmbed(context, "Please specify a valid user");
            }
        } else { // If the user isn't mod
            errorEmbed(context, "You do not have permission to run this command");
        }
    }
}

// Send an embed in case of an error
function errorEmbed(context, message) {
    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(message);

    context.message.channel.send(embed);
}

module.exports = warn;
