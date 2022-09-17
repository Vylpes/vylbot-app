import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import EmbedColours from "../../constants/EmbedColours";
import { ICommandContext } from "../../contracts/ICommandContext";
import SettingsHelper from "../../helpers/SettingsHelper";
import { Command } from "../../type/command";

export default class Entry extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('entry')
            .setDescription('Sends the entry embed');
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId) return;
        if (!interaction.channel) return;

        const rulesChannelId = await SettingsHelper.GetSetting("channels.rules", interaction.guildId) || "rules";

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Welcome")
            .setDescription(`Welcome to the server! Please make sure to read the rules in the <#${rulesChannelId}> channel and type the code found there in here to proceed to the main part of the server.`);

        await interaction.channel.send({ embeds: [ embed ]});
    }
}