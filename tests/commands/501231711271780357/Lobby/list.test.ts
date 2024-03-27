import { APIEmbedField, CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import List from "../../../../src/commands/501231711271780357/Lobby/list";
import Lobby from "../../../../src/database/entities/501231711271780357/Lobby";
import EmbedColours from "../../../../src/constants/EmbedColours";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const list = new List();

        expect(list.CommandBuilder).toBeDefined();

        const commandBulder = list.CommandBuilder as SlashCommandBuilder;

        expect(commandBulder.name).toBe("listlobby");
        expect(commandBulder.description).toBe("Lists all channels set up as lobbies");
        expect(commandBulder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());
    });
});

describe("execute", () => {
    test('EXPECT list of lobby channels to be sent', async () => {
        let repliedWith;

        const interaction = {
            guild: {
                channels: {
                    cache: {
                        map: jest.fn().mockReturnValue([{
                            id: "channelId",
                        }]),
                    }
                }
            },
            reply: jest.fn().mockImplementation((options) => {
                repliedWith = options;
            }),
        } as unknown as CommandInteraction;

        Lobby.FetchOneByChannelId = jest.fn().mockReturnValue({
            Name: "lobbyName",
            LastUsed: "lastUsed",
        });

        const list = new List();
        await list.execute(interaction);

        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledTimes(1);
        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledWith("channelId");

        expect(interaction.reply).toHaveBeenCalledTimes(1);

        expect(repliedWith).toBeDefined();
        expect(repliedWith!.embeds).toBeDefined();
        expect(repliedWith!.embeds.length).toBe(1);

        const repliedEmbed: EmbedBuilder = repliedWith!.embeds[0];

        expect(repliedEmbed.data.color).toBe(EmbedColours.Ok);
        expect(repliedEmbed.data.title).toBe("Lobbies");
        expect(repliedEmbed.data.description).toBe("Channels: 1");
        expect(repliedEmbed.data.fields).toBeDefined();
        expect(repliedEmbed.data.fields!.length).toBe(1);

        const repliedEmbedField1: APIEmbedField = repliedEmbed.data.fields![0];

        expect(repliedEmbedField1.name).toBe("# lobbyName");
        expect(repliedEmbedField1.value).toBe("Last Used: lastUsed");
    });

    test("GIVEN interaction.guild is null, EXPECT error", async () => {
        const interaction = {
            guild: null,
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const list = new List();
        await list.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Guild not found.");
    });
});