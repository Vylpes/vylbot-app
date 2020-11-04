const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const randomPuppy = require('random-puppy');

const embedColor = "0x3050ba";

class bunny extends command {
    constructor() {
        super("bunny");
        super.description = "Gives you a random bunny";
        super.category = "Fun";
    }

    bunny(context) {
        randomPuppy('Rabbits').then(image => {
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setImage(image);

            context.message.channel.send(embed);
        });
    }
}

module.exports = bunny;