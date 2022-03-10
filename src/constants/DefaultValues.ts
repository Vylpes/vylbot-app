export default class DefaultValues {
    public static readonly values: ISettingValue[] = [];

    public static GetValue(key: string): string | undefined {
        this.SetValues();

        const res = this.values.find(x => x.Key == key);
        
        if (!res) {
            return undefined;
        }

        return res.Value;
    }

    private static SetValues() {
        if (this.values.length == 0) {
            // Commands
            this.values.push({ Key: "commands.disabled", Value: "" });
            this.values.push({ Key: "commands.disabled.message", Value: "This command is disabled." });

            // Role (Command)
            this.values.push({ Key: "role.assignable", Value: "" });
            this.values.push({ Key: "role.moderator", Value: "Moderator" });
            this.values.push({ Key: "role.muted", Value: "Muted" });

            // Rules (Command)
            this.values.push({ Key: "rules.file", Value: "data/rules/rules" });

            // Embed
            this.values.push({ Key: "embed.colour.info", Value: "0x3050ba" });
            this.values.push({ Key: "embed.colour.error", Value: "0xd52803" });

            // Channels
            this.values.push({ Key: "channels.logs.message", Value: "message-logs" });
            this.values.push({ Key: "channels.logs.member", Value: "member-logs" });
            this.values.push({ Key: "channels.logs.mod", Value: "mod-logs" });
        }
    }
}

export interface ISettingValue {
    Key: string,
    Value: string,
};