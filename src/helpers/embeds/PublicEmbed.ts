import { EmbedBuilder, Message, MessageOptions, PermissionsBitField, TextChannel } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";

export default class PublicEmbed {
    public context: ICommandContext;

    private _embedBuilder: EmbedBuilder;

    constructor(context: ICommandContext, title: string, description: string) {
        this._embedBuilder = new EmbedBuilder()
            .setColor(0x3050ba)
            .setTitle(title)
            .setDescription(description);

        this.context = context;
    }

    // Detail methods
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

    public AddReason(message: string) {
        this._embedBuilder.addFields([
            {
                name: "Reason",
                value: message || "*none*",
            }
        ])
    }

    public SetURL(url: string) {
        this._embedBuilder.setURL(url);
    }

    // Send methods
    public async SendToCurrentChannel(options?: MessageOptions): Promise<Message | undefined> {
        const channel = this.context.message.channel as TextChannel;
        const botMember = await this.context.message.guild?.members.fetch({ user: this.context.message.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(PermissionsBitField.Flags.SendMessages)) return;

        return this.context.message.channel.send({ embeds: [ this._embedBuilder ], ...options});
    }
}