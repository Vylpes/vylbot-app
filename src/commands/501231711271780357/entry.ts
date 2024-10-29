import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import EmbedColours from "../../constants/EmbedColours";
import SettingsHelper from "../../helpers/SettingsHelper";
import { Command } from "../../type/command";

export default class Entry extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('entry')
            .setDescription('Sends the entry embed')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers);
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId) return;
        if (!interaction.channel) return;

        const rulesChannelId = await SettingsHelper.GetSetting("channels.rules", interaction.guildId) || "rules";

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Welcome")
            .setDescription(`Welcome to the server! Please make sure to read the rules in the <#${rulesChannelId}> channel and type the code found there in here to proceed to the main part of the server.`);

        const channel = interaction.channel as TextChannel;

        await channel.send({ embeds: [ embed ]});
    }
}