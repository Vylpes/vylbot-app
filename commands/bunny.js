// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const randomBunny = require('random-bunny');

// Command variables
const embedColor = "0x3050ba";

// Command class
class bunny extends command {
    constructor() {
        // Set run method, description, and category
        super("bunny");
        super.description = "Gives you a random bunny";
        super.category = "Fun";
    }

    // Run method
    bunny(context) {
        // Get a random post from r/Rabbits
        randomBunny('rabbits', 'hot', (image, title) => {
            // Create an embed containing the random image
            const embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle(title)
                .setImage(image)
                .setFooter('r/Rabbits');

            // Send the embed
            context.message.channel.send(embed);
        });
    }
}

module.exports = bunny;
