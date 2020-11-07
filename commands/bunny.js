// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const randomPuppy = require('random-puppy');

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
        randomPuppy('Rabbits').then(image => {
            // Create an embed containing the random image
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setImage(image);

            // Send the embed
            context.message.channel.send(embed);
        });
    }
}

module.exports = bunny;
