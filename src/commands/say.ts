import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import { Command } from "../type/command";

export default class Say extends Command {
    constructor() {
        super();
        super.Category = "Misc";
        super.Roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext) {
        const input = context.args.join(" ");

        if (input.length == 0) {
            const errorEmbed = new ErrorEmbed(context, "You must supply a message.");

            await errorEmbed.SendToCurrentChannel();
            return;
        }

        context.message.channel.send(input);
    }
}