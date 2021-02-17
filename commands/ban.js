// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class ban extends command {
    constructor() {
        // Set execution method, description, category, and usage
        super("ban");
        super.description =  "Bans the mentioned user with an optional reason";
        super.category = "Moderation";
        super.usage = "<@user> [reason]";

        // Set required configs in the config.ban json string
        super.requiredConfigs = "modrole";
        super.requiredCofigs = "logchannel";
    }

    // Command execution method
    ban(context) {
        // If the user has the modrole (set in config.ban.modrole)
        if (context.message.guild.roles.cache.find(role => role.name == context.client.config.ban.modrole)) {
            // Gets the user pinged in the command
            const user = context.message.mentions.users.first();

            // If the user pinged is a valid user
            if (user) {
                // Get the guild member object from the pinged user
                const member = context.message.guild.member(user);

                // If the member object exists, i.e. if they are in the server
                if (member) {
                    // Get the arguments and remove what isn't the reason
                    const reasonArgs = context.arguments;
                    reasonArgs.splice(0, 1);

                    // Join the array into a string
                    const reason = reasonArgs.join(" ");

                    // If the guild is available to work with
                    if (context.message.guild.available) {
                        // If the bot client is able to ban the member
                        if (member.bannable) {
                            // The Message Embed which goes into the bot log
                            const embedLog = new MessageEmbed()
                                .setTitle("Member Banned")
                                .setColor(embedColor)
                                .addField("User", `${user} \`${user.tag}\``, true)
                                .addField("Moderator", `${context.message.author} \`${context.message.author.tag}\``, true)
                                .addField("Reason", reason || "*none*")
                                .setThumbnail(user.displayAvatarURL);

                            // The Message Embed which goes into the public channel the message was sent in
                            const embedPublic = new MessageEmbed()
                                .setColor(embedColor)
                                .setDescription(`${user} has been banned`);

                            // Ban the member and send the embeds into the appropriate channel, then delete the initial message
                            member.ban({ reason: reason }).then(() => {
                                context.message.guild.channels.cache.find(channel => channel.name == context.client.config.ban.logchannel).send(embedLog);
                                context.message.channel.send(embedPublic);

                                context.message.delete();
                            }).catch(err => { // If the bot couldn't ban the member, say so and log the error to the console
                                errorEmbed(context, "An error occurred");
                                console.log(err);
                            });
                        }
                    }
                } else { // If the member object doesn't exist
                    errorEmbed(context, "User is not in this server");
                }
            } else { // If the user object doesn't exist
                errorEmbed(context, "User does not exist");
            }
        } else { // If the user doesn't have the mod role
            errorEmbed(context, `You require the \`${context.client.config.ban.modrole}\` role to run this command`);
        }
    }
}

// Post an error embed
function errorEmbed(context, message) {
    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(message);

    context.message.channel.send(embed);
}

module.exports = ban;
