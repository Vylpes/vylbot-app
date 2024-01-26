import { Interaction } from "discord.js";
import ChatInputCommand from "./interactionCreate/chatInputCommand";
import Button from "./interactionCreate/button";

export class Events {
    public async onInteractionCreate(interaction: Interaction) {
        if (!interaction.guildId) return;

        if (interaction.isChatInputCommand()) {
            ChatInputCommand.onChatInput(interaction);
        }

        if (interaction.isButton()) {
            Button.onButtonClicked(interaction);
        }
    }

    // Emit when bot is logged in and ready to use
    public onReady() {
        console.log("Ready");
    }
}
