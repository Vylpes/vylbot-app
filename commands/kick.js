// Required Components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class kick extends command {
    constructor() {
        // Sets the command's run method, description, category, and usage
        super("kick");
        super.description = "Kicks the mentioned user with an optional reason";
        super.category = "Moderation";
        super.usage = "<@user> [reason]";
        
        // Sets the required configs for the command
        super.requiredConfigs = "modrole";
        super.requiredConfigs = "logchannel";
    }

    // The command's run method
    kick(context) {
        // Checks if the user has the mod role, set in the config json string
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.kick.modrole)) {
            // Gets the first user pinged in the command
            const user = context.message.mentions.users.first();

            // If a user was pinged
            if (user) {
                // Gets the guild member object of the pinged user
                const member = context.message.guild.member(user);

                // If the member object exists, i.e if the user is in the server
                if (member) {
                    // Gets the part of the argument array which holds the reason
                    const reasonArgs = context.arguments;
                    reasonArgs.splice(0, 1);

                    // Joins the reason into a string
                    const reason = reasonArgs.join(" ");

                    // If the server is available
                    if (context.message.guild.available) {
                        // If the bot client can kick the mentioned member
                        if (member.kickable) {
                            // The embed to go into the bot log
                            const embedLog = new MessageEmbed()
                                .setTitle("Member Kicked")
                                .setColor(embedColor)
                                .addField("User", `${user} \`${user.tag}\``, true)
                                .addField("Moderator", `${context.message.author} \`${context.message.author.tag}\``, true)
                                .addField("Reason", reason || "*none*")
                                .setThumbnail(user.displayAvatarURL);

                            // The embed to go into channel the command was sent in
                            const embedPublic = new MessageEmbed()
                                .setColor(embedColor)
                                .setDescription(`${user} has been kicked`);

                            // Attemtp to kick the user, if successful send the embeds, if unsuccessful notify the chat and log the error
                            member.kick({ reason: reason }).then(() => {
                                context.message.guild.channels.cache.find(channel => channel.name == context.client.config.kick.logchannel).send(embedLog);
                                context.message.channel.send(embedPublic);

                                context.message.delete();
                            }).catch(err => {
                                errorEmbed(context, "An error has occurred");
                                console.log(err);
                            });
                        } else { // If the user isn't kickable
                            errorEmbed(context, "I am unable to kick this user");
                        }
                    }
                } else { // If the member object is invalid
                    errorEmbed(context, "Please specify a valid user");
                }
            } else { // If the user object is invalid
                errorEmbed(context, "Please specify a valid user");
            }
        }
    }
}

// Function to post an embed in case of an error
function errorEmbed(context, message) {
    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(message);

    context.message.channel.send(embed);
}

module.exports = kick;
