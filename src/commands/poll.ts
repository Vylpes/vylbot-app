import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Poll extends Command {
    constructor() {
        super();
        
        super._category = "General";
    }

    public override async execute(context: ICommandContext): Promise<ICommandReturnContext> {
        const argsJoined = context.args.join(" ");
        const argsSplit = argsJoined.split(";");

        if (argsSplit.length < 3 || argsSplit.length > 10) {
            const errorEmbed = new ErrorEmbed(context, "Usage: <title>;<option 1>;<option 2>... (separate options with semicolons), maximum of 9 options");
            errorEmbed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        const title = argsSplit[0];

        const arrayOfNumbers = [
            ':one:',
            ':two:',
            ':three:',
            ':four:',
            ':five:',
            ':six:',
            ':seven:',
            ':eight:',
            ':nine:'
        ];

        const reactionEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        const description = arrayOfNumbers.splice(0, argsSplit.length - 1);

        description.forEach((value, index) => {
            description[index] = `${value} ${argsSplit[index + 1]}`;
        });

        const embed = new PublicEmbed(context, title, description.join("\n"));

        const message = await context.message.channel.send({ embeds: [ embed ]});

        description.forEach(async (value, index) => {
            await message.react(reactionEmojis[index]);
        });

        if (context.message.deletable) {
            await context.message.delete();
        }

        return {
            commandContext: context,
            embeds: [embed]
        };
    }
}