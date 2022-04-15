import { ICommandContext } from "../contracts/ICommandContext";
import Server from "../entity/Server";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Setup extends Command {
    constructor() {
        super();
        super.Category = "Administration";
        super.Roles = [
            "moderator"
        ]
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) {
            return;
        }

        const server = await Server.FetchOneById(Server, context.message.guild?.id);

        if (server) {
            const embed = new ErrorEmbed(context, "This server has already been setup, please configure using the config command");
            embed.SendToCurrentChannel();
            return;
        }

        const newServer = new Server(context.message.guild?.id);

        await newServer.Save(Server, newServer);

        const embed = new PublicEmbed(context, "Success", "Please configure using the config command");
        embed.SendToCurrentChannel();
    }
}