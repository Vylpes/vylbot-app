const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

const embedColor = "0x3050ba";

class poll extends command {
    constructor() {
        super("poll");
        super.description = "Generates a poll with reaction numbers";
        super.category = "General";
        super.usage = "<title>;<option 1>;<option 2>...";
    }

    poll(context) {
        let args = context.arguments;
        let argsJoined = args.join(' ');
        args = argsJoined.split(';');

        if (args.length >= 3 && args.length < 11) {
            let title = args[0];
            let optionString = "";

            let arrayOfNumbers = [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine'
            ];

            for (let i = 1; i < args.length; i++) {
                optionString += `:${arrayOfNumbers[i]}: ${args[i]}\n`;
            }

            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription(`**${title}**\n\n${optionString}`);

            context.message.channel.send(embed).then(message => {
                if (args.length == 2) {
                    message.react("1️⃣");
                } else if (args.length == 3) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"));
                } else if (args.length == 4) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"));
                } else if (args.length == 5) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"))
                        .then(() => message.react("4️⃣"));
                } else if (args.length == 6) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"))
                        .then(() => message.react("4️⃣"))
                        .then(() => message.react("5️⃣"));
                } else if (args.length == 7) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"))
                        .then(() => message.react("4️⃣"))
                        .then(() => message.react("5️⃣"))
                        .then(() => message.react("6️⃣"));
                } else if (args.length == 8) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"))
                        .then(() => message.react("4️⃣"))
                        .then(() => message.react("5️⃣"))
                        .then(() => message.react("6️⃣"))
                        .then(() => message.react("7️⃣"));
                } else if (args.length == 9) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"))
                        .then(() => message.react("4️⃣"))
                        .then(() => message.react("5️⃣"))
                        .then(() => message.react("6️⃣"))
                        .then(() => message.react("7️⃣"))
                        .then(() => message.react("8️⃣"));
                } else if (args.length == 10) {
                    message.react("1️⃣")
                        .then(() => message.react("2️⃣"))
                        .then(() => message.react("3️⃣"))
                        .then(() => message.react("4️⃣"))
                        .then(() => message.react("5️⃣"))
                        .then(() => message.react("6️⃣"))
                        .then(() => message.react("7️⃣"))
                        .then(() => message.react("8️⃣"))
                        .then(() => message.react("9️⃣"));
                }
            }).catch(console.error);

            context.message.delete();
        } else if (args.length >= 11) {
            let errorEmbed = new MessageEmbed()
                .setDescription("The poll command can only accept up to 9 options");

            context.message.channel.send(errorEmbed);
        } else {
            let errorEmbed = new MessageEmbed()
                .setDescription("Please use the correct usage: <title>;<option 1>;<option 2>... (separate options with semicolons)");

            context.message.channel.send(errorEmbed);
        }
    }
}

module.exports = poll;