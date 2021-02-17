const { command } = require('vylbot-core');
const { MessageEmbed } = require('discord.js');

class evaluate extends command {
    constructor() {
        super("evaluate");
        super.description = "Evaluates an expression";
        super.category = "Administration";
        super.requiredConfigs = "ownerid";
    }

    evaluate(context) {
        if (context.message.author.id == context.client.config.eval.ownerid) {
            const result = eval(context.arguments.join(" "));

            const embed = new MessageEmbed()
                .setDescription(result)
                .setColor(0x3050ba);
            
            context.message.channel.send(embed);
        }
    }
}

module.exports = evaluate;
