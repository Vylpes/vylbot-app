import { ButtonInteraction, CacheType } from "discord.js";
import { ButtonEvent } from "../type/buttonEvent";
import SettingsHelper from "../helpers/SettingsHelper";

export default class Verify extends ButtonEvent {
    public override async execute(interaction: ButtonInteraction<CacheType>) {
        if (!interaction.guildId || !interaction.guild) return;

        const roleName = await SettingsHelper.GetSetting("verification.role", interaction.guildId);

        if (!roleName) return;

        const role = interaction.guild.roles.cache.find(x => x.name == roleName);

        if (!role) {
            await interaction.reply({
                content: `Unable to find the role, ${roleName}`,
                ephemeral: true,
            });

            return;
        }

        const member = interaction.guild.members.cache.find(x => x.id == interaction.user.id);

        if (!member || !member.manageable) {
            await interaction.reply({
                content: "Unable to give role to user",
                ephemeral: true,
            });

            return;
        }

        await member.roles.add(role);

        await interaction.reply({
            content: "Given role",
            ephemeral: true,
        });
    }
}