import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import Command from "../../src/commands/ignore";
import IgnoredChannel from "../../src/database/entities/IgnoredChannel";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("ignore");
        expect(commandBuilder.description).toBe("Ignore events in this channel");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.Administrator.toString());
    });
});

describe("execute", () => {
    test("GIVEN channel is currently ignored, EXPECT channel to be removed from list", async () => {
        // Arrange
        const interaction = {
            guildId: "guildId",
            channelId: "channelId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        IgnoredChannel.IsChannelIgnored = jest.fn().mockResolvedValue(true);
        IgnoredChannel.FetchOneById = jest.fn().mockResolvedValue({});
        IgnoredChannel.Remove = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(IgnoredChannel.IsChannelIgnored).toHaveBeenCalledTimes(1);
        expect(IgnoredChannel.IsChannelIgnored).toHaveBeenCalledWith("channelId");

        expect(IgnoredChannel.FetchOneById).toHaveBeenCalledTimes(1);
        expect(IgnoredChannel.FetchOneById).toHaveBeenCalledWith(IgnoredChannel, "channelId");

        expect(IgnoredChannel.Remove).toHaveBeenCalledTimes(1);
        expect(IgnoredChannel.Remove).toHaveBeenCalledWith(IgnoredChannel, {});

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("This channel will start being logged again.");
    });

    test("GIVEN channel is not currently ignored, EXPECT channel to be added to list", async () => {
        let savedChannel: IgnoredChannel | undefined;

        // Arrange
        const interaction = {
            guildId: "guildId",
            channelId: "channelId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        IgnoredChannel.IsChannelIgnored = jest.fn().mockResolvedValue(false);
        IgnoredChannel.prototype.Save = jest.fn().mockImplementation((_, channel: IgnoredChannel) => {
            savedChannel = channel;
        });

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(IgnoredChannel.prototype.Save).toHaveBeenCalledTimes(1);
        expect(IgnoredChannel.prototype.Save).toHaveBeenCalledWith(IgnoredChannel, expect.any(IgnoredChannel));

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("This channel will now be ignored from logging.");

        expect(savedChannel).toBeDefined();
        expect(savedChannel!.Id).toBe("channelId");
    });
});