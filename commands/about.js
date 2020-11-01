// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

// Command Class
class about extends command {
    constructor() {
        // Set execute method, description, and category
        super("about");
        super.description = "About the bot";
        super.category = "General";

        // Set required configs in the config.about json string.
        // description: The bot description
        // version: The bot version
        // author: Bot author
        // date: Date of build
        super.requiredConfigs = "description";
        super.requiredConfigs = "version";
        super.requiredConfigs = "author";
        super.requiredConfigs = "date";
    }

    // The execution method
    about(context) {
        // Create an embed containing data about the bot
        let embed = new MessageEmbed()
            .setTitle("About")
            .setColor(embedColor)
            .setDescription(context.client.config.about.description)
            .addField("Version", context.client.config.about.version)
            .addField("Author", context.client.config.about.author)
            .addField("Date", context.client.config.about.date);

        // Send embed to the channel the command was sent in
        context.message.channel.send(embed);
    }
}

// Set the about class to be exported
module.exports = about;
