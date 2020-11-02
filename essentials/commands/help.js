// Required Components
const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');

const embedColor = "0x3050ba";

// Command Class
class help extends command {
    constructor() {
        // Set the execute method, description, category, and example usage
        super("help");
        super.description = "Gives a list of commands available in the bot";
        super.category = "General";
        super.usage = "[command]";
    }
    
    // Execute method
    help(context) {
        // Get the list of command folders the bot has been setup to check
        let commandFolders = context.client.config.commands;

        // Empty arrays for commands
        // allCommands: Will contain objects of all commands with their related info
        // categories: Will contain strings of all the categories the commands are set to, unique
        let allCommands = [];
        let categories = [];

        // Loop through all the command folders set
        // i = folder index
        for (let i = 0; i < commandFolders.length; i++) {
            // The current folder the bot is looking through
            let folder = commandFolders[i];

            // Read the directory of the current folder
            let contents = readdirSync(`${process.cwd()}/${folder}`);

            // Loop through the contents of the folder
            // j = file index in folder i
            for (let j = 0; j < contents.length; j++) {
                // Get command in the current folder to read
                let file = require(`${process.cwd()}/${folder}/${contents[j]}`);

                // Initialise the command
                let obj = new file();

                // Data object containing the command information
                let data = {
                    "name": contents[j].replace(".js", ""),
                    "description": obj.description,
                    "category": obj.category,
                    "usage": obj.usage,
                    "roles": obj.roles
                };

                // Push the command data to the allCommands Array
                allCommands.push(data);
            }
        }

        // Loop through all the commands discovered by the previous loop
        for (let i = 0; i < allCommands.length; i++) {
            // Get the current command category name, otherwise "none"
            let category = allCommands[i].category || "none";

            // If the command isn't already set, set it.
            // This will then make the categories array be an array of all categories which have been used but only one of each.
            if (!categories.includes(category)) categories.push(category);
        }

        // If an command name has been passed as an argument
        // If so, send information about that command
        // If not, send the help embed of all commands
        if (context.arguments[0]) {
            sendCommand(context, allCommands, context.arguments[0]);
        } else {
            sendAll(context, categories, allCommands);
        }
    }
}

// Send embed of all commands
// context: The command context json string
// categories: The array of categories found
// allCommands: The array of the commands found
function sendAll(context, categories, allCommands) {
    // Embed to be sent
    let embed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle("Commands");

    // Loop through each command
    for (let i = 0; i < categories.length; i++) {
        // The category name of the current one to check
        let category = categories[i];

        // Empty Array for the next loop to filter out the current category
        let commandsFilter = [];

        // Loop through allCommands
        // If the command is set to the current category being checked, add it to the filter array
        for (let j = 0; j < allCommands.length; j++) {
            if (allCommands[j].category == category) commandsFilter.push(`\`${allCommands[j].name}\``);
        }

        // Add a field to the embed which contains the category name and all the commands in that category
        embed.addField(category, commandsFilter.join(", "));
    }

    // Send the embed
    context.message.channel.send(embed);
}

// Send information about a specific command
// context: The command context json string
// allCommands: The array of categories found
// name: The command name to check
function sendCommand(context, allCommands, name) {
    let command = {};

    // Loop through all commands, if the command name is the same as the one we're looking for, select it
    for (let i = 0; i < allCommands.length; i++) {
        if (allCommands[i].name == name) command = allCommands[i];
    }

    // If a matching command has been found
    if (command.name) {
        // Create an embed containing the related information of the command
        // The title is the command name but sets the first letter to be capitalised
        // If a set of information isn't set, set it to say "none"
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(command.name[0].toUpperCase() + command.name.substring(1))
            .setDescription(command.description || "*none*")
            .addField("Category", command.category || "*none*", true)
            .addField("Usage", command.usage || "*none*", true)
            .addField("Required Roles", command.roles.join(", ") || "*none*");

        // Send the embed
        context.message.channel.send(embed);
    } else { // If no command has been found, then send an embed which says this
        let embed = new MessageEmbed()
			.setColor(embedColor)
            .setDescription("Command does not exist");

        context.message.channel.send(embed);
    }
}

module.exports = help;
