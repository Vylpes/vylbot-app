import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../type/command";
import UserSetting from "../../database/entities/UserSetting";
import EmbedColours from "../../constants/EmbedColours";

export default class MoonSet extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("moonset")
            .setDescription("Manually set a user's moons")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addUserOption(x => x
                .setName("user")
                .setDescription("The user to set")
                .setRequired(true))
            .addNumberOption(x => x
                .setName("count")
                .setDescription("The amount the user will have")
                .setRequired(true)
                .setMinValue(0));
    }

    public override async execute(interaction: CommandInteraction) {
        const user = interaction.options.get("user", true).user!;
        const count = interaction.options.get("count", true).value! as number;

        let moonSetting = await UserSetting.FetchOneByKey(user.id, "moons");

        if (moonSetting) {
            moonSetting.UpdateValue(`${count}`);
        } else {
            moonSetting = new UserSetting(user.id, "moons", `${count}`);
        }

        await moonSetting.Save(UserSetting, moonSetting);

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setDescription(`Moon count for ${user.username} set to ${count}`);

        await interaction.reply({ embeds: [ embed ]});
    }
}