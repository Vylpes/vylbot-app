// Required Components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class mute extends command {
    constructor() {
        // Set the command's run method, description, category, and usage
        super("mute");
        super.description = "Mutes the mentioned user with an optional reason";
        super.category = "Moderation";
        super.usage = "<@user> [reason]";

        // Set the required configs for the command
        super.requiredConfigs = "modrole";
        super.requiredConfigs = "logchannel";
        super.requiredConfigs = "muterole";
    }

    // The command's run method
    mute(context) {
        // Check if the user has the mod role
        if (context.message.member.roles.cache.find(role => role.name == context.client.config.mute.modrole)) {
            // Get the user first pinged in the message
            let user = context.message.mentions.users.first();

            // If the user object exists
            if (user) {
                // Get the guild member object of the mentioned user
                let member = context.message.guild.member(user);

                // If the member object exists, i.e. if the user is in the server
                if (member) {
                    // Get the part of the arguments array which contains the reason
                    let reasonArgs = context.arguments;
                    reasonArgs.splice(0, 1);

                    // Join the reason into a string
                    let reason = reasonArgs.join(" ");

                    // If the server is available
                    if (context.message.guild.available) {
                        // If the bot client can manage the user's roles
                        if (member.manageable) {
                            // The embed to go into the bot log
                            let embedLog = new MessageEmbed()
                                .setTitle("Member Muted")
                                .setColor(embedColor)
                                .addField("User", `${user} \`${user.tag}\``, true)
                                .addField("Moderator", `${context.message.author} \`${context.message.author.tag}\``, true)
                                .addField("Reason", reason || "*none*")
                                .setThumbnail(user.displayAvatarURL);

                            // The embed to go into the channel the command was sent in
                            let embedPublic = new MessageEmbed()
                                .setColor(embedColor)
                                .setDescription(`${user} has been muted`)
                                .addField("Reason", reason || "*none*");

                            // Get the 'Muted' role
                            let mutedRole = context.message.guild.roles.cache.find(role => role.name == context.client.config.mute.muterole);

                            // Attempt to mute the user, if successful send the embeds, if not log the error
                            member.roles.add(mutedRole, reason).then(() => {
                                context.message.guild.channels.cache.find(channel => channel.name == context.client.config.mute.logchannel).send(embedLog);
                                context.message.channel.send(embedPublic);

                                context.message.delete();
                            }).catch(err => {
                                errorEmbed(context, "An error occurred");
                                console.log(err);
                            });
                        } else { // If the bot can't manage the user
                            errorEmbed(context, "I am unable to mute this user");
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

// Send an embed when an error occurs
function errorEmbed(context, message) {
    let embed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(message);

    context.message.channel.send(embed);
}

module.exports = mute;
