import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../type/command";
import SettingsHelper from "../helpers/SettingsHelper";

export default class Linkonly extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("linkonly")
            .setDescription("Set the link only channel, leave blank to disable")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
            .addChannelOption(x => x
                .setName("channel")
                .setDescription("The channel"));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guild) return;

        const channel = interaction.options.get("channel")?.channel;

        const channelid = channel?.id ?? "";
        const channelName = channel?.name ?? "<NONE>";

        await SettingsHelper.SetSetting("channel.linkonly", interaction.guild.id, channelid);

        await interaction.reply(`Set the link only channel to \`${channelName}\``);
    }
}