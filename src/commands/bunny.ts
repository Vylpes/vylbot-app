import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";
import randomBunny from "random-bunny";

export default class Bunny extends Command {
    constructor() {
        super();

        super.Category = "Fun";
    }

    public override async execute(context: ICommandContext) {
        const result = await randomBunny('rabbits', 'hot');

        if (result.IsSuccess) {
            const embed = new PublicEmbed(context, result.Result!.Title, "")
                .setImage(result.Result!.Url)
                .setURL(`https://reddit.com${result.Result!.Permalink}`)
                .setFooter({ text: `r/Rabbits · ${result.Result!.Ups} upvotes` });
            
            await embed.SendToCurrentChannel();
        } else {
            const errorEmbed = new ErrorEmbed(context, "There was an error using this command.");
            await errorEmbed.SendToCurrentChannel();
        }
    }
}