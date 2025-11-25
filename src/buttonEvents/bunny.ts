import { ButtonInteraction, PermissionsBitField } from "discord.js";
import { ButtonEvent } from "../type/buttonEvent";

export default class Bunny extends ButtonEvent {
    public override async execute(interaction: ButtonInteraction): Promise<void> {
        const action = interaction.customId.split(" ")[1];

        switch (action) {
            case "delete":
                await this.delete(interaction);
                break;
        }
    }

    private async delete(interaction: ButtonInteraction): Promise<void> {
        const userId = interaction.customId.split(" ")[2];

        if (!interaction.guild || !interaction.member) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        const member = interaction.guild.members.cache.get(interaction.user.id);
        const isOriginalUser = interaction.user.id === userId;
        const hasManageMessagesPermission = member?.permissions.has(PermissionsBitField.Flags.ManageMessages);

        if (!isOriginalUser && !hasManageMessagesPermission) {
            await interaction.reply({
                content: "You do not have permission to delete this message.",
                ephemeral: true,
            });
            return;
        }

        if (interaction.message.deletable) {
            await interaction.message.delete();
        } else {
            await interaction.reply({
                content: "Unable to delete this message.",
                ephemeral: true,
            });
        }
    }
}
