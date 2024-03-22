import { Interaction } from "discord.js";
import { Events } from "../../src/client/events";
import ChatInputCommand from "../../src/client/interactionCreate/chatInputCommand";
import Button from "../../src/client/interactionCreate/button";

describe('onInteractionCreate', () => {
    test("GIVEN the interaction is a chat input command, EXPECT chat input command handler to be executed", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "123",
        } as unknown as Interaction;

        ChatInputCommand.onChatInput = jest.fn();

        const events = new Events();
        await events.onInteractionCreate(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);

        expect(ChatInputCommand.onChatInput).toHaveBeenCalledTimes(1);
        expect(ChatInputCommand.onChatInput).toHaveBeenCalledWith(interaction);
    });

    test("GIVEN the interaction is a button, EXPECT button handler to be executed", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            isButton: jest.fn().mockReturnValue(true),
            guildId: "123",
        } as unknown as Interaction;

        Button.onButtonClicked = jest.fn();

        const events = new Events();
        await events.onInteractionCreate(interaction);

        expect(interaction.isButton).toHaveBeenCalledTimes(1);

        expect(Button.onButtonClicked).toHaveBeenCalledTimes(1);
        expect(Button.onButtonClicked).toHaveBeenCalledWith(interaction);
    });

    test("GIVEN the interaction is not a chat input command or button, EXPECT error", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            isButton: jest.fn().mockReturnValue(false),
            guildId: "123",
        } as unknown as Interaction;

        console.error = jest.fn();

        const events = new Events();
        await events.onInteractionCreate(interaction);

        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.isButton).toHaveBeenCalledTimes(1);

        expect(console.error).toHaveBeenCalledWith("Received interaction unable to interact with, ignoring");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn(),
            isButton: jest.fn(),
            guildId: null,
        } as unknown as Interaction;

        ChatInputCommand.onChatInput = jest.fn();
        Button.onButtonClicked = jest.fn();

        const events = new Events();
        await events.onInteractionCreate(interaction);

        expect(interaction.isChatInputCommand).not.toHaveBeenCalled();
        expect(interaction.isButton).not.toHaveBeenCalled();
        expect(ChatInputCommand.onChatInput).not.toHaveBeenCalled();
        expect(Button.onButtonClicked).not.toHaveBeenCalled();
    });
});

describe("onReady", () => {
    test("EXPECT console to be logged", () => {
        console.log = jest.fn();

        const events = new Events();
        events.onReady();

        expect(console.log).toHaveBeenCalledWith("Ready");
    });
});