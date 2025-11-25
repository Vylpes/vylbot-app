import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import Rules from "../../src/commands/rules";
import { existsSync, readFileSync } from "fs";
import SettingsHelper from "../../src/helpers/SettingsHelper";

jest.mock("fs");
jest.mock("../../src/helpers/SettingsHelper");

beforeEach(() => {
    jest.resetAllMocks();
});

describe("constructor", () => {
    let rules: Rules;

    beforeEach(() => {
        rules = new Rules();
    });

    test("EXPECT CommandBuilder to be defined correctly", () => {
        expect(rules.CommandBuilder).toMatchSnapshot();
    });
});

describe("execute", () => {
    describe("GIVEN interaction is not a chat input command", () => {
        const rules = new Rules();

        let interaction: CommandInteraction;

        beforeEach(async () => {
            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(false),
            } as unknown as CommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT interaction.isChatInputCommand to have been called", () => {
            expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT nothing to happen", () => {
            expect(interaction.isChatInputCommand).toHaveBeenCalledWith();
        });
    });

    describe("GIVEN interaction subcommand is embeds", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue(JSON.stringify([{
                title: "Test Rule"
            }]));

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: {
                    send: jest.fn(),
                } as unknown as TextChannel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT interaction.options.getSubcommand to have been called", () => {
            expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT channel.send to be called with embeds", () => {
            const channel = interaction.channel as TextChannel;
            expect(channel.send).toHaveBeenCalledTimes(1);
        });
    });

    describe("GIVEN interaction subcommand is access", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            (SettingsHelper.GetSetting as jest.Mock).mockResolvedValue(null);

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: {
                    send: jest.fn(),
                } as unknown as TextChannel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("access"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT interaction.options.getSubcommand to have been called", () => {
            expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT channel.send to be called with button components", () => {
            const channel = interaction.channel as TextChannel;
            expect(channel.send).toHaveBeenCalledTimes(1);
            const args = (channel.send as jest.Mock).mock.calls[0][0];
            expect(args.components).toHaveLength(1);
        });
    });

    describe("GIVEN interaction subcommand is unknown", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                options: {
                    getSubcommand: jest.fn().mockReturnValue("unknown"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT interaction.options.getSubcommand to have been called", () => {
            expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT interaction.reply to be called with error message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith("Subcommand doesn't exist.");
        });
    });
});

describe("SendEmbeds via execute", () => {
    describe("GIVEN interaction does not have guildId", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: undefined,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT nothing to happen", () => {
            expect(interaction.guildId).toBeUndefined();
        });
    });

    describe("GIVEN rules file does not exist", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(false);

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT existsSync to have been called", () => {
            expect(existsSync).toHaveBeenCalledTimes(1);
        });

        test("EXPECT interaction.reply to be called with error message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith('Rules file doesn\'t exist.');
        });
    });

    describe("GIVEN rules file is empty", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue("[]");

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT existsSync to have been called", () => {
            expect(existsSync).toHaveBeenCalledTimes(1);
        });

        test("EXPECT readFileSync to have been called", () => {
            expect(readFileSync).toHaveBeenCalledTimes(1);
        });

        test("EXPECT interaction.reply to be called with no rules message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith({ content: "No rules have been supplied within code base for this server.", ephemeral: true });
        });
    });

    describe("GIVEN channel is not found", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue(JSON.stringify([
                {
                    title: "Rule 1",
                    description: ["Test rule"],
                }
            ]));

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: null,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT interaction.reply to be called with channel not found message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith({ content: "Channel not found.", ephemeral: true });
        });
    });

    describe("GIVEN rules file has valid rules", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;
        let channel: TextChannel;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue(JSON.stringify([
                {
                    title: "Rule 1",
                    description: ["Test rule 1", "Test rule 2"],
                    image: "https://example.com/image.png",
                    footer: "Footer text",
                }
            ]));

            channel = {
                send: jest.fn(),
            } as unknown as TextChannel;

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: channel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT existsSync to have been called", () => {
            expect(existsSync).toHaveBeenCalledTimes(1);
        });

        test("EXPECT readFileSync to have been called", () => {
            expect(readFileSync).toHaveBeenCalledTimes(1);
        });

        test("EXPECT channel.send to have been called with embeds", () => {
            expect(channel.send).toHaveBeenCalledTimes(1);
            const args = (channel.send as jest.Mock).mock.calls[0][0];
            expect(args.embeds).toHaveLength(1);
            expect(args.embeds[0]).toBeInstanceOf(EmbedBuilder);
        });

        test("EXPECT interaction.reply to be called with success message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            const args = (interaction.reply as jest.Mock).mock.calls[0][0];
            expect(args.ephemeral).toBe(true);
            expect(args.embeds).toHaveLength(1);
            expect(args.embeds[0]).toBeInstanceOf(EmbedBuilder);
        });
    });

    describe("GIVEN rules file has rules without optional fields", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;
        let channel: TextChannel;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue(JSON.stringify([
                {
                    description: ["Test rule"],
                }
            ]));

            channel = {
                send: jest.fn(),
            } as unknown as TextChannel;

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: channel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT channel.send to have been called with embeds", () => {
            expect(channel.send).toHaveBeenCalledTimes(1);
            const args = (channel.send as jest.Mock).mock.calls[0][0];
            expect(args.embeds).toHaveLength(1);
        });
    });

    describe("GIVEN rules file has rules without description", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;
        let channel: TextChannel;

        beforeEach(async () => {
            process.env.DATA_DIR = "data";

            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue(JSON.stringify([
                {
                    title: "Rule 1",
                }
            ]));

            channel = {
                send: jest.fn(),
            } as unknown as TextChannel;

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: channel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("embeds"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT channel.send to have been called with embeds", () => {
            expect(channel.send).toHaveBeenCalledTimes(1);
            const args = (channel.send as jest.Mock).mock.calls[0][0];
            expect(args.embeds).toHaveLength(1);
        });
    });
});

describe("SendAccessButton via execute", () => {
    describe("GIVEN interaction does not have guildId", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;

        beforeEach(async () => {
            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: undefined,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("access"),
                },
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT nothing to happen", () => {
            expect(interaction.guildId).toBeUndefined();
        });
    });

    describe("GIVEN button label setting exists", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;
        let channel: TextChannel;

        beforeEach(async () => {
            (SettingsHelper.GetSetting as jest.Mock).mockResolvedValue("Custom Label");

            channel = {
                send: jest.fn(),
            } as unknown as TextChannel;

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: channel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("access"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT SettingsHelper.GetSetting to have been called", () => {
            expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
            expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("rules.access.label", "test-guild-id");
        });

        test("EXPECT channel.send to have been called with components", () => {
            expect(channel.send).toHaveBeenCalledTimes(1);
            const args = (channel.send as jest.Mock).mock.calls[0][0];
            expect(args.components).toHaveLength(1);
        });

        test("EXPECT interaction.reply to be called with success message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith({
                content: "Success",
                ephemeral: true,
            });
        });
    });

    describe("GIVEN button label setting does not exist", () => {
        const rules = new Rules();

        let interaction: ChatInputCommandInteraction;
        let channel: TextChannel;

        beforeEach(async () => {
            (SettingsHelper.GetSetting as jest.Mock).mockResolvedValue(null);

            channel = {
                send: jest.fn(),
            } as unknown as TextChannel;

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                guildId: "test-guild-id",
                channel: channel,
                options: {
                    getSubcommand: jest.fn().mockReturnValue("access"),
                },
                reply: jest.fn(),
            } as unknown as ChatInputCommandInteraction;

            await rules.execute(interaction);
        });

        test("EXPECT SettingsHelper.GetSetting to have been called", () => {
            expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
            expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("rules.access.label", "test-guild-id");
        });

        test("EXPECT channel.send to have been called with components", () => {
            expect(channel.send).toHaveBeenCalledTimes(1);
            const args = (channel.send as jest.Mock).mock.calls[0][0];
            expect(args.components).toHaveLength(1);
        });

        test("EXPECT interaction.reply to be called with success message", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith({
                content: "Success",
                ephemeral: true,
            });
        });
    });
});
