// Required components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

// Command variables
const embedColor = "0x3050ba";

// Command class
class poll extends command {
    constructor() {
        // Set the command's run method, description, category, and example usage
        super("poll");
        super.description = "Generates a poll with reaction numbers";
        super.category = "General";
        super.usage = "<title>;<option 1>;<option 2>...";
    }

    // Run method
    poll(context) {
        // Get the command's arguments, and split them by a semicolon rather than a space
        // This allows the variables to be able to use spaces in them
        let args = context.arguments;
        let argsJoined = args.join(' ');
        args = argsJoined.split(';');

        // If the argument has 3 or more arguments and less than 11 arguments
        // This allows the title and 2-9 options
        if (args.length >= 3 && args.length < 11) {
            // Set the title to the first argument
            let title = args[0];
            let optionString = "";

            // Array used to get the numbers as their words
            // arrayOfNumbers[n] = "n written in full words"
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

            // Loop through all the arguments after the title
            // Add them to the optionString, with their index turned into a number emoji
            // Example: :one: Option 1
            for (let i = 1; i < args.length; i++) {
                optionString += `:${arrayOfNumbers[i]}: ${args[i]}\n`;
            }

            // Create the embed with the title at the top of the description with the options below
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription(`**${title}**\n\n${optionString}`);

            // Send the embed and then react with the numbers for users to react with,
            // the bot will determine how many to react with for the amount of options inputted
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

            // Delete the message
            context.message.delete();
        } else if (args.length >= 11) { // If the user inputted more than 9 options
            let errorEmbed = new MessageEmbed()
                .setDescription("The poll command can only accept up to 9 options");

            context.message.channel.send(errorEmbed);
        } else { // If the user didn't give enough data
            let errorEmbed = new MessageEmbed()
                .setDescription("Please use the correct usage: <title>;<option 1>;<option 2>... (separate options with semicolons)");

            context.message.channel.send(errorEmbed);
        }
    }
}

module.exports = poll;
