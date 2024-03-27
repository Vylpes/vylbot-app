import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import Entry from "../../../src/commands/501231711271780357/entry";
import SettingsHelper from "../../../src/helpers/SettingsHelper";
import EmbedColours from "../../../src/constants/EmbedColours";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const entry = new Entry();

        expect(entry.CommandBuilder).toBeDefined();

        const commandBuilder = entry.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("entry");
        expect(commandBuilder.description).toBe("Sends the entry embed");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());
    });
});

describe("execute", () => {
    test("EXPECT entry embed to be sent", async () => {
        let sentWith;

        const interaction = {
            guildId: "guildId",
            channel: {
                send: jest.fn().mockImplementation((options) => {
                    sentWith = options;
                }),
            },
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("channelId");

        const entry = new Entry();
        await entry.execute(interaction);

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("channels.rules", "guildId");

        expect(interaction.channel!.send).toHaveBeenCalledTimes(1);
        expect(sentWith).toBeDefined();
        expect(sentWith!.embeds).toBeDefined();
        expect(sentWith!.embeds.length).toBe(1);

        const embed = sentWith!.embeds[0] as EmbedBuilder;

        expect(embed.data.color).toBe(EmbedColours.Ok);
        expect(embed.data.title).toBe("Welcome");
        expect(embed.data.description).toBe("Welcome to the server! Please make sure to read the rules in the <#channelId> channel and type the code found there in here to proceed to the main part of the server.");
    });

    test("GIVEN interaction.guildId is null, EXPECT error", async () => {
        const interaction = {
            guildId: null,
        } as unknown as CommandInteraction; 

        SettingsHelper.GetSetting = jest.fn();

        const entry = new Entry();
        await entry.execute(interaction);

        expect(SettingsHelper.GetSetting).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.channel is null, EXPECT error", async () => {
        const interaction = {
            guildId: "guildId",
            channel: null,
        } as unknown as CommandInteraction; 

        SettingsHelper.GetSetting = jest.fn();

        const entry = new Entry();
        await entry.execute(interaction);

        expect(SettingsHelper.GetSetting).not.toHaveBeenCalled();
    });

    test("GIVEN channels.rules setting is not set, EXPECT channel id to be defaulted", async () => {
        let sentWith;

        const interaction = {
            guildId: "guildId",
            channel: {
                send: jest.fn().mockImplementation((options) => {
                    sentWith = options;
                }),
            },
        } as unknown as CommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue(undefined);

        const entry = new Entry();
        await entry.execute(interaction);

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("channels.rules", "guildId");

        expect(interaction.channel!.send).toHaveBeenCalledTimes(1);
        expect(sentWith).toBeDefined();
        expect(sentWith!.embeds).toBeDefined();
        expect(sentWith!.embeds.length).toBe(1);

        const embed = sentWith!.embeds[0] as EmbedBuilder;

        expect(embed.data.color).toBe(EmbedColours.Ok);
        expect(embed.data.title).toBe("Welcome");
        expect(embed.data.description).toBe("Welcome to the server! Please make sure to read the rules in the <#rules> channel and type the code found there in here to proceed to the main part of the server.");
    });
});