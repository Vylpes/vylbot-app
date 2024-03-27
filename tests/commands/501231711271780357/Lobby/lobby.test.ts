import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../../../../src/commands/501231711271780357/Lobby/lobby";
import Lobby from "../../../../src/database/entities/501231711271780357/Lobby";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const lobby = new Command();

        expect(lobby.CommandBuilder).toBeDefined();

        const commandBuilder = lobby.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("lobby");
        expect(commandBuilder.description).toBe("Attempt to organise a lobby");
    });
});

describe("execute", () => {
    test("EXPECT lobby command to announce a lobby setup", async () => {
        const interaction = {
            user: "user",
            channelId: "channelId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const markAsUsed = jest.fn();
        const lobbySave = jest.fn();

        Lobby.FetchOneByChannelId = jest.fn().mockResolvedValue({
            Cooldown: 5,
            LastUsed: new Date(2 * 60 * 1000),
            Name: "gameName",
            RoleId: "roleId",
            MarkAsUsed: markAsUsed,
            Save: lobbySave,
        });

        Date.now = jest.fn().mockReturnValue(10 * 60 * 1000);

        const lobby = new Command();
        await lobby.execute(interaction);

        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledTimes(1);
        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledWith("channelId");

        expect(Date.now).toHaveBeenCalledTimes(1);

        expect(markAsUsed).toHaveBeenCalledTimes(1);
        
        expect(lobbySave).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("user would like to organise a lobby of **gameName**! <@&roleId>");
    });

    test("GIVEN interaction.channelId is null, EXPECT nothing to happen", async () => {
        const interaction = {
            channelId: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const lobby = new Command();
        await lobby.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN channel is not setup in the database as a lobby, EXPECT error", async () => {
        const interaction = {
            channelId: "channelId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Lobby.FetchOneByChannelId = jest.fn().mockResolvedValue(null);

        const lobby = new Command();
        await lobby.execute(interaction);

        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("This channel is disabled from using the lobby command.");
    });

    test("GIVEN lobby command was last used within the cooldown, EXPECT error", async () => {
        const interaction = {
            user: "user",
            channelId: "channelId",
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const markAsUsed = jest.fn();
        const lobbySave = jest.fn();

        Lobby.FetchOneByChannelId = jest.fn().mockResolvedValue({
            Cooldown: 5,
            LastUsed: new Date(2 * 60 * 1000),
            Name: "gameName",
            RoleId: "roleId",
            MarkAsUsed: markAsUsed,
            Save: lobbySave,
        });

        Date.now = jest.fn().mockReturnValue(5 * 60 * 1000);

        const lobby = new Command();
        await lobby.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Requesting a lobby for this game is on cooldown! Please try again in **2 minutes**.");
    });
});