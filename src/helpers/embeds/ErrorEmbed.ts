import { EmbedBuilder, Message, PermissionsBitField, TextChannel } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";

export default class ErrorEmbed {
    public context: ICommandContext;

    private _embedBuilder: EmbedBuilder;

    constructor(context: ICommandContext, message: string) {
        this._embedBuilder = new EmbedBuilder()
            .setColor(0xd52803)
            .setDescription(message);

        this.context = context;
    }

    // Detail Methods
    public AddField(name: string, value: string, inline: boolean = false) {
        this._embedBuilder.addFields([
            {
                name,
                value,
                inline
            }
        ])
    }

    public SetFooter(text: string) {
        this._embedBuilder.setFooter({
            text
        });
    }

    public SetImage(imageUrl: string) {
        this._embedBuilder.setImage(imageUrl);
    }

    public SetURL(url: string) {
        this._embedBuilder.setURL(url);
    }

    // Send Methods
    public async SendToCurrentChannel(): Promise<Message | undefined> {
        const channel = this.context.message.channel as TextChannel;
        const botMember = await this.context.message.guild?.members.fetch({ user: this.context.message.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(PermissionsBitField.Flags.SendMessages)) return;

        return this.context.message.channel.send({ embeds: [ this._embedBuilder ]});
    }
}