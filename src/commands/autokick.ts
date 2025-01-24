import {ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {Command} from "../type/command";
import TimeLengthInput from "../helpers/TimeLengthInput";
import AutoKickHelper from "../helpers/AutoKickHelper";

export default class Autokick extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("autokick")
            .setDescription("Configure the auto kick functionality")
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .addSubcommand(x => x
                .setName("set")
                .setDescription("Set the configuration")
                .addRoleOption(y => y
                    .setName("role")
                    .setDescription("The role the user needs to be auto kicked")
                    .setRequired(true))
                .addStringOption(y => y
                    .setName("kicktime")
                    .setDescription("The time with the role before being kicked (Ex: 2h 30m)")
                    .setRequired(true))
                .addStringOption(y => y
                    .setName("noticetime")
                    .setDescription("The time before being kicked when a notification is sent (Ex: 2h 30m)"))
                .addChannelOption(y => y
                    .setName("noticechannel")
                    .setDescription("The channel to send the notification to")))
            .addSubcommand(x => x
                .setName("unset")
                .setDescription("Unset the current configuration"));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();
        
        switch (subcommand) {
            case "set":
                await this.set(interaction);
                break;
            case "unset":
                await this.unset(interaction);
                break;
        }
    }

    private async set(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const roleOption = interaction.options.getRole("role", true);
        const kickTimeOption = interaction.options.getString("kicktime", true);
        const noticeTimeOption = interaction.options.getString("noticetime");
        const noticeChannelOption = interaction.options.getChannel("noticechannel");

        const roleId = roleOption.id;
        const kickTimeInput = new TimeLengthInput(kickTimeOption);
        const noticeTimeInput = noticeTimeOption ? new TimeLengthInput(noticeTimeOption) : undefined;
        const noticeChannelId = noticeChannelOption?.id;

        if ((noticeTimeInput && !noticeTimeOption) || (!noticeTimeInput && noticeChannelOption)) {
            await interaction.reply("Both `noticetime` and `noticechannel` must be set if you want a notification embed");
            return;
        }

        await AutoKickHelper.SetSetting(interaction.guildId, roleId, kickTimeInput.GetMilliseconds(), noticeTimeInput?.GetMilliseconds(), noticeChannelId);

        const embed = new EmbedBuilder()
            .setTitle("Auto Kick")
            .setDescription("Configured auto kick for this server")
            .addFields([
                {
                    name: "Role",
                    value: roleOption.name,
                    inline: true,
                },
                {
                    name: "Kick Time",
                    value: kickTimeInput.GetLengthShort(),
                    inline: true,
                },
            ]);

        if (noticeTimeInput) {
            embed.addFields([
                {
                    name: "Notice Time",
                    value: noticeTimeInput.GetLengthShort(),
                },
                {
                    name: "Notice Channel",
                    value: noticeChannelOption!.name!,
                    inline: true,
                },
            ]);
        }

        await interaction.reply({
            embeds: [ embed ],
        });
    }

    private async unset(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        await AutoKickHelper.UnsetSetting(interaction.guildId);

        await interaction.reply("Unset the auto kick configuration for this server");
    }
}
