// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class unmute extends command {
    constructor() {
        // Set run method, description, category, usage
        super("unmute");
        super.description = "Unmutes the mentioned user with an optional reason";
        super.category = "Moderation";
        super.usage = "<@user> [reason]";

        // Set required configs
        super.requiredConfigs = "modrole";
        super.requiredConfigs = "logchannel";
        super.requiredConfigs = "muterole";
    }

    // The command's run method
    unmute(context) {
        // Check if the user has the mod role
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.mute.modrole)) {
            // Get the user first pinged in the message
            let user = context.message.mentions.users.first();

            // If the user object exists
            if (user) {
                // Get the guild member object from the pinged user
                let member = context.message.guild.member(user);

                // If the member object exists, i.e. if the user is in the server
                if (member) {
                    // Get the part of the argument array which contains the reason
                    let reasonArgs = context.arguments;
                    reasonArgs.splice(0, 1);

                    // Join the array into a string
                    let reason = reasonArgs.join(" ");

                    // If the server is available
                    if (context.message.guild.available) {
                        // If the bot client can manage the user
                        if (member.manageable) {
                            // The embed to go into the bot log
                            let embedLog = new MessageEmbed()
                                .setColor(embedColor)
                                .setTitle("Member Unmuted")
                                .addField("User", `${user} \`${user.tag}\``, true)
                                .addField("Moderator", `${context.message.author} \`${context.message.author.tag}\``, true)
                                .addField("Reason", reason || "*none*")
                                .setThumbnail(user.displayAvatarURL);

                            // The embed to go into the channel the command was sent in
                            let embedPublic = new MessageEmbed()
                                .setColor(embedColor)
                                .setDescription(`${user} has been unmuted`)
                                .addField("Reason", reason || "*none*");

                            // Get the muted role
                            let mutedRole = context.message.guild.roles.cache.find(role => role.name == context.client.config.unmute.muterole);

                            // Attempt to remove the role from the user, and then send the embeds. If unsuccessful log the error
                            member.roles.remove(mutedRole, reason).then(() => {
                                context.message.guild.channels.cache.find(channel => channel.name == context.client.config.unmute.logchannel).send(embedLog);
                                context.message.channel.send(embedPublic);

                                context.message.delete();
                            }).catch(err => {
                                errorEmbed(context, "An error occurred");
                                console.log(err);
                            });
                        } else { // If the bot can't manage the user
                            errorEmbed(context, "I am unable to unmute this user");
                        }
                    }
                } else { // If the member object doesn't exist
                    errorEmbed(context, "Please specify a valid user");
                }
            } else { // If the user object doesn't exist
                errorEmbed(context, "Please specify a valid user");
            }
        }
    }
}

// Send an embed in case of an error
function errorEmbed(context, message) {
    let embed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(message);

    context.message.channel.send(embed);
}

module.exports = unmute;
