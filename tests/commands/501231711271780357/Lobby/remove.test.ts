import { CommandInteraction, PermissionsBitField, SlashCommandBuilder, SlashCommandChannelOption } from "discord.js";
import Remove from "../../../../src/commands/501231711271780357/Lobby/remove";
import Lobby from "../../../../src/database/entities/501231711271780357/Lobby";
import BaseEntity from "../../../../src/contracts/BaseEntity";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const remove = new Remove();

        expect(remove.CommandBuilder).toBeDefined();

        const commandBuilder = remove.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("removelobby");
        expect(commandBuilder.description).toBe("Remove a lobby channel");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());
        expect(commandBuilder.options.length).toBe(1);

        const channelOption = commandBuilder.options[0] as SlashCommandChannelOption;

        expect(channelOption.name).toBe("channel");
        expect(channelOption.description).toBe("The channel");
        expect(channelOption.required).toBe(true);
    });
});

describe("execute", () => {
    test("EXPECT channel to be removed from database", async () => {
        const channel = {
            channel: {
                id: "channelId",
            },
        };

        const interaction = {
            options: {
                get: jest.fn().mockReturnValue(channel),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Lobby.FetchOneByChannelId = jest.fn().mockResolvedValue({});
        BaseEntity.Remove = jest.fn();

        const remove = new Remove();
        await remove.execute(interaction);

        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledTimes(1);
        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledWith("channelId");

        expect(BaseEntity.Remove).toHaveBeenCalledTimes(1); 

        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("channel");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Removed <#channelId> from the list of lobby channels");
    });

    test("GIVEN channel is null, EXPECT error", async () => {
        const interaction = {
            options: {
                get: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const remove = new Remove();
        await remove.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Channel is required.");
    });

    test("GIVEN channel.channel is undefined, EXPECT error", async () => {
        const channel = {
            channel: undefined,
        };

        const interaction = {
            options: {
                get: jest.fn().mockReturnValue(channel),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const remove = new Remove();
        await remove.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Channel is required.");
    });

    test("GIVEN channel is not set up as a lobby, EXPECT error", async () => {
        const channel = {
            channel: {
                id: "channelId",
            },
        };

        const interaction = {
            options: {
                get: jest.fn().mockReturnValue(channel),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Lobby.FetchOneByChannelId = jest.fn().mockResolvedValue(null);

        const remove = new Remove();
        await remove.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Channel not found.");
    });
});