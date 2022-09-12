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
        const subreddits = [
            'rabbits',
            'bunnieswithhats',
            'buncomfortable',
            'bunnytongues',
            'dutchbunnymafia',
        ];

        const random = Math.floor(Math.random() * subreddits.length);
        const selectedSubreddit = subreddits[random];

        const result = await randomBunny(selectedSubreddit, 'hot');

        if (result.IsSuccess) {
            const embed = new PublicEmbed(context, result.Result!.Title, "");

            embed.SetImage(result.Result!.Url)
            embed.SetURL(`https://reddit.com${result.Result!.Permalink}`)
            embed.SetFooter(`r/${selectedSubreddit} · ${result.Result!.Ups} upvotes`);
            
            await embed.SendToCurrentChannel();
        } else {
            const errorEmbed = new ErrorEmbed(context, "There was an error using this command.");
            await errorEmbed.SendToCurrentChannel();
        }
    }
}