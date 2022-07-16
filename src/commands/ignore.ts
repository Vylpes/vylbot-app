import { ICommandContext } from "../contracts/ICommandContext";
import IgnoredChannel from "../entity/IgnoredChannel";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Ignore extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;
 
        const isChannelIgnored = await IgnoredChannel.IsChannelIgnored(context.message.channel.id);
 
        if (isChannelIgnored) {
            const entity = await IgnoredChannel.FetchOneById(IgnoredChannel, context.message.channel.id);
            
            await IgnoredChannel.Remove(IgnoredChannel, entity);

            const embed = new PublicEmbed(context, "Success", "This channel will start being logged again.");
            await embed.SendToCurrentChannel();
        } else {
            const entity = new IgnoredChannel(context.message.channel.id);

            await entity.Save(IgnoredChannel, entity);

            const embed = new PublicEmbed(context, "Success", "This channel will now be ignored from logging.");
            await embed.SendToCurrentChannel();
        }
    }
}